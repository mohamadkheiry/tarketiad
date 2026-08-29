import { RequestStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await requireApiSession();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json();
  if (!Object.values(RequestStatus).includes(body.status)) return NextResponse.json({ message: "وضعیت نامعتبر است." }, { status: 400 });
  const updated = await db.consultationRequest.update({ where: { id }, data: { status: body.status, notes: String(body.notes || "").slice(0, 2000) || null } });
  await db.auditLog.create({ data: { action: "UPDATE", entity: "ConsultationRequest", entityId: id, summary: `وضعیت درخواست ${updated.fullName} تغییر کرد.`, userId: user.id } });
  return NextResponse.json(updated);
}
