import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(request: NextRequest) {
  const user = await requireApiSession(); if (!user) return NextResponse.json({}, { status: 401 });
  const body = await request.json();
  const fields = ["centerName", "phone", "mobile", "email", "address", "workingHours", "emergencyMessage"] as const;
  const data = Object.fromEntries(fields.map((field) => [field, String(body[field] || "").slice(0, 1000)]));
  const settings = await db.siteSetting.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
  return NextResponse.json(settings);
}
