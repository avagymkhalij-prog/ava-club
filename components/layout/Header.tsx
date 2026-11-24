"use client";

// Sticky responsive header: logo, nav links, auth actions.
// Mobile-first: hamburger menu on small screens, full nav on md+.
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Dumbbell } from "lucide-react";
import { NAV_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-primary-100 bg-cream/90 backdrop-blur supports-[backdrop-filter]:bg-cream/75">
      <div className="container-site flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-primary-700">
          <Dumbbell className="h-6 w-6 rotate-90" aria-hidden />
          <span className="text-lg font-bold">باشگاه آوا</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="ناوبری اصلی">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-plum/80 transition-colors hover:text-primary-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            // unified phone-OTP login/register page
            className="rounded-full px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50"
          >
            ورود
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-soft transition-colors hover:bg-primary-600"
          >
            ثبت‌نام
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="rounded-md p-2 text-primary-700 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={cn(
          "border-t border-primary-100 bg-cream md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <nav className="container-site flex flex-col gap-1 py-4" aria-label="ناوبری موبایل">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-plum/80 hover:bg-primary-50"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex gap-3 border-t border-primary-100 pt-3">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 rounded-full border border-primary-200 px-4 py-2 text-center text-sm font-medium text-primary-700"
            >
              ورود
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 rounded-full bg-primary-500 px-4 py-2 text-center text-sm font-medium text-white"
            >
              ثبت‌نام
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
