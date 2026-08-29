import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, CircleHelp, ClipboardList, FileText, Home, LogOut, Menu, Settings, Stethoscope, Users } from "lucide-react";
import { Brand } from "@/components/Brand";
import { getSession } from "@/lib/auth";

const links = [
  ["/admin", "نمای کلی", BarChart3], ["/admin/requests", "درخواست‌های مشاوره", ClipboardList],
  ["/admin/content", "محتوا", FileText], ["/admin/services", "خدمات", Stethoscope],
  ["/admin/faqs", "پرسش‌های متداول", CircleHelp], ["/admin/users", "کاربران", Users], ["/admin/settings", "تنظیمات", Settings],
] as const;

export async function AdminShell({ children, active, title, description, action }: { children: React.ReactNode; active: string; title: string; description?: string; action?: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/admin/login");
  return (
    <div className="min-h-screen bg-[#f6f8f7] text-[#17221e] lg:pr-[250px]">
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-[250px] border-l border-[#dfe7e2] bg-white lg:flex lg:flex-col">
        <div className="border-b border-[#e6ece8] px-6 py-5"><Brand /></div>
        <nav className="flex-1 space-y-1 p-4" aria-label="منوی مدیریت">{links.map(([href, label, Icon]) => <Link key={href} href={href} className={`focus-ring flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${active === href ? "bg-[#e7f0eb] text-[#0f5a3e]" : "text-[#596760] hover:bg-[#f1f5f3] hover:text-[#173d2f]"}`}><Icon size={19} strokeWidth={1.8} />{label}</Link>)}</nav>
        <div className="border-t border-[#e6ece8] p-4"><Link href="/" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#66736d] hover:bg-[#f1f5f3]"><Home size={18} />مشاهده سایت</Link><form action="/api/auth/logout" method="post"><button className="mt-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#66736d] hover:bg-red-50 hover:text-red-700"><LogOut size={18} />خروج</button></form></div>
      </aside>
      <header className="sticky top-0 z-20 border-b border-[#dfe7e2] bg-white/95 backdrop-blur"><div className="flex min-h-[72px] items-center justify-between gap-5 px-5 sm:px-8"><div className="flex items-center gap-3"><details className="relative lg:hidden"><summary className="grid size-10 cursor-pointer list-none place-items-center rounded-lg border border-[#dfe7e2]"><Menu size={20} /></summary><nav className="absolute right-0 top-12 grid w-64 gap-1 rounded-xl border border-[#dfe7e2] bg-white p-2 shadow-2xl">{links.map(([href, label, Icon]) => <Link key={href} href={href} className="flex items-center gap-3 rounded-lg p-3 text-sm font-semibold hover:bg-[#edf4ef]"><Icon size={18} />{label}</Link>)}</nav></details><div><h1 className="text-lg font-extrabold text-[#173d2f]">{title}</h1>{description ? <p className="mt-1 hidden text-xs text-[#7b8781] sm:block">{description}</p> : null}</div></div><div className="flex items-center gap-3">{action}<div className="hidden h-9 w-px bg-[#e0e7e3] sm:block" /><div className="hidden text-left sm:block"><p className="text-sm font-bold">{user.name}</p><p className="text-[11px] text-[#89948f]">{user.role === "ADMIN" ? "مدیر سیستم" : "ویرایشگر"}</p></div><span className="grid size-9 place-items-center rounded-full bg-[#e7f0eb] text-sm font-bold text-[#0f5a3e]">{user.name.slice(0, 1)}</span></div></div></header>
      <main className="p-4 sm:p-8">{children}</main>
    </div>
  );
}
