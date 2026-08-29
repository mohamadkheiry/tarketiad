import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, Check, ChevronLeft, ClipboardCheck, HeartHandshake, LockKeyhole, Menu, Phone, Route, Sparkles, UsersRound } from "lucide-react";
import { Brand } from "@/components/Brand";
import { ConsultationForm } from "@/components/ConsultationForm";
import { MediaShowcase } from "@/components/MediaShowcase";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const fallbackServices = [
  ["ارزیابی جامع و طراحی مسیر مراقبت", "بررسی وضعیت جسمی و روانی، الگوی مصرف و شرایط زندگی برای انتخاب مسیر مناسب."],
  ["مدیریت ایمن مرحله قطع مصرف", "بررسی نیاز به مراقبت پزشکی و پایش علائم، متناسب با شرایط هر فرد."],
  ["درمان‌های روان‌شناختی فردی و گروهی", "کار روی محرک‌ها، مهارت‌های مقابله‌ای، تنظیم هیجان و تصمیم‌های روزمره."],
  ["آموزش و همراهی خانواده", "کمک به خانواده برای ایجاد مرزهای سالم، ارتباط مؤثر و حمایت بدون فرسودگی."],
  ["تداوم بهبودی و پیشگیری از بازگشت", "برنامه‌ای قابل اجرا برای موقعیت‌های پرخطر، پیگیری و بازگشت به نقش‌های زندگی."],
];
const fallbackFaqs = [
  ["آیا همه مراحل درمان محرمانه انجام می‌شود؟", "اطلاعات مراجع و خانواده فقط در چارچوب ضوابط مرکز، ضرورت‌های درمانی و قوانین مربوط نگهداری و استفاده می‌شود."],
  ["در اولین تماس چه اتفاقی می‌افتد؟", "مشاور شرایط کلی شما را می‌شنود، به پرسش‌های اولیه پاسخ می‌دهد و قدم بعدی را بدون اجبار به تصمیم فوری توضیح می‌دهد."],
  ["مدت زمان درمان چقدر است؟", "یک زمان ثابت برای همه وجود ندارد و مدت مراقبت پس از ارزیابی و متناسب با شرایط فرد پیشنهاد می‌شود."],
  ["خانواده چگونه می‌تواند کمک کند؟", "با رضایت مراجع، خانواده می‌تواند آموزش ببیند، نشانه‌های هشدار را بشناسد و مرزهای سالم‌تری بسازد."],
  ["آیا بازگشت به مصرف یعنی درمان شکست خورده است؟", "خیر. این اتفاق می‌تواند نشانه نیاز به ارزیابی دوباره و اصلاح برنامه مراقبت باشد."],
  ["آیا می‌توان مصرف را بدون ارزیابی پزشکی قطع کرد؟", "قطع ناگهانی بعضی مواد می‌تواند خطرناک باشد؛ پیش از آن با پزشک یا متخصص واجد صلاحیت مشورت کنید."],
];

async function getHomeData() {
  try {
    const [services, faqs, entries, settings, media] = await Promise.all([
      db.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
      db.faq.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
      db.contentEntry.findMany({ where: { group: "home" } }),
      db.siteSetting.findUnique({ where: { id: 1 } }),
      db.mediaItem.findMany({
        where: { active: true, OR: [{ category: "ACTIVITY" }, { category: "RECOVERY_STORY", consentConfirmed: true }] },
        orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
        select: { id: true, title: true, caption: true, altText: true, personName: true, type: true, category: true, storageKey: true, featured: true },
      }),
    ]);
    return { services, faqs, content: Object.fromEntries(entries.map((entry) => [entry.key, entry.value])), settings, media };
  } catch {
    return { services: [], faqs: [], content: {} as Record<string, string>, settings: null, media: [] };
  }
}

