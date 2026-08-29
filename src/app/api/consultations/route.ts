import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { consultationSchema } from "@/lib/validation";

const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && entry.resetAt > now && entry.count >= 5) {
    return NextResponse.json({ message: "تعداد درخواست‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید." }, { status: 429 });
  }
  attempts.set(ip, entry && entry.resetAt > now ? { ...entry, count: entry.count + 1 } : { count: 1, resetAt: now + 15 * 60_000 });

  try {
    const payload = consultationSchema.parse(await request.json());
    if (payload.website) return NextResponse.json({ ok: true }, { status: 201 });
    const created = await db.consultationRequest.create({
      data: {
        fullName: payload.fullName,
        phone: payload.phone,
        requestType: payload.requestType,
        preferredTime: payload.preferredTime || null,
        message: payload.message || null,
      },
    });
    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "اطلاعات واردشده کامل یا معتبر نیست." }, { status: 400 });
  }
}
