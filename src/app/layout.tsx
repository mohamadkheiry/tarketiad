import type { Metadata, Viewport } from "next";
import "@fontsource-variable/vazirmatn";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "مرکز بازتوانی سپیدار", template: "%s | سپیدار" },
  description: "همراهی تخصصی، محرمانه و محترمانه در مسیر درمان و بازتوانی اعتیاد.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0f4a36", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className="h-full scroll-smooth">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
