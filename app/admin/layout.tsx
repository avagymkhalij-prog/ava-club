import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  LayoutDashboard,
  Dumbbell,
  CalendarCheck,
  Users,
  CreditCard,
  Home,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const SIDEBAR_LINKS = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/classes", label: "کلاس‌ها", icon: Dumbbell },
  { href: "/admin/bookings", label: "رزروها", icon: CalendarCheck },
  { href: "/admin/messages", label: "پیام‌ها", icon: MessageSquare },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/payments", label: "پرداخت‌ها", icon: CreditCard },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar — dark turquoise */}
        <aside className="shrink-0 bg-primary-800 text-primary-50 lg:w-64">
          <div className="sticky top-0 flex flex-row items-center gap-2 p-4 lg:h-screen lg:flex-col lg:items-stretch lg:gap-0 lg:p-6">
            {/* Brand */}
            <Link
              href="/admin"
              className="flex items-center gap-2 text-accent-light"
            >
              <ShieldCheck className="h-6 w-6" aria-hidden />
              <span className="text-lg font-bold">پنل مدیریت آوا</span>
            </Link>

            {/* Desktop nav */}
            <nav
              className="mt-8 hidden flex-1 flex-col gap-1 lg:flex"
              aria-label="ناوبری پنل مدیریت"
            >
              {SIDEBAR_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-primary-100/90 transition hover:bg-primary-700 hover:text-white"
                >
                  <link.icon className="h-5 w-5" aria-hidden />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Back to site */}
            <Link
              href="/"
              className="mt-auto hidden items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-primary-100/70 transition hover:bg-primary-700 hover:text-white lg:flex"
            >
              <Home className="h-5 w-5" aria-hidden />
              بازگشت به سایت
            </Link>

            {/* Mobile quick nav */}
            <nav
              className="ms-auto flex items-center gap-1 lg:hidden"
              aria-label="ناوبری موبایل پنل"
            >
              {SIDEBAR_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  className="rounded-xl p-2.5 text-primary-100/90 transition hover:bg-primary-700 hover:text-white"
                >
                  <link.icon className="h-5 w-5" aria-hidden />
                </Link>
              ))}
              <Link
                href="/"
                aria-label="بازگشت به سایت"
                className="rounded-xl p-2.5 text-primary-100/90 transition hover:bg-primary-700 hover:text-white"
              >
                <Home className="h-5 w-5" aria-hidden />
              </Link>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
