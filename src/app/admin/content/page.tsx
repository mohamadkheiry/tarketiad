import { AdminShell } from "@/components/admin/AdminShell";
import { ContentEditor } from "@/components/admin/Editors";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function ContentPage() { const items = await db.contentEntry.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] }); return <AdminShell active="/admin/content" title="محتوای سایت" description="ویرایش متن‌های کلیدی صفحه اصلی"><ContentEditor initial={items.map(({ key,label,value }) => ({ key,label,value }))} /></AdminShell>; }
