// Site footer: brand, quick links, class list, contact info.
// Server component — no interactivity needed.
import Link from "next/link";
import { Dumbbell, AtSign, Phone, MapPin } from "lucide-react";
import { NAV_LINKS } from "@/lib/navigation";

const CLASS_LINKS = [
  "ایروبیک",
  "کراس‌فیت",
  "یوگا",
  "پیلاتس",
  "زومبا",
  "TRX",
  "فیتنس رقص",
  "حرکات کششی",
];

export default function Footer() {
  return (
    <footer className="bg-primary-800 text-primary-50">
      <div className="container-site grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 text-accent-light">
            <Dumbbell className="h-6 w-6 rotate-90" aria-hidden />
            <span className="text-lg font-bold">باشگاه آوا</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-primary-100/90">
            باشگاه ورزشی بانوان با کلاس‌های تخصصی، مربیان مجرب و محیطی آرام و
            امن برای ورزش و سلامتی شما.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="اینستاگرام"
              className="rounded-full bg-accent p-2 text-white hover:bg-accent/90 transition"
            >
              <AtSign className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-bold text-accent-light">دسترسی سریع</h3>
          <ul className="mt-3 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-primary-100/90 hover:text-accent-light"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Classes */}
        <div>
          <h3 className="text-sm font-bold text-accent-light">کلاس‌ها</h3>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {CLASS_LINKS.map((c) => (
              <li key={c} className="text-sm text-primary-100/90">
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-bold text-accent-light">تماس با ما</h3>
          <ul className="mt-3 space-y-3 text-sm text-primary-100/90">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent-light" aria-hidden />
              <span dir="ltr">۰۲۱-۱۲۳۴۵۶۷۸</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent-light" aria-hidden />
              تهران، خیابان نمونه، پلاک ۱۲
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-700/60 bg-primary-900 py-4">
        <p className="container-site text-center text-xs text-primary-100/80">
          © {new Date().getFullYear()} باشگاه آوا — تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
