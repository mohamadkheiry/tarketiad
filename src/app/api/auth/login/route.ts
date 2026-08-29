import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const credentials = loginSchema.parse(await request.json());
    const user = await db.user.findUnique({ where: { email: credentials.email.toLowerCase() } });
    if (!user?.active || !(await compare(credentials.password, user.passwordHash))) {
      return NextResponse.json({ message: "ایمیل یا گذرواژه صحیح نیست." }, { status: 401 });
    }
    await createSession(user);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "ورود انجام نشد. اطلاعات را بررسی کنید." }, { status: 400 });
  }
}
