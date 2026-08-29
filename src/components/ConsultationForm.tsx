"use client";

import { useState } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";

export function ConsultationForm() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setState("loading");
    setMessage("");
    const payload = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "ثبت درخواست انجام نشد.");
      setState("success");
      setMessage("درخواست شما با موفقیت ثبت شد. همکاران ما در اولین فرصت با شما تماس می‌گیرند.");
      (document.getElementById("consultation-form") as HTMLFormElement)?.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "خطایی رخ داد. لطفاً دوباره تلاش کنید.");
    }
  }

  return (
    <form id="consultation-form" action={submit} className="grid gap-4" aria-label="فرم درخواست مشاوره">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">نام و نام خانوادگی
          <input name="fullName" className="field" required minLength={3} autoComplete="name" placeholder="نام شما" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">شماره تماس
          <input name="phone" className="field" required inputMode="tel" autoComplete="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" dir="ltr" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">موضوع درخواست
          <select name="requestType" className="field" defaultValue="مشاوره اولیه">
            <option>مشاوره اولیه</option><option>پذیرش و درمان</option><option>راهنمایی خانواده</option><option>پیگیری پس از درمان</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold">زمان مناسب تماس
          <select name="preferredTime" className="field" defaultValue="ساعت ۱۶ تا ۲۰">
            <option>ساعت ۸ تا ۱۲</option><option>ساعت ۱۲ تا ۱۶</option><option>ساعت ۱۶ تا ۲۰</option><option>در اولین فرصت</option>
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold">توضیح کوتاه <span className="font-normal text-[#7b8781]">(اختیاری)</span>
        <textarea name="message" className="field min-h-28 resize-y" maxLength={1000} placeholder="اگر لازم است موضوعی را پیش از تماس بدانیم، اینجا بنویسید." />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <button className="btn-primary mt-1 w-full sm:w-fit" disabled={state === "loading"}>
        {state === "loading" ? <LoaderCircle size={18} className="animate-spin" /> : <Send size={18} />}
        ثبت درخواست محرمانه
      </button>
      <p className="text-xs leading-6 text-[#718078]">با ثبت این فرم، تنها برای هماهنگی مشاوره با شما تماس گرفته می‌شود. اطلاعات شما محرمانه می‌ماند.</p>
      {message ? <div role="status" className={`flex items-start gap-2 rounded-lg p-3 text-sm ${state === "success" ? "bg-[#e8f4ed] text-[#0f5a3e]" : "bg-red-50 text-red-700"}`}>{state === "success" ? <CheckCircle2 size={19} /> : null}{message}</div> : null}
    </form>
  );
}