export default async function Home() {
  const { services, faqs, content, settings, media } = await getHomeData();
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
            <a className="focus-ring rounded-sm text-[#0f4a36]" href="#home">خانه</a><a className="focus-ring rounded-sm transition hover:text-[#0f4a36]" href="#services">خدمات درمانی</a><a className="focus-ring rounded-sm transition hover:text-[#0f4a36]" href="#journey">مسیر درمان</a><a className="focus-ring rounded-sm transition hover:text-[#0f4a36]" href="#media">رسانه‌ها</a><a className="focus-ring rounded-sm transition hover:text-[#0f4a36]" href="#about">درباره ما</a><a className="focus-ring rounded-sm transition hover:text-[#0f4a36]" href="#faq">پرسش‌ها</a>
          </nav>
          <div className="flex items-center gap-2"><a href="#consultation" className="btn-primary header-cta"><Phone size={17} />مشاوره محرمانه</a><details className="relative lg:hidden"><summary className="focus-ring grid size-11 cursor-pointer list-none place-items-center rounded-lg border border-[#dce6e0]" aria-label="باز کردن منو"><Menu size={21} /></summary><nav className="absolute left-0 top-14 grid w-56 gap-1 rounded-xl border border-[#dce6e0] bg-white p-2 text-sm font-semibold shadow-xl"><a className="rounded-lg p-3 hover:bg-[#edf4ef]" href="#home">خانه</a><a className="rounded-lg p-3 hover:bg-[#edf4ef]" href="#services">خدمات درمانی</a><a className="rounded-lg p-3 hover:bg-[#edf4ef]" href="#journey">مسیر درمان</a><a className="rounded-lg p-3 hover:bg-[#edf4ef]" href="#media">رسانه‌ها</a><a className="rounded-lg p-3 hover:bg-[#edf4ef]" href="#about">درباره ما</a><a className="rounded-lg p-3 hover:bg-[#edf4ef]" href="#faq">پرسش‌ها</a></nav></details></div>
        </div>
      </header>

      <section id="home" className="border-b border-[#edf1ef] bg-white">
        <div className="container-shell grid min-h-[690px] items-center gap-12 py-10 lg:grid-cols-[.9fr_1.1fr] lg:py-16">
          <div className="animate-rise order-2 lg:order-1">
            <h1 className="display-title max-w-xl text-[clamp(2.65rem,5.1vw,5rem)]">{text("hero.title", "راه بازگشت، از یک گفت‌وگوی امن آغاز می‌شود")}</h1><div className="mt-5 h-0.5 w-24 bg-[#e9b43a]" />
            <p className="body-copy mt-7 max-w-xl text-[1.05rem]">{text("hero.description", "اگر مصرف مواد زندگی شما یا یکی از عزیزانتان را دشوار کرده است، لازم نیست این مسیر را تنها طی کنید. شروع راه با شنیدن بدون قضاوت، ارزیابی دقیق و طراحی برنامه‌ای متناسب با شرایط هر فرد است.")}</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#consultation" className="btn-primary"><Phone size={18} />مشاوره محرمانه</a><a href="#journey" className="btn-secondary">آشنایی با مسیر درمان<ChevronLeft size={18} /></a></div>
            <ul className="mt-10 grid gap-4 border-t border-[#e1e8e4] pt-7 text-sm text-[#3e4d46] sm:grid-cols-2" aria-label="اصول همراهی"><li className="flex items-center gap-3"><LockKeyhole className="text-[#1b674c]" size={20} /><span><b className="block">حریم خصوصی</b><span className="text-xs text-[#7b8781]">محرمانه و محترمانه</span></span></li><li className="flex items-center gap-3"><UsersRound className="text-[#1b674c]" size={20} /><span><b className="block">تصمیم مشترک</b><span className="text-xs text-[#7b8781]">روشن و قابل فهم</span></span></li><li className="flex items-center gap-3"><ClipboardCheck className="text-[#1b674c]" size={20} /><span><b className="block">برنامه شخصی</b><span className="text-xs text-[#7b8781]">متناسب با هر فرد</span></span></li><li className="flex items-center gap-3"><HeartHandshake className="text-[#1b674c]" size={20} /><span><b className="block">بدون قضاوت</b><span className="text-xs text-[#7b8781]">با کرامت انسانی</span></span></li></ul>
          </div>
          <div className="relative order-1 h-[420px] lg:order-2 lg:h-[590px]"><Image src="/images/clinic-lounge.png" alt="فضای آرام و روشن مرکز بازتوانی سپیدار" fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="rounded-[0_0_28px_28px] object-cover lg:rounded-[28px_0_28px_28px]" /></div>
        </div>
      </section>

      <section id="services" className="section-space bg-[#f4f8f5]"><div className="container-shell grid gap-14 lg:grid-cols-[.72fr_1.28fr]"><div className="lg:sticky lg:top-28 lg:self-start"><span className="text-sm font-bold text-[#9c7413]">{text("services.kicker", "خدمات درمان و بهبودی")}</span><h2 className="display-title mt-4 text-[clamp(2rem,3.5vw,3.35rem)]">{text("services.title", "یک برنامه واحد برای همه وجود ندارد")}</h2><p className="body-copy mt-5">{text("services.description", "مسیر مناسب با شناخت نیازهای جسمی، روانی، خانوادگی و اجتماعی هر فرد شکل می‌گیرد و در طول درمان بازبینی می‌شود.")}</p><a href="#consultation" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#0f4a36]">گفت‌وگو با مشاور <ArrowLeft size={17} /></a></div><div className="divide-y divide-[#cfdcd4] border-y border-[#cfdcd4]">{serviceItems.map(([title, summary], index) => <article key={title} className="group grid gap-4 py-7 sm:grid-cols-[58px_1fr_auto] sm:items-center"><span className="text-2xl font-extralight text-[#a7b7ae]">۰{index + 1}</span><div><h3 className="text-lg font-extrabold text-[#173d2f]">{title}</h3><p className="mt-2 text-sm leading-7 text-[#66736d]">{summary}</p></div><span className="grid size-10 place-items-center rounded-full border border-[#b8c9bf] text-[#175b43] transition group-hover:bg-[#0f4a36] group-hover:text-white"><ArrowLeft size={17} /></span></article>)}</div></div></section>

      <section id="journey" className="section-space bg-white"><div className="container-shell"><div className="mx-auto max-w-2xl text-center"><span className="text-sm font-bold text-[#9c7413]">{text("journey.kicker", "از نخستین تماس تا ادامه بهبودی")}</span><h2 className="display-title mt-4 text-[clamp(2rem,3.5vw,3.35rem)]">{text("journey.title", "شروع درمان، قدم‌به‌قدم و قابل فهم")}</h2></div><div className="relative mt-16 grid gap-8 md:grid-cols-4 md:gap-0"><div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-[#cddad2] md:block" />{[[Phone,"گفت‌وگوی اولیه","نگرانی‌ها را می‌شنویم، به پرسش‌ها پاسخ می‌دهیم و قدم بعدی را توضیح می‌دهیم."],[ClipboardCheck,"ارزیابی جامع","وضعیت جسمی و روانی، الگوی مصرف و شرایط زندگی بررسی می‌شود."],[CalendarCheck,"توافق بر سر برنامه","هدف‌ها، سطح مراقبت و مسیر پیگیری به‌صورت روشن با شما مرور می‌شود."],[Route,"تداوم بهبودی","مهارت‌ها، شبکه حمایت و برنامه مواجهه با موقعیت‌های پرخطر شکل می‌گیرد."]].map(([Icon,title,description], index) => { const StepIcon = Icon as typeof Phone; return <article key={title as string} className="relative px-5 text-center"><span className="relative z-10 mx-auto grid size-14 place-items-center rounded-full bg-[#0f4a36] text-white shadow-[0_0_0_8px_white]"><StepIcon size={21} /></span><span className="mt-5 block text-xs font-bold text-[#a07817]">مرحله ۰{index + 1}</span><h3 className="mt-2 font-extrabold text-[#173d2f]">{title as string}</h3><p className="mt-3 text-sm leading-7 text-[#718078]">{description as string}</p></article>; })}</div></div></section>

      <section id="about" className="section-space bg-[#edf4ef]"><div className="container-shell grid items-center gap-12 lg:grid-cols-[1.25fr_.75fr]"><div className="relative min-h-[420px] overflow-hidden rounded-[24px] lg:min-h-[560px]"><Image src="/images/clinic-courtyard.png" alt="فضای سبز و آرام مرکز سپیدار" fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" /></div><div><span className="text-sm font-bold text-[#9c7413]">{text("facility.kicker", "فضای مراقبت")}</span><h2 className="display-title mt-4 text-[clamp(2rem,3.5vw,3.35rem)]">{text("facility.title", "فضایی آرام، محترمانه و دور از قضاوت")}</h2><p className="body-copy mt-6">{text("facility.description", "محیط درمان باید امکان گفت‌وگوی امن، حفظ حریم شخصی و تمرکز بر بهبودی را فراهم کند. پیش از پذیرش می‌توانید درباره فضای مرکز، قوانین حضور و امکانات متناسب با نیاز خود پرس‌وجو کنید.")}</p><ul className="mt-7 grid gap-3 text-sm font-semibold text-[#335044]"><li className="flex gap-3"><Check size={18} className="text-[#b4871e]" />توضیح شفاف قوانین و مراحل پیش از پذیرش</li><li className="flex gap-3"><Check size={18} className="text-[#b4871e]" />احترام به حریم، انتخاب و کرامت مراجع</li><li className="flex gap-3"><Check size={18} className="text-[#b4871e]" />امکان پرس‌وجو درباره امکانات متناسب با نیاز شما</li></ul><a href="#consultation" className="btn-primary mt-8">هماهنگی بازدید و گفت‌وگو<ChevronLeft size={18} /></a></div></div></section>

      <MediaShowcase items={media} />

      <section className="bg-white py-20"><div className="container-shell grid gap-8 border-y border-[#dce6e0] py-14 lg:grid-cols-[.35fr_1fr] lg:items-center"><div className="flex items-center gap-4 text-[#0f4a36]"><Sparkles size={32} strokeWidth={1.4} /><span className="text-sm font-bold">{text("principle.label", "نگاه ما به بهبودی")}</span></div><blockquote className="text-xl font-medium leading-[2] text-[#30443b] sm:text-2xl">«{text("principle.quote", "بهبودی فقط متوقف‌کردن مصرف نیست؛ فرایندی برای بازسازی سلامت، روابط، اعتماد و توان تصمیم‌گیری در زندگی روزمره است.")}»</blockquote></div></section>

      <section id="faq" className="section-space bg-white pt-8"><div className="container-shell grid gap-12 lg:grid-cols-[.55fr_1fr]"><div><span className="text-sm font-bold text-[#9c7413]">{text("faq.kicker", "پیش از شروع")}</span><h2 className="display-title mt-4 text-[clamp(2rem,3.5vw,3.35rem)]">{text("faq.title", "پرسش‌هایی که دانستن پاسخشان کمک می‌کند")}</h2><p className="body-copy mt-5">{text("faq.description", "هر شرایطی جزئیات خودش را دارد. اگر پاسخ پرسش شما اینجا نیست، می‌توانید بدون تعهد و بدون قضاوت با ما گفت‌وگو کنید.")}</p></div><div className="divide-y divide-[#dce6e0] border-y border-[#dce6e0]">{faqItems.map(([question, answer], index) => <details key={question} className="group py-1" open={index === 0}><summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-5 rounded-md py-5 font-bold text-[#243c32]"><span>{question}</span><ChevronLeft size={19} className="shrink-0 transition group-open:-rotate-90" /></summary><p className="body-copy max-w-2xl pb-6 text-sm">{answer}</p></details>)}</div></div></section>

      <section id="consultation" className="section-space bg-[#f4f8f5]"><div className="container-shell grid overflow-hidden rounded-[24px] border border-[#d9e5de] bg-white shadow-[0_24px_80px_rgba(15,74,54,.08)] lg:grid-cols-[.7fr_1.3fr]"><div className="relative overflow-hidden bg-[#0f4a36] p-8 text-white sm:p-12"><div className="absolute -bottom-16 -left-12 size-64 rounded-full border border-white/10" /><div className="absolute -bottom-6 -left-4 size-40 rounded-full border border-[#e9b43a]/40" /><h2 className="relative text-3xl font-black leading-[1.5]">{text("cta.title", "برای تصمیم‌گرفتن لازم نیست همه پاسخ‌ها را بدانید")}</h2><p className="relative mt-5 leading-8 text-white/72">{text("cta.description", "یک گفت‌وگوی اولیه کمک می‌کند شرایط روشن‌تر شود و قدم بعدی را آگاهانه انتخاب کنید.")}</p><div className="relative mt-12 border-t border-white/15 pt-7"><p className="text-xs text-white/60">تماس مستقیم</p><a dir="ltr" className="mt-2 inline-block text-xl font-bold" href={`tel:${phone.replace(/\D/g, "")}`}>{phone}</a><p className="mt-5 text-xs leading-6 text-white/55">در شرایط اورژانسی پزشکی، با ۱۱۵ تماس بگیرید.</p></div></div><div className="p-7 sm:p-12"><h3 className="text-xl font-extrabold text-[#183c2f]">{text("form.title", "درخواست گفت‌وگوی محرمانه")}</h3><p className="mb-7 mt-2 text-sm leading-7 text-[#718078]">{text("form.description", "نام و شماره‌ای را وارد کنید که در دسترس شماست. در زمان انتخابی تماس می‌گیریم و فقط اطلاعات لازم برای راهنمایی اولیه را می‌پرسیم.")}</p><ConsultationForm privacyText={text("form.privacy", "اطلاعات این فرم فقط برای هماهنگی تماس و راهنمایی اولیه استفاده می‌شود. برای شرایط اورژانسی از این فرم استفاده نکنید.")} successText={text("form.success", "درخواست شما ثبت شد. در بازه انتخابی با شما تماس می‌گیریم. اگر شرایط فوری یا خطرناک است، منتظر تماس نمانید و با ۱۱۵ تماس بگیرید.")} /></div></div></section>

      <footer className="bg-[#082d21] text-white"><div className="container-shell grid gap-10 py-14 md:grid-cols-3"><div><Brand inverse /><p className="mt-5 max-w-sm text-sm leading-7 text-white/62">{text("footer.description", "سپیدار فضایی برای شروع آگاهانه مسیر درمان است؛ با احترام به انتخاب فرد، حریم خصوصی و نقش خانواده.")}</p></div><div><h3 className="text-sm font-bold text-[#e9b43a]">دسترسی سریع</h3><nav className="mt-5 grid gap-3 text-sm text-white/70"><a href="#services">خدمات درمانی</a><a href="#journey">مسیر درمان</a><a href="#faq">پرسش‌های پرتکرار</a><Link href="/admin/login">ورود کارکنان</Link></nav></div><div><h3 className="text-sm font-bold text-[#e9b43a]">اطلاعات تماس</h3><div className="mt-5 grid gap-3 text-sm text-white/70"><a dir="ltr" className="w-fit" href={`tel:${phone.replace(/\D/g, "")}`}>{phone}</a><a href={`mailto:${settings?.email || "info@sepidarcenter.ir"}`}>{settings?.email || "info@sepidarcenter.ir"}</a><p>{settings?.workingHours || "همه‌روزه، ساعت ۸ تا ۲۲"}</p></div></div></div><div className="border-t border-white/10"><div className="container-shell flex flex-col gap-3 py-5 text-xs leading-6 text-white/45 sm:flex-row sm:justify-between"><span>© ۱۴۰۵ مرکز بازتوانی سپیدار</span><span>{settings?.emergencyMessage || "این وب‌سایت جایگزین ارزیابی پزشکی یا خدمات اورژانسی نیست. در شرایط فوری یا خطر برای خود یا دیگران با ۱۱۵ تماس بگیرید."}</span></div></div></footer>
      <a href="#consultation" className="focus-ring fixed bottom-5 left-5 z-40 grid size-14 place-items-center rounded-full bg-[#e9b43a] text-[#15372b] shadow-xl transition hover:-translate-y-1" aria-label="درخواست مشاوره"><Phone size={22} /></a>
    </main>
  );
}
