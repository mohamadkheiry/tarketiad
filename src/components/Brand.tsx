import Link from "next/link";

export function Brand({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  const color = inverse ? "#ffffff" : "#123f38";
  return (
    <Link href="/" className="focus-ring inline-flex items-center gap-3 rounded-md" aria-label="صفحه اصلی مرکز طلوع خورشید">
      <svg width={compact ? 40 : 48} height={compact ? 40 : 48} viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="25" r="20" fill={inverse ? "rgba(255,255,255,.08)" : "#eef6f1"} />
        <path d="M14 31a12 12 0 0 1 24 0" fill="#f5b942" />
        <path d="M11 34c7-2 13-2 18 0 5 2 9 1 13-1" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M26 8v6M11.5 16.5l4.5 4M40.5 16.5l-4.5 4M8 28h6M38 28h6" fill="none" stroke="#f5b942" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M20 39c4-3 8-4 12-3-2 5-6 8-12 8Z" fill={color} opacity=".9" />
      </svg>
      {!compact ? (
        <span className="leading-tight">
          <strong className="block text-[17px] font-black" style={{ color }}>طلوع خورشید</strong>
          <span className={`text-[10px] ${inverse ? "text-white/70" : "text-[#697a73]"}`}>مرکز ترک اعتیاد و بازتوانی</span>
        </span>
      ) : null}
    </Link>
  );
}
