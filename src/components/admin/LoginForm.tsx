"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, LogIn } from "lucide-react";

export function LoginForm() {
  const router = useRouter(); const [show, setShow] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function submit(formData: FormData) {
    setLoading(true); setError("");
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData.entries())) });
    const data = await response.json(); setLoading(false);
    if (!response.ok) return setError(data.message || "ورود انجام نشد.");
    router.push("/admin"); router.refresh();
  }
  return <form action={submit} className="grid gap-5"><label className="grid gap-2 text-sm font-semibold">ایمیل<input className="field" name="email" type="email" dir="ltr" autoComplete="email" required placeholder="admin@sepidar.local" /></label><label className="grid gap-2 text-sm font-semibold">گذرواژه<span className="relative"><input className="field pl-12" name="password" type={show ? "text" : "password"} dir="ltr" autoComplete="current-password" required /><button type="button" onClick={() => setShow((value) => !value)} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#748179]" aria-label="نمایش گذرواژه">{show ? <EyeOff size={19} /> : <Eye size={19} />}</button></span></label>{error ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}<button className="btn-primary w-full" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" size={18} /> : <LogIn size={18} />}ورود امن</button></form>;
}
