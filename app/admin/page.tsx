import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Users,
  CalendarCheck,
  BadgeCheck,
  Wallet,
  ArrowLeft,
} from "lucide-react";

export const dynamic = "force-dynamic";

function toFa(n: number) {
  return n.toLocaleString("fa-IR");
}

export default async function AdminOverviewPage() {
  const [totalUsers, totalBookings, activeMemberships, revenueAgg] =
    await Promise.all([
      prisma.user.count(),
      prisma.booking.count({ where: { status: { not: "CANCELLED" } } }),
      prisma.membership.count({ where: { status: "ACTIVE" } }),
      prisma.payment.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),
    ]);

  const totalRevenue = revenueAgg._sum.amount ?? 0;

  const pendingBookings = await prisma.booking.count({
    where: { status: "PENDING" },
  });

  const stats = [
    {
      label: "کاربران",
      value: toFa(totalUsers),
      hint: "کاربر ثبت‌نام‌شده",
      icon: Users,
      card: "bg-white border-primary-100",
      iconWrap: "bg-primary-100 text-primary-700",
    },
    {
      label: "رزروها",
      value: toFa(totalBookings),
      hint: `${toFa(pendingBookings)} رزرو در انتظار تأیید`,
      icon: CalendarCheck,
      card: "bg-white border-primary-100",
      iconWrap: "bg-primary-100 text-primary-700",
    },
    {
      label: "عضویت‌های فعال",
      value: toFa(activeMemberships),
      hint: "اشتراک جاری اعضا",
      icon: BadgeCheck,
      card: "bg-white border-primary-100",
      iconWrap: "bg-primary-100 text-primary-700",
    },
    {
      label: "درآمد کل",
      value: `${toFa(totalRevenue)} تومان`,
      hint: "مجموع پرداخت‌های موفق",
      icon: Wallet,
      card: "bg-white border-accent/30",
      iconWrap: "bg-accent text-white",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-plum">داشبورد مدیریت</h1>
        <p className="mt-1 text-sm text-plum/60">
          نمای کلی وضعیت باشگاه در یک نگاه.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <article
            key={s.label}
            className={`rounded-3xl border p-6 shadow-soft transition duration-300 hover:-translate-y-1 ${s.card}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-plum/60">{s.label}</p>
                <p className="mt-2 text-2xl font-bold text-plum">{s.value}</p>
              </div>
              <span
                className={`rounded-2xl p-3 ${s.iconWrap}`}
                aria-hidden="true"
              >
                <s.icon className="h-6 w-6" />
              </span>
            </div>
            <p className="mt-4 text-xs text-plum/50">{s.hint}</p>
          </article>
        ))}
      </div>

      {/* Quick actions */}
      <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-bold text-plum">دسترسی سریع</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            href="/admin/bookings"
            className="flex items-center justify-between rounded-2xl border border-primary-100 p-4 transition hover:bg-primary-50"
          >
            <span className="text-sm font-bold text-plum">
              تأیید رزروهای در انتظار
            </span>
            <ArrowLeft className="h-5 w-5 text-primary-600" aria-hidden />
          </Link>
          <Link
            href="/admin/classes"
            className="flex items-center justify-between rounded-2xl border border-primary-100 p-4 transition hover:bg-primary-50"
          >
            <span className="text-sm font-bold text-plum">مدیریت کلاس‌ها</span>
            <ArrowLeft className="h-5 w-5 text-primary-600" aria-hidden />
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center justify-between rounded-2xl border border-primary-100 p-4 transition hover:bg-primary-50"
          >
            <span className="text-sm font-bold text-plum">مشاهده کاربران</span>
            <ArrowLeft className="h-5 w-5 text-primary-600" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}
