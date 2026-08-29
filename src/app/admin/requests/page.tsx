import { AdminShell } from "@/components/admin/AdminShell";
import { RequestsTable } from "@/components/admin/RequestsTable";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function RequestsPage() { const items = await db.consultationRequest.findMany({ orderBy: { createdAt: "desc" }, take: 250 }); return <AdminShell active="/admin/requests" title="درخواست‌های مشاوره" description="پیگیری تماس‌ها، ثبت یادداشت و مدیریت وضعیت"><RequestsTable initial={items.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }))} /></AdminShell>; }
