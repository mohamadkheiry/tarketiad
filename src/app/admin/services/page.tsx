import { AdminShell } from "@/components/admin/AdminShell"; import { CollectionEditor } from "@/components/admin/Editors"; import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function ServicesPage() { const items = await db.service.findMany({ orderBy: { order: "asc" } }); return <AdminShell active="/admin/services" title="خدمات درمانی" description="افزودن، ویرایش و مرتب‌سازی خدمات"><CollectionEditor kind="services" initial={items} /></AdminShell>; }
