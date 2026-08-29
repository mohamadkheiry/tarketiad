import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, Check, ChevronLeft, ClipboardCheck, HeartHandshake, LockKeyhole, Menu, Phone, Route, Sparkles, UsersRound } from "lucide-react";
import { Brand } from "@/components/Brand";
import { ConsultationForm } from "@/components/ConsultationForm";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const fallbackServices = [
  ["ارزیابی و برنامه درمانی تخصصی", "شناخت دقیق نیازها و شرایط شما برای طراحی یک مسیر شخصی‌سازی‌شده."],
  ["سم‌زدایی ایمن و تحت نظارت", "پایش حرفه‌ای وضعیت جسمی و روانی در محیطی آرام و مراقبت‌شده."],
  ["روان‌درمانی فردی و گروهی", "شناخت الگوها و یادگیری مهارت‌های ماندگار برای ادامه مسیر."],
  ["توانمندسازی خانواده", "آموزش و همراهی خانواده برای ساختن یک محیط امن و حمایتگر."],
  ["پیشگیری از بازگشت و پیگیری", "برنامه‌ای عملی برای حفظ دستاوردها و تداوم ارتباط با تیم درمان."],
];
const fallbackFaqs = [
  ["آیا همه مراحل درمان محرمانه انجام می‌شود؟", "بله. حفظ حریم خصوصی مراجعان و خانواده‌ها یکی از اصول اصلی مرکز است."],
  ["مدت زمان درمان چقدر است؟", "مدت درمان برای همه یکسان نیست و پس از ارزیابی اولیه و متناسب با شرایط فرد پیشنهاد می‌شود."],
  ["آیا خانواده در روند درمان نقش دارد؟", "در صورت رضایت مراجع و متناسب با برنامه درمان، خانواده با آموزش و جلسات حمایتی مشارکت می‌کند."],
  ["پس از ترخیص، پیگیری ادامه خواهد داشت؟", "بله. برنامه مراقبت پس از ترخیص برای حمایت از تداوم مسیر طراحی می‌شود."],
];

async function getHomeData() {
  try {
    const [services, faqs, entries, settings] = await Promise.all([
      db.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
      db.faq.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
      db.contentEntry.findMany({ where: { group: "home" } }),
      db.siteSetting.findUnique({ where: { id: 1 } }),
    ]);
    return { services, faqs, content: Object.fromEntries(entries.map((entry) => [entry.key, entry.value])), settings };
  } catch {
    return { services: [], faqs: [], content: {} as Record<string, string>, settings: null };
  }
}

