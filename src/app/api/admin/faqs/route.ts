import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth";
import { db } from "@/lib/db";

function data(body: Record<string, unknown>) { return { question: String(body.question || "").slice(0, 300), answer: String(body.answer || "").slice(0, 4000), order: Number(body.order) || 0, active: body.active !== false }; }
export async function POST(request: NextRequest) { if (!(await requireApiSession())) return NextResponse.json({}, { status: 401 }); const item = await db.faq.create({ data: data(await request.json()) }); return NextResponse.json(item, { status: 201 }); }
export async function PUT(request: NextRequest) { if (!(await requireApiSession())) return NextResponse.json({}, { status: 401 }); const body = await request.json(); return NextResponse.json(await db.faq.update({ where: { id: body.id }, data: data(body) })); }
export async function DELETE(request: NextRequest) { if (!(await requireApiSession())) return NextResponse.json({}, { status: 401 }); const { id } = await request.json(); await db.faq.delete({ where: { id } }); return NextResponse.json({ ok: true }); }
