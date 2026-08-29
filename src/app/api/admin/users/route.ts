import { hash } from "bcryptjs";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const user = await requireApiSession(); if (!user || user.role !== "ADMIN") return NextResponse.json({}, { status: 403 });
  const body = await request.json();
  if (!body.email || String(body.password || "").length < 10) return NextResponse.json({ message: "ایمیل و گذرواژه حداقل ۱۰ کاراکتری لازم است." }, { status: 400 });
  const created = await db.user.create({ data: { name: String(body.name).slice(0, 100), email: String(body.email).toLowerCase().slice(0, 120), passwordHash: await hash(String(body.password), 12), role: body.role === "ADMIN" ? UserRole.ADMIN : UserRole.EDITOR } });
  return NextResponse.json({ id: created.id, name: created.name, email: created.email, role: created.role, active: created.active }, { status: 201 });
}
export async function PUT(request: NextRequest) {
  const user = await requireApiSession(); if (!user || user.role !== "ADMIN") return NextResponse.json({}, { status: 403 });
  const body = await request.json();
  const updated = await db.user.update({ where: { id: body.id }, data: { name: String(body.name).slice(0, 100), role: body.role === "ADMIN" ? UserRole.ADMIN : UserRole.EDITOR, active: Boolean(body.active), ...(body.password ? { passwordHash: await hash(String(body.password), 12) } : {}) } });
  return NextResponse.json({ id: updated.id, name: updated.name, email: updated.email, role: updated.role, active: updated.active });
}
