import Image from "next/image";
import { Images, PlayCircle, ShieldCheck } from "lucide-react";

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
  if (item.type === "VIDEO") return <video className="size-full object-cover" src={src} controls playsInline preload="metadata" aria-label={item.altText || item.title} />;
  return <Image unoptimized fill priority={priority} sizes="(max-width: 768px) 100vw, 50vw" src={src} alt={item.altText || item.title} className="object-cover transition duration-500 group-hover:scale-[1.02]" />;
}

export function MediaShowcase({ items }: { items: PublicMedia[] }) {
  const activities = items.filter((item) => item.category === "ACTIVITY");
  const stories = items.filter((item) => item.category === "RECOVERY_STORY");
  return (
    <section id="media" className="section-space bg-[#082d21] text-white">
      <div className="container-shell">
        <div className="grid gap-6 border-b border-white/15 pb-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div><span className="text-sm font-bold text-[#e9b43a]">زندگی در مرکز</span><h2 className="mt-4 text-[clamp(2rem,3.5vw,3.45rem)] font-black leading-[1.45]">تصویری واقعی از مسیر مراقبت و بهبودی</h2></div>
          <p className="max-w-2xl text-sm leading-8 text-white/65 lg:justify-self-end">در این بخش، فعالیت‌های روزمره مرکز و روایت‌هایی منتشر می‌شوند که صاحبان آن‌ها آگاهانه با انتشار عمومی موافقت کرده‌اند. احترام به حریم شخصی همیشه بر نمایش محتوا اولویت دارد.</p>
        </div>

        {activities.length ? <div className="mt-12"><div className="mb-6 flex items-center justify-between"><h3 className="text-xl font-extrabold">فعالیت‌های مرکز</h3><span className="text-xs text-white/45">{activities.length.toLocaleString("fa-IR")} رسانه</span></div><div className="grid auto-rows-[220px] gap-4 md:grid-cols-2 lg:grid-cols-3">{activities.map((item, index) => <article key={item.id} className={`group relative overflow-hidden rounded-2xl bg-white/5 ${index === 0 && activities.length > 2 ? "md:row-span-2 lg:col-span-2" : ""}`}><div className="absolute inset-0"><MediaFrame item={item} priority={index === 0} /></div><div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-14"><div className="flex items-center gap-2 text-xs font-bold text-[#f4c85f]">{item.type === "VIDEO" ? <PlayCircle size={16} /> : <Images size={16} />}{item.type === "VIDEO" ? "ویدیو" : "تصویر"}</div><h4 className="mt-2 font-extrabold">{item.title}</h4>{item.caption ? <p className="mt-1 line-clamp-2 text-xs leading-6 text-white/70">{item.caption}</p> : null}</div></article>)}</div></div> : null}

        {stories.length ? <div className="mt-16"><div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h3 className="text-xl font-extrabold">روایت‌های بهبودی</h3><p className="mt-2 text-sm text-white/55">تجربه‌هایی شخصی؛ بدون وعده نتیجه یکسان برای دیگران.</p></div><span className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-[#a9c9bc]"><ShieldCheck size={16} />منتشرشده با تأیید رضایت</span></div><div className="grid gap-5 md:grid-cols-2">{stories.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl border border-white/12 bg-white/[.055]"><div className="relative aspect-video bg-black/20"><MediaFrame item={item} /></div><div className="p-5"><p className="text-xs font-bold text-[#e9b43a]">{item.personName || "روایت ناشناس"}</p><h4 className="mt-2 text-lg font-extrabold">{item.title}</h4>{item.caption ? <p className="mt-3 text-sm leading-7 text-white/62">{item.caption}</p> : null}</div></article>)}</div></div> : null}

        {!items.length ? <div className="mt-12 grid min-h-64 place-items-center rounded-2xl border border-dashed border-white/20 bg-white/[.035] p-8 text-center"><div><Images className="mx-auto text-[#e9b43a]" size={38} strokeWidth={1.4} /><h3 className="mt-5 text-lg font-extrabold">رسانه‌های مرکز به‌زودی در این بخش منتشر می‌شوند</h3><p className="mx-auto mt-3 max-w-xl text-sm leading-8 text-white/55">تنها تصاویر و ویدیوهایی نمایش داده می‌شوند که برای انتشار عمومی بررسی شده باشند.</p></div></div> : null}
      </div>
    </section>
  );
}
