import type { Metadata } from "next";
import "./globals.css";
import { vazirmatn } from "@/lib/fonts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/providers";
import { Toaster } from "sonner";

// Site metadata — SEO baseline for the club
export const metadata: Metadata = {
  title: {
    default: "باشگاه آوا | باشگاه ورزشی بانوان",
    template: "%s | باشگاه آوا",
  },
  description:
    "باشگاه ورزشی بانوان آوا — کلاس‌های ایروبیک، کراس‌فیت، یوگا، پیلاتس، زومبا، TRX، فیتنس رقص و حرکات کششی در محیطی آرام و حرفه‌ای.",
  keywords: ["باشگاه بانوان", "ایروبیک", "یوگا", "پیلاتس", "زومبا", "کراس‌فیت"],
  openGraph: {
    title: "باشگاه ورزشی بانوان آوا",
    description: "کلاس‌های تخصصی ورزشی بانوان",
    locale: "fa_IR",
    type: "website",
  },
};

// Root layout: RTL Persian, Vazirmatn font, shared header/footer
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} font-sans antialiased`}>
        <Providers>
          <Toaster position="top-center" richColors dir="rtl" />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
