import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(request: NextRequest) {
  const user = await requireApiSession();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const entries = await request.json() as Array<{ key: string; value: string }>;
  await db.$transaction(entries.map((entry) => db.contentEntry.update({ where: { key: entry.key }, data: { value: entry.value.slice(0, 5000) } })));
  await db.auditLog.create({ data: { action: "UPDATE", entity: "ContentEntry", summary: "محتوای صفحه اصلی به‌روزرسانی شد.", userId: user.id } });
  return NextResponse.json({ ok: true });
}
