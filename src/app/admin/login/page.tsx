import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Brand } from "@/components/Brand";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSession } from "@/lib/auth";

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  return <main className="grid min-h-screen bg-[#f4f8f5] lg:grid-cols-[1fr_.85fr]"><section className="relative hidden overflow-hidden bg-[#0f4a36] p-16 text-white lg:flex lg:flex-col lg:justify-between"><div className="absolute -bottom-36 -right-36 size-[520px] rounded-full border border-white/10" /><div className="absolute -bottom-20 -right-20 size-[380px] rounded-full border border-[#e9b43a]/40" /><Brand inverse /><div className="relative max-w-lg"><LockKeyhole size={36} strokeWidth={1.4} className="text-[#e9b43a]" /><h1 className="mt-8 text-5xl font-black leading-[1.45]">مدیریت آرام، دقیق و محرمانه</h1><p className="mt-6 leading-8 text-white/65">پیگیری درخواست‌های مشاوره و مدیریت محتوای سپیدار در یک فضای امن و یکپارچه.</p></div><p className="relative text-xs text-white/40">دسترسی به این بخش فقط برای کارکنان مجاز است.</p></section><section className="flex items-center justify-center p-6"><div className="w-full max-w-md"><div className="mb-10 lg:hidden"><Brand /></div><Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#557066]"><ArrowRight size={17} />بازگشت به سایت</Link><h2 className="text-3xl font-black text-[#173d2f]">ورود به پنل مدیریت</h2><p className="mb-8 mt-3 text-sm leading-7 text-[#748179]">برای ادامه، ایمیل و گذرواژه سازمانی خود را وارد کنید.</p><LoginForm /><p className="mt-8 text-center text-xs leading-6 text-[#8a958f]">نشست شما پس از ۸ ساعت به‌صورت خودکار پایان می‌یابد.</p></div></section></main>;
}
