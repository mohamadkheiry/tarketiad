import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, CalendarCheck, Camera, Check, ChevronLeft, ClipboardCheck, HeartHandshake, Menu, MessageCircleMore, Phone, Route, ShieldCheck, Sparkles, SunMedium, UsersRound } from "lucide-react";
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
  const phone = settings?.phone || "09357238914";
  return (
    <main className="overflow-hidden">
      <header className="sticky top-0 z-50 border-b border-[#dfe8e3]/80 bg-[#fffdf8]/90 shadow-[0_8px_30px_rgba(18,63,56,.04)] backdrop-blur-xl">
        <div className="container-shell flex h-[78px] items-center justify-between gap-6">
          <Brand />
          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#3c4a44] lg:flex" aria-label="ناوبری اصلی">
            <a className="focus-ring rounded-sm text-[#0f4a36]" href="#home">خانه</a><a className="focus-ring rounded-sm transition hover:text-[#0f4a36]" href="#services">خدمات درمانی</a><a className="focus-ring rounded-sm transition hover:text-[#0f4a36]" href="#journey">مسیر درمان</a><a className="focus-ring rounded-sm transition hover:text-[#0f4a36]" href="#media">رسانه‌ها</a><a className="focus-ring rounded-sm transition hover:text-[#0f4a36]" href="#about">درباره ما</a><a className="focus-ring rounded-sm transition hover:text-[#0f4a36]" href="#faq">پرسش‌ها</a>
          </nav>
          <div className="flex items-center gap-2"><a href="#consultation" className="btn-primary header-cta"><Phone size={17} />مشاوره محرمانه</a><details className="relative lg:hidden"><summary className="focus-ring grid size-11 cursor-pointer list-none place-items-center rounded-lg border border-[#dce6e0]" aria-label="باز کردن منو"><Menu size={21} /></summary><nav className="absolute left-0 top-14 grid w-56 gap-1 rounded-xl border border-[#dce6e0] bg-white p-2 text-sm font-semibold shadow-xl"><a className="rounded-lg p-3 hover:bg-[#edf4ef]" href="#home">خانه</a><a className="rounded-lg p-3 hover:bg-[#edf4ef]" href="#services">خدمات درمانی</a><a className="rounded-lg p-3 hover:bg-[#edf4ef]" href="#journey">مسیر درمان</a><a className="rounded-lg p-3 hover:bg-[#edf4ef]" href="#media">رسانه‌ها</a><a className="rounded-lg p-3 hover:bg-[#edf4ef]" href="#about">درباره ما</a><a className="rounded-lg p-3 hover:bg-[#edf4ef]" href="#faq">پرسش‌ها</a></nav></details></div>
        </div>
      </header>

      <section id="home" className="hero-sunrise relative overflow-hidden border-b border-[#e9e4d8]">
        <div className="hero-orb" aria-hidden="true" />
        <div className="container-shell relative grid min-h-[730px] items-center gap-12 py-10 lg:grid-cols-[.92fr_1.08fr] lg:py-16">
          <div className="animate-rise order-2 lg:order-1">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d9c28d]/60 bg-white/70 px-4 py-2 text-xs font-extrabold text-[#7b5a14] shadow-sm backdrop-blur"><SunMedium size={17} />همراه مسیر بهبودی از سال ۱۳۸۸</div>
            <h1 className="display-title max-w-2xl text-[clamp(2.65rem,5.3vw,5.35rem)]">{text("hero.title", "هر طلوع، فرصتی تازه برای بازگشت به زندگی است")}</h1>
            <p className="body-copy mt-7 max-w-xl text-[1.06rem]">{text("hero.description", "شروع درمان لازم نیست با تصمیمی کامل یا قطعی همراه باشد. در طلوع خورشید، ابتدا شرایط شما را بدون قضاوت می‌شنویم و سپس مسیر مراقبت را متناسب با نیازهای فرد و خانواده توضیح می‌دهیم. از سال ۱۳۸۸ در کنار مراجعان هستیم.")}</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#consultation" className="btn-primary"><Phone size={18} />مشاوره محرمانه</a><a href="#media" className="btn-secondary">دیدن فضای واقعی مرکز<ChevronLeft size={18} /></a></div>
            <ul className="mt-10 grid grid-cols-3 overflow-hidden rounded-2xl border border-[#deded4] bg-white/75 shadow-[0_18px_50px_rgba(18,63,56,.06)] backdrop-blur" aria-label="اطلاعات مرکز">
              <li className="p-4 sm:p-5"><b className="block text-lg text-[#123f38] sm:text-2xl">۱۳۸۸</b><span className="mt-1 block text-[10px] leading-5 text-[#728079] sm:text-xs">سال تأسیس</span></li>
              <li className="border-x border-[#e2e3da] p-4 sm:p-5"><b className="block text-lg text-[#123f38] sm:text-2xl">۱۸۵</b><span className="mt-1 block text-[10px] leading-5 text-[#728079] sm:text-xs">شماره ثبت</span></li>
              <li className="p-4 sm:p-5"><b className="block text-lg text-[#123f38] sm:text-2xl">۲۴/۷</b><span className="mt-1 block text-[10px] leading-5 text-[#728079] sm:text-xs">درخواست آنلاین</span></li>
            </ul>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="absolute -left-7 -top-7 size-36 rounded-full border border-[#eebc4f]/45 sm:size-52" aria-hidden="true" />
            <div className="relative h-[410px] overflow-hidden rounded-[28px] rounded-tr-[92px] border-[7px] border-white shadow-[0_32px_80px_rgba(18,63,56,.18)] sm:h-[520px] lg:h-[610px]">
              <Image src="/images/hero-threshold-v2.webp" alt="درگاهی روشن رو به باغ؛ نمادی از آغاز دوباره" fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062c26]/55 via-transparent to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex items-center gap-3 rounded-2xl border border-white/25 bg-[#0b382f]/75 p-4 text-white shadow-lg backdrop-blur-md sm:inset-x-auto sm:bottom-7 sm:left-7 sm:max-w-[285px]">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f5b942] text-[#173d35]"><BadgeCheck size={22} /></span>
                <span><b className="block text-sm">شروع از یک گفت‌وگوی امن</b><small className="mt-1 block text-white/65">تصویر مفهومی · فضای واقعی در بخش رسانه‌ها</small></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="section-space bg-[#f4f8f5]"><div className="container-shell grid gap-14 lg:grid-cols-[.72fr_1.28fr]"><div className="lg:sticky lg:top-28 lg:self-start"><span className="text-sm font-bold text-[#9c7413]">{text("services.kicker", "خدمات درمان و بهبودی")}</span><h2 className="display-title mt-4 text-[clamp(2rem,3.5vw,3.35rem)]">{text("services.title", "یک برنامه واحد برای همه وجود ندارد")}</h2><p className="body-copy mt-5">{text("services.description", "مسیر مناسب با شناخت نیازهای جسمی، روانی، خانوادگی و اجتماعی هر فرد شکل می‌گیرد و در طول درمان بازبینی می‌شود.")}</p><a href="#consultation" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#0f4a36]">گفت‌وگو با مشاور <ArrowLeft size={17} /></a></div><div className="divide-y divide-[#cfdcd4] border-y border-[#cfdcd4]">{serviceItems.map(([title, summary], index) => <article key={title} className="group grid gap-4 py-7 sm:grid-cols-[58px_1fr_auto] sm:items-center"><span className="text-2xl font-extralight text-[#a7b7ae]">۰{index + 1}</span><div><h3 className="text-lg font-extrabold text-[#173d2f]">{title}</h3><p className="mt-2 text-sm leading-7 text-[#66736d]">{summary}</p></div><span className="grid size-10 place-items-center rounded-full border border-[#b8c9bf] text-[#175b43] transition group-hover:bg-[#0f4a36] group-hover:text-white"><ArrowLeft size={17} /></span></article>)}</div></div></section>

      <section id="journey" className="section-space bg-white"><div className="container-shell"><div className="mx-auto max-w-2xl text-center"><span className="text-sm font-bold text-[#9c7413]">{text("journey.kicker", "از نخستین تماس تا ادامه بهبودی")}</span><h2 className="display-title mt-4 text-[clamp(2rem,3.5vw,3.35rem)]">{text("journey.title", "شروع درمان، قدم‌به‌قدم و قابل فهم")}</h2></div><div className="relative mt-16 grid gap-8 md:grid-cols-4 md:gap-0"><div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-[#cddad2] md:block" />{[[Phone,"گفت‌وگوی اولیه","نگرانی‌ها را می‌شنویم، به پرسش‌ها پاسخ می‌دهیم و قدم بعدی را توضیح می‌دهیم."],[ClipboardCheck,"ارزیابی جامع","وضعیت جسمی و روانی، الگوی مصرف و شرایط زندگی بررسی می‌شود."],[CalendarCheck,"توافق بر سر برنامه","هدف‌ها، سطح مراقبت و مسیر پیگیری به‌صورت روشن با شما مرور می‌شود."],[Route,"تداوم بهبودی","مهارت‌ها، شبکه حمایت و برنامه مواجهه با موقعیت‌های پرخطر شکل می‌گیرد."]].map(([Icon,title,description], index) => { const StepIcon = Icon as typeof Phone; return <article key={title as string} className="relative px-5 text-center"><span className="relative z-10 mx-auto grid size-14 place-items-center rounded-full bg-[#0f4a36] text-white shadow-[0_0_0_8px_white]"><StepIcon size={21} /></span><span className="mt-5 block text-xs font-bold text-[#a07817]">مرحله ۰{index + 1}</span><h3 className="mt-2 font-extrabold text-[#173d2f]">{title as string}</h3><p className="mt-3 text-sm leading-7 text-[#718078]">{description as string}</p></article>; })}</div></div></section>

      <section id="first-contact" className="overflow-hidden bg-[#092f29] text-white">
        <div className="container-shell grid min-h-[680px] lg:grid-cols-2">
          <div className="relative -mx-5 min-h-[420px] sm:mx-0 lg:min-h-full">
            <Image src="/images/consultation-editorial-v2.webp" alt="گفت‌وگویی آرام و محرمانه میان مشاور و مراجعه‌کننده؛ تصویر مفهومی" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <span className="absolute bottom-5 right-5 rounded-full border border-white/25 bg-[#092f29]/70 px-3 py-1.5 text-[10px] font-semibold text-white/75 backdrop-blur">تصویر مفهومی</span>
          </div>
          <div className="flex flex-col justify-center py-16 lg:px-16 lg:py-20">
            <span className="text-sm font-bold text-[#f5c65d]">{text("firstContact.kicker", "گفت‌وگوی نخست")}</span>
            <h2 className="mt-4 text-[clamp(2rem,3.5vw,3.35rem)] font-black leading-[1.5]">{text("firstContact.title", "اولین تماس برای روشن‌شدن مسیر است، نه گرفتن تصمیم فوری")}</h2>
            <p className="mt-6 max-w-xl text-sm leading-8 text-white/68">{text("firstContact.description", "لازم نیست از قبل همه پاسخ‌ها را بدانید. مشاور ابتدا شرایط کلی، نگرانی‌های فوری و نیاز شما را می‌شنود؛ سپس گزینه‌های قابل بررسی و قدم بعدی را به زبان روشن توضیح می‌دهد.")}</p>
            <div className="mt-9 divide-y divide-white/12 border-y border-white/12">
              {[[MessageCircleMore,"شنیدن بدون قضاوت","می‌توانید از چیزی شروع کنید که همین حالا بیشترین نگرانی را ایجاد کرده است."],[ShieldCheck,"بررسی ایمنی و فوریت","اگر نشانه‌ای از خطر یا نیاز پزشکی فوری وجود داشته باشد، مسیر مناسب توضیح داده می‌شود."],[Route,"یک قدم روشن بعدی","پایان تماس باید با یک پیشنهاد قابل فهم همراه باشد؛ نه فشار برای تصمیم‌گیری."]].map(([Icon,title,description]) => { const RowIcon = Icon as typeof Phone; return <div key={title as string} className="grid gap-3 py-5 sm:grid-cols-[46px_1fr]"><span className="grid size-10 place-items-center rounded-full bg-white/8 text-[#f5c65d]"><RowIcon size={19} /></span><div><h3 className="font-extrabold">{title as string}</h3><p className="mt-1.5 text-xs leading-6 text-white/55">{description as string}</p></div></div>; })}
            </div>
            <a href="#consultation" className="mt-8 inline-flex w-fit items-center gap-2 font-bold text-[#f5c65d]">درخواست گفت‌وگوی محرمانه<ArrowLeft size={18} /></a>
          </div>
        </div>
      </section>

      <section id="about" className="section-space bg-[#eef5f1]"><div className="container-shell grid items-center gap-12 lg:grid-cols-[1.18fr_.82fr]"><div className="relative min-h-[440px] lg:min-h-[600px]"><div className="absolute inset-0 -rotate-2 rounded-[36px] bg-[#e5b64e]" aria-hidden="true" /><div className="absolute inset-0 rotate-1 overflow-hidden rounded-[36px] border-8 border-white shadow-[0_24px_60px_rgba(18,63,56,.14)]"><Image src="/images/clinic-courtyard-v2.webp" alt="تصویر مفهومی از محیطی آرام و سبز برای مراقبت" fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" /><span className="absolute left-5 top-5 rounded-full border border-white/40 bg-[#092f29]/65 px-3 py-1.5 text-[10px] font-semibold text-white/80 backdrop-blur">تصویر مفهومی</span></div><div className="absolute -bottom-6 right-5 rounded-2xl bg-[#123f38] px-6 py-5 text-white shadow-xl sm:right-10"><b className="text-2xl text-[#f5c65d]">۱۷+ سال</b><span className="mr-3 text-sm text-white/70">تجربه همراهی</span></div></div><div><span className="text-sm font-bold text-[#9c7413]">{text("facility.kicker", "فضای مراقبت")}</span><h2 className="display-title mt-4 text-[clamp(2rem,3.5vw,3.35rem)]">{text("facility.title", "بیش از یک دهه تجربه، با احترام به کرامت انسان")}</h2><p className="body-copy mt-6">{text("facility.description", "طلوع خورشید از سال ۱۳۸۸ با شماره ثبت ۱۸۵ فعالیت می‌کند. محیط مرکز برای گفت‌وگوی امن، حفظ حریم شخصی و تمرکز بر ساختن یک مسیر پایدار به سوی بهبودی شکل گرفته است.")}</p><ul className="mt-8 grid gap-3 text-sm font-semibold text-[#335044]"><li className="flex gap-3 rounded-xl bg-white/70 p-3"><Check size={18} className="mt-1 shrink-0 text-[#b4871e]" />توضیح شفاف قوانین و مراحل پیش از پذیرش</li><li className="flex gap-3 rounded-xl bg-white/70 p-3"><Check size={18} className="mt-1 shrink-0 text-[#b4871e]" />احترام به حریم، انتخاب و کرامت مراجع</li><li className="flex gap-3 rounded-xl bg-white/70 p-3"><Check size={18} className="mt-1 shrink-0 text-[#b4871e]" />فضای واقعی مرکز در بخش تصاویر و ویدیوها</li></ul><div className="mt-8 flex flex-wrap gap-3"><a href="#consultation" className="btn-primary">هماهنگی بازدید و گفت‌وگو<ChevronLeft size={18} /></a><a href="https://www.instagram.com/kamptark_etyad_koorosh/" target="_blank" rel="noreferrer" className="btn-secondary"><Camera size={18} />اینستاگرام مرکز</a></div></div></div></section>

      <section id="family" className="section-space bg-white">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <span className="text-sm font-bold text-[#9c7413]">{text("family.kicker", "همراهی خانواده")}</span>
            <h2 className="display-title mt-4 text-[clamp(2rem,3.5vw,3.35rem)]">{text("family.title", "حمایت مؤثر، هم مهربانی می‌خواهد و هم مرز روشن")}</h2>
            <p className="body-copy mt-6">{text("family.description", "خانواده می‌تواند بخشی مهم از مسیر بهبودی باشد، اما قرار نیست همه مسئولیت درمان را به دوش بکشد. آموزش، گفت‌وگوی روشن و مراقبت از سلامت خود خانواده، حمایت را پایدارتر می‌کند.")}</p>
            <div className="mt-9 grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[[HeartHandshake,"حمایت بدون سرزنش","شنیدن، پرسیدن و پرهیز از برچسب‌زدن."],[UsersRound,"مرزهای قابل فهم","توافق روشن درباره مسئولیت‌ها و رفتارهای پذیرفتنی."],[ShieldCheck,"مراقبت از خانواده","کمک‌گرفتن برای فرسودگی، اضطراب و فشار طولانی‌مدت."]].map(([Icon,title,description]) => { const FamilyIcon = Icon as typeof Phone; return <article key={title as string} className="border-t border-[#ccd9d1] pt-5"><FamilyIcon className="text-[#a07817]" size={23} /><h3 className="mt-4 font-extrabold text-[#173d2f]">{title as string}</h3><p className="mt-2 text-xs leading-6 text-[#718078]">{description as string}</p></article>; })}
            </div>
            <p className="mt-8 border-r-2 border-[#e9b43a] pr-4 text-xs leading-7 text-[#6d7973]">مشارکت خانواده در اطلاعات و جلسات درمانی با رضایت مراجع و در چارچوب حریم خصوصی انجام می‌شود.</p>
          </div>
          <div className="relative min-h-[430px] overflow-hidden rounded-[32px] rounded-bl-[100px] shadow-[0_28px_70px_rgba(18,63,56,.15)] sm:min-h-[560px]">
            <Image src="/images/family-support-v2.webp" alt="گفت‌وگوی حمایتگرانه اعضای خانواده؛ تصویر مفهومی" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            <span className="absolute bottom-5 left-5 rounded-full border border-white/35 bg-[#092f29]/70 px-3 py-1.5 text-[10px] font-semibold text-white/80 backdrop-blur">تصویر مفهومی</span>
          </div>
        </div>
      </section>

      <MediaShowcase items={media} />

      <section className="bg-white py-20"><div className="container-shell grid gap-8 border-y border-[#dce6e0] py-14 lg:grid-cols-[.35fr_1fr] lg:items-center"><div className="flex items-center gap-4 text-[#0f4a36]"><Sparkles size={32} strokeWidth={1.4} /><span className="text-sm font-bold">{text("principle.label", "نگاه ما به بهبودی")}</span></div><blockquote className="text-xl font-medium leading-[2] text-[#30443b] sm:text-2xl">«{text("principle.quote", "بهبودی فقط متوقف‌کردن مصرف نیست؛ فرایندی برای بازسازی سلامت، روابط، اعتماد و توان تصمیم‌گیری در زندگی روزمره است.")}»</blockquote></div></section>

      <section id="faq" className="section-space bg-white pt-8"><div className="container-shell grid gap-12 lg:grid-cols-[.55fr_1fr]"><div><span className="text-sm font-bold text-[#9c7413]">{text("faq.kicker", "پیش از شروع")}</span><h2 className="display-title mt-4 text-[clamp(2rem,3.5vw,3.35rem)]">{text("faq.title", "پرسش‌هایی که دانستن پاسخشان کمک می‌کند")}</h2><p className="body-copy mt-5">{text("faq.description", "هر شرایطی جزئیات خودش را دارد. اگر پاسخ پرسش شما اینجا نیست، می‌توانید بدون تعهد و بدون قضاوت با ما گفت‌وگو کنید.")}</p></div><div className="divide-y divide-[#dce6e0] border-y border-[#dce6e0]">{faqItems.map(([question, answer], index) => <details key={question} className="group py-1" open={index === 0}><summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-5 rounded-md py-5 font-bold text-[#243c32]"><span>{question}</span><ChevronLeft size={19} className="shrink-0 transition group-open:-rotate-90" /></summary><p className="body-copy max-w-2xl pb-6 text-sm">{answer}</p></details>)}</div></div></section>

      <section id="consultation" className="section-space bg-[#f4f8f5]"><div className="container-shell grid overflow-hidden rounded-[24px] border border-[#d9e5de] bg-white shadow-[0_24px_80px_rgba(15,74,54,.08)] lg:grid-cols-[.7fr_1.3fr]"><div className="relative overflow-hidden bg-[#0f4a36] p-8 text-white sm:p-12"><div className="absolute -bottom-16 -left-12 size-64 rounded-full border border-white/10" /><div className="absolute -bottom-6 -left-4 size-40 rounded-full border border-[#e9b43a]/40" /><h2 className="relative text-3xl font-black leading-[1.5]">{text("cta.title", "برای تصمیم‌گرفتن لازم نیست همه پاسخ‌ها را بدانید")}</h2><p className="relative mt-5 leading-8 text-white/72">{text("cta.description", "یک گفت‌وگوی اولیه کمک می‌کند شرایط روشن‌تر شود و قدم بعدی را آگاهانه انتخاب کنید.")}</p><div className="relative mt-12 border-t border-white/15 pt-7"><p className="text-xs text-white/60">تماس مستقیم</p><a dir="ltr" className="mt-2 inline-block text-xl font-bold" href={`tel:${phone.replace(/\D/g, "")}`}>{phone}</a><p className="mt-5 text-xs leading-6 text-white/55">در شرایط اورژانسی پزشکی، با ۱۱۵ تماس بگیرید.</p></div></div><div className="p-7 sm:p-12"><h3 className="text-xl font-extrabold text-[#183c2f]">{text("form.title", "درخواست گفت‌وگوی محرمانه")}</h3><p className="mb-7 mt-2 text-sm leading-7 text-[#718078]">{text("form.description", "نام و شماره‌ای را وارد کنید که در دسترس شماست. در زمان انتخابی تماس می‌گیریم و فقط اطلاعات لازم برای راهنمایی اولیه را می‌پرسیم.")}</p><ConsultationForm privacyText={text("form.privacy", "اطلاعات این فرم فقط برای هماهنگی تماس و راهنمایی اولیه استفاده می‌شود. برای شرایط اورژانسی از این فرم استفاده نکنید.")} successText={text("form.success", "درخواست شما ثبت شد. در بازه انتخابی با شما تماس می‌گیریم. اگر شرایط فوری یا خطرناک است، منتظر تماس نمانید و با ۱۱۵ تماس بگیرید.")} /></div></div></section>

      <footer className="relative overflow-hidden bg-[#092f29] text-white"><div className="absolute -left-24 -top-24 size-72 rounded-full border border-[#f5b942]/20" aria-hidden="true" /><div className="container-shell relative grid gap-10 py-16 md:grid-cols-3"><div><Brand inverse /><p className="mt-5 max-w-sm text-sm leading-7 text-white/62">{text("footer.description", "طلوع خورشید؛ همراه مسیر بازگشت به زندگی، با احترام به انتخاب فرد، حریم خصوصی و نقش خانواده.")}</p><div className="mt-5 flex gap-3"><a href="https://www.instagram.com/kamptark_etyad_koorosh/" target="_blank" rel="noreferrer" className="grid size-10 place-items-center rounded-full border border-white/15 text-[#f5c65d] transition hover:bg-white/10" aria-label="اینستاگرام طلوع خورشید"><Camera size={18} /></a></div></div><div><h3 className="text-sm font-bold text-[#f5c65d]">دسترسی سریع</h3><nav className="mt-5 grid gap-3 text-sm text-white/70"><a href="#services">خدمات درمانی</a><a href="#journey">مسیر درمان</a><a href="#media">تصاویر و ویدیوها</a><a href="#faq">پرسش‌های پرتکرار</a><Link href="/admin/login">ورود کارکنان</Link></nav></div><div><h3 className="text-sm font-bold text-[#f5c65d]">اطلاعات تماس</h3><div className="mt-5 grid gap-3 text-sm text-white/70"><a dir="ltr" className="w-fit text-lg font-bold text-white" href={`tel:${phone.replace(/\D/g, "")}`}>{phone}</a>{settings?.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : null}<p>{settings?.workingHours || "همه‌روزه، ساعت ۸ تا ۲۲"}</p><p className="text-white/50">تأسیس ۱۳۸۸ · شماره ثبت ۱۸۵</p></div></div></div><div className="border-t border-white/10"><div className="container-shell flex flex-col gap-3 py-5 text-xs leading-6 text-white/45 sm:flex-row sm:justify-between"><span>© ۱۴۰۵ مرکز ترک اعتیاد طلوع خورشید</span><span>{settings?.emergencyMessage || "این وب‌سایت جایگزین ارزیابی پزشکی یا خدمات اورژانسی نیست. در شرایط فوری یا خطر برای خود یا دیگران با ۱۱۵ تماس بگیرید."}</span></div></div></footer>
      <a href="#consultation" className="focus-ring fixed bottom-5 left-5 z-40 grid size-14 place-items-center rounded-full bg-[#e9b43a] text-[#15372b] shadow-xl transition hover:-translate-y-1" aria-label="درخواست مشاوره"><Phone size={22} /></a>
    </main>
  );
}