export default async function Home() {
  const { services, faqs, content, settings } = await getHomeData();
  const serviceItems = services.length ? services.map((item) => [item.title, item.summary]) : fallbackServices;
  const faqItems = faqs.length ? faqs.map((item) => [item.question, item.answer]) : fallbackFaqs;
  const text = (key: string, fallback: string) => content[key] || fallback;
  const phone = settings?.phone || "021-12345678";
  return (
    <main className="overflow-hidden">
      <header className="sticky top-0 z-50 border-b border-[#e7ece9] bg-white/95 backdrop-blur-md">
        <div className="container-shell flex h-[74px] items-center justify-between gap-6">
          <Brand />
          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#3c4a44] lg:flex" aria-label="ناوبری اصلی">
            <a className="focus-ring rounded-sm text-[#0f4a36]" href="#home">خانه</a><a className="focus-ring rounded-sm transition hover:text-[#0f4a36]" href="#services">خدمات درمانی</a><a className="focus-ring rounded-sm transition hover:text-[#0f4a36]" href="#journey">مسیر درمان</a><a className="focus-ring rounded-sm transition hover:text-[#0f4a36]" href="#about">درباره ما</a><a className="focus-ring rounded-sm transition hover:text-[#0f4a36]" href="#faq">پرسش‌ها</a>
          </nav>
          <div className="flex items-center gap-2"><a href="#consultation" className="btn-primary header-cta"><Phone size={17} />مشاوره محرمانه</a><details className="relative lg:hidden"><summary className="focus-ring grid size-11 cursor-pointer list-none place-items-center rounded-lg border border-[#dce6e0]" aria-label="باز کردن منو"><Menu size={21} /></summary><nav className="absolute left-0 top-14 grid w-56 gap-1 rounded-xl border border-[#dce6e0] bg-white p-2 text-sm font-semibold shadow-xl"><a className="rounded-lg p-3 hover:bg-[#edf4ef]" href="#home">خانه</a><a className="rounded-lg p-3 hover:bg-[#edf4ef]" href="#services">خدمات درمانی</a><a className="rounded-lg p-3 hover:bg-[#edf4ef]" href="#journey">مسیر درمان</a><a className="rounded-lg p-3 hover:bg-[#edf4ef]" href="#about">درباره ما</a><a className="rounded-lg p-3 hover:bg-[#edf4ef]" href="#faq">پرسش‌ها</a></nav></details></div>
        </div>
      </header>

      <section id="home" className="border-b border-[#edf1ef] bg-white">
        <div className="container-shell grid min-h-[690px] items-center gap-12 py-10 lg:grid-cols-[.9fr_1.1fr] lg:py-16">
          <div className="animate-rise order-2 lg:order-1">
            <h1 className="display-title max-w-xl text-[clamp(2.65rem,5.1vw,5rem)]">{text("hero.title", "بازگشت به زندگی، از همین امروز")}</h1><div className="mt-5 h-0.5 w-24 bg-[#e9b43a]" />
            <p className="body-copy mt-7 max-w-xl text-[1.05rem]">{text("hero.description", "در سپیدار، درمان اعتیاد با همراهی تیم تخصصی، برنامه شخصی‌سازی‌شده و حفظ کامل حریم خصوصی آغاز می‌شود.")}</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#consultation" className="btn-primary"><Phone size={18} />مشاوره محرمانه</a><a href="#journey" className="btn-secondary">آشنایی با مسیر درمان<ChevronLeft size={18} /></a></div>
            <ul className="mt-10 grid gap-4 border-t border-[#e1e8e4] pt-7 text-sm text-[#3e4d46] sm:grid-cols-2" aria-label="ویژگی‌های مرکز"><li className="flex items-center gap-3"><LockKeyhole className="text-[#1b674c]" size={20} /><span><b className="block">حریم خصوصی</b><span className="text-xs text-[#7b8781]">محرمانه و محترمانه</span></span></li><li className="flex items-center gap-3"><UsersRound className="text-[#1b674c]" size={20} /><span><b className="block">تیم همراه</b><span className="text-xs text-[#7b8781]">چندتخصصی و پاسخ‌گو</span></span></li><li className="flex items-center gap-3"><ClipboardCheck className="text-[#1b674c]" size={20} /><span><b className="block">برنامه شخصی</b><span className="text-xs text-[#7b8781]">متناسب با هر فرد</span></span></li><li className="flex items-center gap-3"><HeartHandshake className="text-[#1b674c]" size={20} /><span><b className="block">بدون قضاوت</b><span className="text-xs text-[#7b8781]">با کرامت انسانی</span></span></li></ul>
          </div>
          <div className="relative order-1 h-[420px] lg:order-2 lg:h-[590px]"><Image src="/images/clinic-lounge.png" alt="فضای آرام و روشن مرکز بازتوانی سپیدار" fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="rounded-[0_0_28px_28px] object-cover lg:rounded-[28px_0_28px_28px]" /><div className="absolute bottom-5 left-5 right-5 rounded-xl bg-white/92 p-4 shadow-lg backdrop-blur sm:right-auto sm:w-64"><p className="text-sm font-bold text-[#0f4a36]">اولین قدم پیچیده نیست</p><p className="mt-1 text-xs leading-6 text-[#66736d]">یک گفت‌وگوی کوتاه، محرمانه و بدون تعهد.</p></div></div>
        </div>
      </section>

      <section id="services" className="section-space bg-[#f4f8f5]"><div className="container-shell grid gap-14 lg:grid-cols-[.72fr_1.28fr]"><div className="lg:sticky lg:top-28 lg:self-start"><span className="text-sm font-bold text-[#9c7413]">خدمات درمانی</span><h2 className="display-title mt-4 text-[clamp(2rem,3.5vw,3.35rem)]">درمان، متناسب با داستان هر فرد</h2><p className="body-copy mt-5">مسیر درمان با شنیدن دقیق، ارزیابی حرفه‌ای و احترام به شرایط فرد آغاز می‌شود؛ نه با یک نسخه یکسان برای همه.</p><a href="#consultation" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#0f4a36]">گفت‌وگو با مشاور <ArrowLeft size={17} /></a></div><div className="divide-y divide-[#cfdcd4] border-y border-[#cfdcd4]">{serviceItems.map(([title, summary], index) => <article key={title} className="group grid gap-4 py-7 sm:grid-cols-[58px_1fr_auto] sm:items-center"><span className="text-2xl font-extralight text-[#a7b7ae]">۰{index + 1}</span><div><h3 className="text-lg font-extrabold text-[#173d2f]">{title}</h3><p className="mt-2 text-sm leading-7 text-[#66736d]">{summary}</p></div><span className="grid size-10 place-items-center rounded-full border border-[#b8c9bf] text-[#175b43] transition group-hover:bg-[#0f4a36] group-hover:text-white"><ArrowLeft size={17} /></span></article>)}</div></div></section>

      <section id="journey" className="section-space bg-white"><div className="container-shell"><div className="mx-auto max-w-2xl text-center"><span className="text-sm font-bold text-[#9c7413]">از تماس تا بازتوانی</span><h2 className="display-title mt-4 text-[clamp(2rem,3.5vw,3.35rem)]">{text("journey.title", "یک مسیر روشن برای شروع دوباره")}</h2></div><div className="relative mt-16 grid gap-8 md:grid-cols-4 md:gap-0"><div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-[#cddad2] md:block" />{[[Phone,"تماس و مشاوره اولیه","در فضایی امن، نیازها و نگرانی‌های شما را می‌شنویم."],[ClipboardCheck,"ارزیابی تخصصی","شرایط جسمی، روانی و خانوادگی با دقت بررسی می‌شود."],[CalendarCheck,"آغاز برنامه درمان","برنامه شخصی با همراهی تیم تخصصی شروع می‌شود."],[Route,"بازسازی و پیگیری","مهارت‌های زندگی و برنامه ادامه مسیر شکل می‌گیرد."]].map(([Icon,title,description], index) => { const StepIcon = Icon as typeof Phone; return <article key={title as string} className="relative px-5 text-center"><span className="relative z-10 mx-auto grid size-14 place-items-center rounded-full bg-[#0f4a36] text-white shadow-[0_0_0_8px_white]"><StepIcon size={21} /></span><span className="mt-5 block text-xs font-bold text-[#a07817]">مرحله ۰{index + 1}</span><h3 className="mt-2 font-extrabold text-[#173d2f]">{title as string}</h3><p className="mt-3 text-sm leading-7 text-[#718078]">{description as string}</p></article>; })}</div></div></section>

      <section id="about" className="section-space bg-[#edf4ef]"><div className="container-shell grid items-center gap-12 lg:grid-cols-[1.25fr_.75fr]"><div className="relative min-h-[420px] overflow-hidden rounded-[24px] lg:min-h-[560px]"><Image src="/images/clinic-courtyard.png" alt="حیاط سبز و امن مرکز سپیدار" fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" /></div><div><span className="text-sm font-bold text-[#9c7413]">فضای مرکز</span><h2 className="display-title mt-4 text-[clamp(2rem,3.5vw,3.35rem)]">{text("facility.title", "محیطی امن برای بازسازی")}</h2><p className="body-copy mt-6">{text("facility.description", "فضای سپیدار با طراحی آرامش‌بخش، حریم خصوصی کامل و امکانات رفاهی مناسب، تجربه‌ای امن و محترمانه را برای شما فراهم می‌کند.")}</p><ul className="mt-7 grid gap-3 text-sm font-semibold text-[#335044]"><li className="flex gap-3"><Check size={18} className="text-[#b4871e]" />فضای اقامتی آرام و غیر بیمارستانی</li><li className="flex gap-3"><Check size={18} className="text-[#b4871e]" />حفظ حریم و کرامت مراجعان</li><li className="flex gap-3"><Check size={18} className="text-[#b4871e]" />دسترسی به تیم تخصصی در طول مسیر</li></ul><a href="#consultation" className="btn-primary mt-8">هماهنگی بازدید و مشاوره<ChevronLeft size={18} /></a></div></div></section>

      <section className="bg-white py-20"><div className="container-shell grid gap-8 border-y border-[#dce6e0] py-14 lg:grid-cols-[.35fr_1fr] lg:items-center"><div className="flex items-center gap-4 text-[#0f4a36]"><Sparkles size={32} strokeWidth={1.4} /><span className="text-sm font-bold">روایت یک شروع دوباره</span></div><blockquote className="text-xl font-medium leading-[2] text-[#30443b] sm:text-2xl">«اینجا قبل از هر چیز شنیده شدم. مسیر ساده نبود، اما برای اولین بار احساس کردم قرار نیست آن را تنها طی کنم.»<footer className="mt-4 text-sm font-normal text-[#7a8780]">— یکی از مراجعان پیشین؛ نام محفوظ است</footer></blockquote></div></section>

      <section id="faq" className="section-space bg-white pt-8"><div className="container-shell grid gap-12 lg:grid-cols-[.55fr_1fr]"><div><span className="text-sm font-bold text-[#9c7413]">پیش از شروع</span><h2 className="display-title mt-4 text-[clamp(2rem,3.5vw,3.35rem)]">پرسش‌های پرتکرار</h2><p className="body-copy mt-5">اگر پاسخ پرسش شما اینجا نیست، مشاوران ما آماده‌اند تا محرمانه و بدون قضاوت همراهتان باشند.</p></div><div className="divide-y divide-[#dce6e0] border-y border-[#dce6e0]">{faqItems.map(([question, answer], index) => <details key={question} className="group py-1" open={index === 0}><summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-5 rounded-md py-5 font-bold text-[#243c32]"><span>{question}</span><ChevronLeft size={19} className="shrink-0 transition group-open:-rotate-90" /></summary><p className="body-copy max-w-2xl pb-6 text-sm">{answer}</p></details>)}</div></div></section>

      <section id="consultation" className="section-space bg-[#f4f8f5]"><div className="container-shell grid overflow-hidden rounded-[24px] border border-[#d9e5de] bg-white shadow-[0_24px_80px_rgba(15,74,54,.08)] lg:grid-cols-[.7fr_1.3fr]"><div className="relative overflow-hidden bg-[#0f4a36] p-8 text-white sm:p-12"><div className="absolute -bottom-16 -left-12 size-64 rounded-full border border-white/10" /><div className="absolute -bottom-6 -left-4 size-40 rounded-full border border-[#e9b43a]/40" /><h2 className="relative text-3xl font-black leading-[1.5]">{text("cta.title", "برای شروع، فقط یک گفت‌وگو کافی‌ست")}</h2><p className="relative mt-5 leading-8 text-white/72">{text("cta.description", "ما اینجاییم تا بدون قضاوت، اولین قدم را کنار شما برداریم.")}</p><div className="relative mt-12 border-t border-white/15 pt-7"><p className="text-xs text-white/60">تماس مستقیم</p><a dir="ltr" className="mt-2 inline-block text-xl font-bold" href={`tel:${phone.replace(/\D/g, "")}`}>{phone}</a><p className="mt-5 text-xs leading-6 text-white/55">در شرایط اورژانسی پزشکی، با ۱۱۵ تماس بگیرید.</p></div></div><div className="p-7 sm:p-12"><h3 className="text-xl font-extrabold text-[#183c2f]">درخواست تماس مشاور</h3><p className="mb-7 mt-2 text-sm leading-7 text-[#718078]">اطلاعات زیر را وارد کنید تا در زمان مناسب با شما تماس بگیریم.</p><ConsultationForm /></div></div></section>

      <footer className="bg-[#082d21] text-white"><div className="container-shell grid gap-10 py-14 md:grid-cols-3"><div><Brand inverse /><p className="mt-5 max-w-sm text-sm leading-7 text-white/62">همراهی تخصصی و محرمانه برای ساختن مسیری پایدار به سوی زندگی سالم‌تر.</p></div><div><h3 className="text-sm font-bold text-[#e9b43a]">دسترسی سریع</h3><nav className="mt-5 grid gap-3 text-sm text-white/70"><a href="#services">خدمات درمانی</a><a href="#journey">مسیر درمان</a><a href="#faq">پرسش‌های پرتکرار</a><Link href="/admin/login">ورود کارکنان</Link></nav></div><div><h3 className="text-sm font-bold text-[#e9b43a]">اطلاعات تماس</h3><div className="mt-5 grid gap-3 text-sm text-white/70"><a dir="ltr" className="w-fit" href={`tel:${phone.replace(/\D/g, "")}`}>{phone}</a><a href={`mailto:${settings?.email || "info@sepidarcenter.ir"}`}>{settings?.email || "info@sepidarcenter.ir"}</a><p>{settings?.workingHours || "همه‌روزه، ساعت ۸ تا ۲۲"}</p></div></div></div><div className="border-t border-white/10"><div className="container-shell flex flex-col gap-3 py-5 text-xs leading-6 text-white/45 sm:flex-row sm:justify-between"><span>© ۱۴۰۵ مرکز بازتوانی سپیدار</span><span>{settings?.emergencyMessage || "این وب‌سایت جایگزین خدمات اورژانسی نیست. در شرایط فوری با ۱۱۵ تماس بگیرید."}</span></div></div></footer>
      <a href="#consultation" className="focus-ring fixed bottom-5 left-5 z-40 grid size-14 place-items-center rounded-full bg-[#e9b43a] text-[#15372b] shadow-xl transition hover:-translate-y-1" aria-label="درخواست مشاوره"><Phone size={22} /></a>
    </main>
  );
}
