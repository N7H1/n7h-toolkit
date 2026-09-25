import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "N7H Toolkit",
  description: "منصة الأدوات والتواصل المشتركة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* رابط تحميل مكتبة Tailwind CSS المباشر لتشغيل التصاميم فوراً */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
