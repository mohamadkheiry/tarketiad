import { AdminShell } from "@/components/admin/AdminShell"; import { CollectionEditor } from "@/components/admin/Editors"; import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function FaqsPage() { const items = await db.faq.findMany({ orderBy: { order: "asc" } }); return <AdminShell active="/admin/faqs" title="پرسش‌های متداول" description="مدیریت پرسش‌ها و پاسخ‌های صفحه اصلی"><CollectionEditor kind="faqs" initial={items} /></AdminShell>; }
