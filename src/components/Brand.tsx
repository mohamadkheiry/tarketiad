import Image from "next/image";
import Link from "next/link";

export function Brand({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  const color = inverse ? "#ffffff" : "#123f38";
  return (
    <Link href="/" className="focus-ring group inline-flex items-center gap-3 rounded-xl" aria-label="صفحه اصلی مرکز طلوع خورشید">
      <Image
        src="/brand/logo-mark.svg"
        width={compact ? 42 : 52}
        height={compact ? 42 : 52}
        alt=""
        aria-hidden="true"
        className="shrink-0 drop-shadow-[0_8px_18px_rgba(18,63,56,.16)] transition-transform duration-300 group-hover:-translate-y-0.5"
        priority
      />
      {!compact ? (
        <span className="leading-tight">
          <strong className="block text-[18px] font-black tracking-[-0.035em]" style={{ color }}>طلوع خورشید</strong>
          <span className={`mt-1 block text-[10px] font-medium ${inverse ? "text-white/68" : "text-[#697a73]"}`}>مرکز ترک اعتیاد و بازتوانی</span>
        </span>
      ) : null}
    </Link>
  );
}
