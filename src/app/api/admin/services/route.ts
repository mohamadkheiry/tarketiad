import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth";
import { db } from "@/lib/db";

function data(body: Record<string, unknown>) {
  return { title: String(body.title || "").slice(0, 120), slug: String(body.slug || "").toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 100), summary: String(body.summary || "").slice(0, 500), description: String(body.description || "").slice(0, 4000), order: Number(body.order) || 0, active: body.active !== false };
}
export async function POST(request: NextRequest) { const user = await requireApiSession(); if (!user) return NextResponse.json({}, { status: 401 }); const item = await db.service.create({ data: data(await request.json()) }); return NextResponse.json(item, { status: 201 }); }
export async function PUT(request: NextRequest) { const user = await requireApiSession(); if (!user) return NextResponse.json({}, { status: 401 }); const body = await request.json(); const item = await db.service.update({ where: { id: body.id }, data: data(body) }); return NextResponse.json(item); }
export async function DELETE(request: NextRequest) { const user = await requireApiSession(); if (!user) return NextResponse.json({}, { status: 401 }); const { id } = await request.json(); await db.service.delete({ where: { id } }); return NextResponse.json({ ok: true }); }
