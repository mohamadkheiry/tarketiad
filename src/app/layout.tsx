import type { Metadata, Viewport } from "next";
import "@fontsource-variable/vazirmatn";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "مرکز ترک اعتیاد طلوع خورشید", template: "%s | طلوع خورشید" },
  description: "مرکز ترک اعتیاد و بازتوانی طلوع خورشید؛ همراهی محرمانه، محترمانه و قدم‌به‌قدم از سال ۱۳۸۸.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#123f38", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className="h-full scroll-smooth">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
