import { AdminShell } from "@/components/admin/AdminShell"; import { UsersEditor } from "@/components/admin/Editors"; import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function UsersPage() { const items = await db.user.findMany({ select: { id:true,name:true,email:true,role:true,active:true }, orderBy: { createdAt:"asc" } }); return <AdminShell active="/admin/users" title="کاربران" description="مدیریت دسترسی کارکنان پنل"><UsersEditor initial={items} /></AdminShell>; }
