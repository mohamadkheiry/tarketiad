"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { FileVideo2, ImageIcon, Pencil, Plus, Save, ShieldCheck, Trash2, Upload, X } from "lucide-react";

type MediaItem = {
  id: string;
  title: string;
  caption: string | null;
  altText: string | null;
  personName: string | null;
  type: "IMAGE" | "VIDEO";
  category: "ACTIVITY" | "RECOVERY_STORY";
  storageKey: string;
  mimeType: string;
  fileSize: number;
  consentConfirmed: boolean;
  consentReference: string | null;
  featured: boolean;
  active: boolean;
  order: number;
};

function mediaUrl(item: MediaItem) {
  return `/media/${item.storageKey}`;
}

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} مگابایت` : `${Math.ceil(bytes / 1024)} کیلوبایت`;
}

export function MediaManager({ initial }: { initial: MediaItem[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<MediaItem["category"]>("ACTIVITY");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);
    setMessage("در حال بارگذاری و آماده‌سازی نسخه سازگار با وب؛ تا پایان این صفحه را نبندید...");
    const form = event.currentTarget;
    const response = await fetch("/api/admin/media", { method: "POST", body: new FormData(form) });
    const body = await response.json();
    setUploading(false);
    if (!response.ok) return setMessage(body.message || "بارگذاری انجام نشد.");
    setItems((all) => [body, ...all]);
    setMessage("رسانه با موفقیت بارگذاری شد.");
    setUploadOpen(false);
    form.reset();
    setUploadCategory("ACTIVITY");
  }

  async function save() {
    if (!editing) return;
    setMessage("در حال ذخیره...");
    const response = await fetch("/api/admin/media", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    const body = await response.json();
    if (!response.ok) return setMessage(body.message || "ذخیره انجام نشد.");
    setItems((all) => all.map((item) => item.id === body.id ? body : item));
    setEditing(null);
    setMessage("تغییرات ذخیره شد.");
  }

  async function remove(item: MediaItem) {
    if (!confirm(`رسانه «${item.title}» و فایل آن برای همیشه حذف شود؟`)) return;
    const response = await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id }),
    });
    const body = await response.json();
    if (!response.ok) return setMessage(body.message || "حذف انجام نشد.");
    setItems((all) => all.filter((row) => row.id !== item.id));
    if (editing?.id === item.id) setEditing(null);
    setMessage("رسانه و فایل مربوط به آن حذف شد.");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_400px]">
      <section className="overflow-hidden rounded-xl border border-[#dfe7e2] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5ebe8] p-5">
          <div><h2 className="font-extrabold">کتابخانه رسانه</h2><p className="mt-1 text-xs leading-6 text-[#78857e]">تصاویر فعالیت‌ها و ویدیوهای روایت بهبودی را مدیریت کنید.</p></div>
          <button onClick={() => { setUploadOpen(true); setEditing(null); }} className="btn-primary min-h-10 px-4 py-2"><Plus size={17} />رسانه جدید</button>
        </div>
        {items.length ? <div className="grid gap-px bg-[#e7ece9] sm:grid-cols-2 2xl:grid-cols-3">{[...items].sort((a, b) => a.order - b.order).map((item) => (
          <article key={item.id} className="bg-white p-4">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-[#e9efeb]">
              {item.type === "IMAGE" ? <Image unoptimized fill sizes="(max-width: 640px) 100vw, 360px" src={mediaUrl(item)} alt={item.altText || item.title} className="object-cover" /> : <video className="size-full bg-[#071c17] object-contain" src={mediaUrl(item)} controls preload="metadata" playsInline />}
              <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-[#082d21]/88 px-2 py-1 text-[10px] font-bold text-white">{item.type === "IMAGE" ? <ImageIcon size={12} /> : <FileVideo2 size={12} />}{item.type === "IMAGE" ? "تصویر" : "ویدیو"}</span>
            </div>
            <div className="mt-4 flex items-start justify-between gap-4"><div><h3 className="font-bold text-[#203c30]">{item.title}</h3><p className="mt-1 text-xs text-[#77847d]">{item.category === "ACTIVITY" ? "فعالیت مرکز" : item.personName ? `روایت ${item.personName}` : "روایت بهبودی ناشناس"} · {formatSize(item.fileSize)}</p></div><div className="flex shrink-0 gap-1"><button onClick={() => { setEditing({ ...item }); setUploadOpen(false); }} className="grid size-9 place-items-center rounded-lg text-[#35604f] hover:bg-[#edf4ef]" aria-label={`ویرایش ${item.title}`}><Pencil size={17} /></button><button onClick={() => remove(item)} className="grid size-9 place-items-center rounded-lg text-red-600 hover:bg-red-50" aria-label={`حذف ${item.title}`}><Trash2 size={17} /></button></div></div>
            <div className="mt-3 flex flex-wrap gap-2"><span className={`rounded px-2 py-1 text-[10px] font-bold ${item.active ? "bg-[#e5f2ea] text-[#17603f]" : "bg-zinc-100 text-zinc-500"}`}>{item.active ? "منتشرشده" : "پیش‌نویس"}</span>{item.featured ? <span className="rounded bg-[#fff4d5] px-2 py-1 text-[10px] font-bold text-[#8a6511]">ویژه</span> : null}{item.category === "RECOVERY_STORY" && item.consentConfirmed ? <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700"><ShieldCheck size={11} />رضایت ثبت شده</span> : null}</div>
          </article>
        ))}</div> : <div className="grid min-h-72 place-items-center p-8 text-center"><div><Upload className="mx-auto text-[#789087]" size={36} strokeWidth={1.4} /><h3 className="mt-4 font-bold text-[#274437]">هنوز رسانه‌ای بارگذاری نشده است</h3><p className="mt-2 max-w-md text-sm leading-7 text-[#78857e]">اولین تصویر فعالیت یا ویدیوی روایت بهبودی را اضافه کنید. موارد پیش‌نویس در سایت عمومی دیده نمی‌شوند.</p></div></div>}
      </section>

      <aside className={`h-fit rounded-xl border border-[#dfe7e2] bg-white p-5 xl:sticky xl:top-24 ${uploadOpen || editing ? "block" : "hidden xl:block"}`}>
        {uploadOpen ? <form onSubmit={upload} className="grid gap-4">
          <div className="flex items-center justify-between"><div><h2 className="font-extrabold">بارگذاری رسانه</h2><p className="mt-1 text-xs leading-6 text-[#7d8983]">JPG، PNG، WebP، MP4 یا WebM؛ ویدیو به‌صورت خودکار برای وب آماده می‌شود.</p></div><button type="button" onClick={() => setUploadOpen(false)} aria-label="بستن"><X size={19} /></button></div>
          <label className="grid gap-2 text-sm font-bold">فایل<input className="field h-auto py-3 font-normal" type="file" name="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" required /></label>
          <label className="grid gap-2 text-sm font-bold">عنوان<input className="field font-normal" name="title" required maxLength={160} placeholder="مثلاً کارگاه مهارت‌های زندگی" /></label>
          <label className="grid gap-2 text-sm font-bold">دسته‌بندی<select className="field font-normal" name="category" value={uploadCategory} onChange={(event) => setUploadCategory(event.target.value as MediaItem["category"])}><option value="ACTIVITY">فعالیت‌های مرکز</option><option value="RECOVERY_STORY">روایت بهبودی</option></select></label>
          {uploadCategory === "RECOVERY_STORY" ? <><label className="grid gap-2 text-sm font-bold">نام نمایشی <span className="font-normal text-[#7b8781]">(اختیاری؛ برای انتشار ناشناس خالی بگذارید)</span><input className="field font-normal" name="personName" maxLength={100} /></label><label className="grid gap-2 text-sm font-bold">مرجع رضایت <span className="font-normal text-[#7b8781]">(شماره یا محل نگهداری فرم)</span><input className="field font-normal" name="consentReference" maxLength={240} /></label><label className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs font-semibold leading-6 text-blue-900"><input className="mt-1" type="checkbox" name="consentConfirmed" />رضایت آگاهانه و قابل اثبات فرد برای انتشار عمومی این تصویر یا ویدیو دریافت شده است.</label></> : null}
          <label className="grid gap-2 text-sm font-bold">متن جایگزین تصویر<input className="field font-normal" name="altText" maxLength={240} placeholder="شرح کوتاه و دقیق برای دسترس‌پذیری" /></label>
          <label className="grid gap-2 text-sm font-bold">توضیحات<textarea className="field min-h-28 resize-y font-normal leading-7" name="caption" maxLength={2000} /></label>
          <div className="grid grid-cols-2 gap-4"><label className="grid gap-2 text-sm font-bold">ترتیب<input className="field font-normal" name="order" type="number" defaultValue={0} /></label><div className="grid content-end gap-2 pb-3"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" name="featured" />نمایش ویژه</label><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" name="active" />انتشار در سایت</label></div></div>
          <button disabled={uploading} className="btn-primary"><Upload size={17} />{uploading ? "در حال بارگذاری..." : "بارگذاری و ذخیره"}</button>
        </form> : editing ? <div className="grid gap-4">
          <div className="flex items-center justify-between"><h2 className="font-extrabold">ویرایش رسانه</h2><button onClick={() => setEditing(null)} aria-label="بستن"><X size={19} /></button></div>
          <label className="grid gap-2 text-sm font-bold">عنوان<input className="field font-normal" value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} /></label>
          <label className="grid gap-2 text-sm font-bold">دسته‌بندی<select className="field font-normal" value={editing.category} onChange={(event) => setEditing({ ...editing, category: event.target.value as MediaItem["category"] })}><option value="ACTIVITY">فعالیت‌های مرکز</option><option value="RECOVERY_STORY">روایت بهبودی</option></select></label>
          {editing.category === "RECOVERY_STORY" ? <><label className="grid gap-2 text-sm font-bold">نام نمایشی<input className="field font-normal" value={editing.personName || ""} onChange={(event) => setEditing({ ...editing, personName: event.target.value })} /></label><label className="grid gap-2 text-sm font-bold">مرجع رضایت<input className="field font-normal" value={editing.consentReference || ""} onChange={(event) => setEditing({ ...editing, consentReference: event.target.value })} /></label><label className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs font-semibold leading-6 text-blue-900"><input className="mt-1" type="checkbox" checked={editing.consentConfirmed} onChange={(event) => setEditing({ ...editing, consentConfirmed: event.target.checked })} />رضایت آگاهانه و قابل اثبات برای انتشار عمومی ثبت شده است.</label></> : null}
          <label className="grid gap-2 text-sm font-bold">متن جایگزین<input className="field font-normal" value={editing.altText || ""} onChange={(event) => setEditing({ ...editing, altText: event.target.value })} /></label>
          <label className="grid gap-2 text-sm font-bold">توضیحات<textarea className="field min-h-28 resize-y font-normal leading-7" value={editing.caption || ""} onChange={(event) => setEditing({ ...editing, caption: event.target.value })} /></label>
          <div className="grid grid-cols-2 gap-4"><label className="grid gap-2 text-sm font-bold">ترتیب<input className="field font-normal" type="number" value={editing.order} onChange={(event) => setEditing({ ...editing, order: Number(event.target.value) })} /></label><div className="grid content-end gap-2 pb-3"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={editing.featured} onChange={(event) => setEditing({ ...editing, featured: event.target.checked })} />نمایش ویژه</label><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={editing.active} onChange={(event) => setEditing({ ...editing, active: event.target.checked })} />انتشار در سایت</label></div></div>
          <button onClick={save} className="btn-primary"><Save size={17} />ذخیره تغییرات</button>
        </div> : <div className="py-16 text-center text-sm leading-7 text-[#87928d]"><Pencil className="mx-auto mb-3" /><p>برای ویرایش یک مورد را انتخاب کنید یا رسانه جدیدی بارگذاری کنید.</p></div>}
        {message ? <p role="status" className="mt-4 rounded-lg bg-[#edf4ef] p-3 text-sm leading-6 text-[#315b4a]">{message}</p> : null}
      </aside>
    </div>
  );
}
