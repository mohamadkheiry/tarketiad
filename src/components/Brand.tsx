import Link from "next/link";

export function Brand({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  const color = inverse ? "#ffffff" : "#0f4a36";
  return (
    <Link href="/" className="focus-ring inline-flex items-center gap-3 rounded-md" aria-label="صفحه اصلی سپیدار">
      <svg width={compact ? 38 : 46} height={compact ? 38 : 46} viewBox="0 0 48 48" aria-hidden="true">
        <path d="M8 39c7-1 11-5 14-10 4-7 5-14 4-20-8 3-13 8-15 15-1 4-1 10-3 15Z" fill={color} />
        <path d="M20 42c6-7 12-12 20-16-1 9-7 16-20 16Z" fill={color} />
        <path d="M23 31c5-6 9-12 11-20 4 7 2 14-11 20Z" fill={color} opacity=".78" />
        <path d="M9 40c10 2 21 1 31-4" fill="none" stroke="#e9b43a" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      {!compact ? (
        <span className="leading-tight">
          <strong className="block text-lg font-extrabold" style={{ color }}>سپیدار</strong>
          <span className={`text-[11px] ${inverse ? "text-white/70" : "text-[#66736d]"}`}>مرکز بازتوانی</span>
        </span>
      ) : null}
    </Link>
  );
}
