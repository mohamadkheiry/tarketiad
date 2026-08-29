import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/lib/db";

const COOKIE_NAME = "sepidar_session";

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must contain at least 32 characters");
  return new TextEncoder().encode(value);
}

export async function createSession(user: { id: string; email: string; role: string }) {
  const token = await new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret());

  const store = await cookies();
  const secureCookie = process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === "true"
    : process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://") || false;
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: secureCookie,
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession() {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    const user = await db.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true, active: true },
    });
    return user?.active ? user : null;
  } catch {
    return null;
  }
}

export async function requireApiSession() {
  return getSession();
}
