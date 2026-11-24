// Hero: full-width gradient banner with slogan + CTAs.
// Server component — static content, no interactivity.
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-bl from-primary-100 via-cream to-accent-light/40"
      aria-labelledby="hero-title"
    >
      {/* Decorative soft blobs (hidden on small screens for performance) */}
      <div
        aria-hidden
        className="absolute -top-24 -left-24 hidden h-72 w-72 rounded-full bg-primary-200/40 blur-3xl sm:block"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -right-24 hidden h-72 w-72 rounded-full bg-accent-light/40 blur-3xl sm:block"
      />

      <div className="container-site relative flex flex-col items-center py-20 text-center sm:py-28 lg:py-32">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-primary-600">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          تنها باشگاه مخصوص بانوان در منطقه
        </span>

        <h1
          id="hero-title"
          className="max-w-3xl text-balance text-4xl font-bold leading-tight text-plum sm:text-5xl lg:text-6xl"
        >
          سلامتی و نشاط را در{" "}
          <span className="text-primary-500">باشگاه آوا</span> تجربه کنید
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-8 text-plum/70">
          کلاس‌های تخصصی ایروبیک، یوگا، پیلاتس، زومبا و کراس‌فیت با مربیان
          مجرب، در محیطی آرام، امن و کاملاً زنانه.
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="rounded-full bg-primary-500 px-8 py-3.5 text-base font-semibold text-white shadow-soft transition hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
          >
            ثبت‌نام
          </Link>
          <Link
            href="/#classes"
            className="rounded-full border border-primary-300 bg-white/80 px-8 py-3.5 text-base font-semibold text-primary-700 transition hover:bg-primary-50"
          >
            مشاهده کلاس‌ها
          </Link>
        </div>
      </div>
    </section>
  );
}
