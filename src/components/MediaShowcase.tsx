import Image from "next/image";
import { ArrowUpLeft, Camera, Images, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";

type PublicMedia = {
  id: string;
  title: string;
  caption: string | null;
  altText: string | null;
  personName: string | null;
  type: "IMAGE" | "VIDEO";
  category: "ACTIVITY" | "RECOVERY_STORY";
  storageKey: string;
  featured: boolean;
};

function MediaFrame({ item, priority = false }: { item: PublicMedia; priority?: boolean }) {
  const src = `/media/${item.storageKey}`;
  if (item.type === "VIDEO") {
    return <video className="size-full object-cover" src={src} controls playsInline preload="metadata" aria-label={item.altText || item.title} />;
  }
  return <Image unoptimized fill priority={priority} sizes="(max-width: 768px) 100vw, 45vw" src={src} alt={item.altText || item.title} className="object-cover transition duration-700 group-hover:scale-[1.035]" />;
}

export function MediaShowcase({ items }: { items: PublicMedia[] }) {
  const activities = items.filter((item) => item.category === "ACTIVITY");
  const stories = items.filter((item) => item.category === "RECOVERY_STORY");
  return (
    <section id="media" className="media-sunrise section-space relative overflow-hidden text-white">
      <div className="absolute -left-40 top-20 size-[420px] rounded-full border border-[#f5b942]/15" aria-hidden="true" />
      <div className="container-shell relative">
        <div className="grid gap-8 border-b border-white/15 pb-11 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-[#f5c65d]"><Sparkles size={17} />زندگی در طلوع خورشید</span>
            <h2 className="mt-4 max-w-2xl text-[clamp(2.15rem,4vw,3.8rem)] font-black leading-[1.42]">فضای واقعی مرکز، بدون تصویرسازی تبلیغاتی</h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-2xl text-sm leading-8 text-white/65">تصاویر و ویدیوهای این بخش از فعالیت‌های واقعی مرکز انتخاب شده‌اند. روایت‌های شخصی فقط پس از ثبت رضایت آگاهانه و قابل اثبات منتشر می‌شوند.</p>
            <a href="https://www.instagram.com/kamptark_etyad_koorosh/" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#f5c65d] transition hover:text-white"><Camera size={18} />مشاهده صفحه رسمی مرکز<ArrowUpLeft size={16} /></a>
          </div>
        </div>

        {activities.length ? (
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between"><h3 className="text-xl font-extrabold">فعالیت‌ها و فضای مرکز</h3><span className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/50">{activities.length.toLocaleString("fa-IR")} رسانه</span></div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {activities.map((item, index) => (
                <article key={item.id} className={`group overflow-hidden rounded-[24px] border border-white/12 bg-white/[.065] shadow-[0_22px_55px_rgba(0,0,0,.16)] ${index === 0 && activities.length > 2 ? "lg:col-span-2" : ""}`}>
                  <div className={`relative overflow-hidden bg-[#123f38] ${index === 0 && activities.length > 2 ? "aspect-[16/9]" : "aspect-[4/3]"}`}><MediaFrame item={item} priority={index === 0} /></div>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-4"><span className="inline-flex items-center gap-2 text-xs font-bold text-[#f5c65d]">{item.type === "VIDEO" ? <PlayCircle size={16} /> : <Images size={16} />}{item.type === "VIDEO" ? "ویدیو" : "تصویر"}</span><span className="text-[10px] text-white/35">از صفحه رسمی مرکز</span></div>
                    <h4 className="mt-3 text-lg font-extrabold">{item.title}</h4>{item.caption ? <p className="mt-2 line-clamp-2 text-sm leading-7 text-white/58">{item.caption}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {stories.length ? (
          <div className="mt-16 rounded-[28px] border border-white/12 bg-black/10 p-5 sm:p-8">
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h3 className="text-xl font-extrabold">روایت‌های بهبودی</h3><p className="mt-2 text-sm text-white/55">تجربه‌هایی شخصی؛ بدون وعده نتیجه یکسان برای دیگران.</p></div><span className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-[#b8d6ca]"><ShieldCheck size={16} />منتشرشده با تأیید رضایت</span></div>
            <div className="grid gap-5 md:grid-cols-2">{stories.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl bg-white/[.06]"><div className="relative aspect-video bg-black/20"><MediaFrame item={item} /></div><div className="p-5"><p className="text-xs font-bold text-[#f5c65d]">{item.personName || "روایت ناشناس"}</p><h4 className="mt-2 text-lg font-extrabold">{item.title}</h4>{item.caption ? <p className="mt-3 text-sm leading-7 text-white/62">{item.caption}</p> : null}</div></article>)}</div>
          </div>
        ) : null}

        {!items.length ? <div className="mt-12 grid min-h-64 place-items-center rounded-[28px] border border-dashed border-white/20 bg-white/[.035] p-8 text-center"><div><Images className="mx-auto text-[#f5c65d]" size={38} strokeWidth={1.4} /><h3 className="mt-5 text-lg font-extrabold">رسانه‌های واقعی مرکز به‌زودی در این بخش منتشر می‌شوند</h3><p className="mx-auto mt-3 max-w-xl text-sm leading-8 text-white/55">تنها تصاویر و ویدیوهایی نمایش داده می‌شوند که برای انتشار عمومی بررسی شده باشند.</p></div></div> : null}
      </div>
    </section>
  );
}
