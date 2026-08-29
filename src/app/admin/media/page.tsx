import { AdminShell } from "@/components/admin/AdminShell";
import { MediaManager } from "@/components/admin/MediaManager";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const items = await db.mediaItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    select: { id: true, title: true, caption: true, altText: true, personName: true, type: true, category: true, storageKey: true, mimeType: true, fileSize: true, consentConfirmed: true, consentReference: true, featured: true, active: true, order: true },
  });
  return <AdminShell active="/admin/media" title="تصاویر و ویدیوها" description="مدیریت فعالیت‌های مرکز و روایت‌های بهبودی"><MediaManager initial={items} /></AdminShell>;
}
