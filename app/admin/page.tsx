import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Users,
  CreditCard,
  Activity,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { RevenueChart, BookingsByClassChart } from "./Charts";

export const dynamic = "force-dynamic";

function toFa(n: number) {
  return n.toLocaleString("fa-IR");
}

// Persian month names for the revenue chart
const FA_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

function jalaliMonthKey(d: Date) {
  // Gregorian month index is a reasonable approximation for grouping; names shown in Persian.
  const gy = d.getFullYear();
  const gm = d.getMonth();
  // Approximate Jalali conversion of month index for naming
  return { key: `${gy}-${gm}`, label: FA_MONTHS[gm], sort: gy * 12 + gm };
}

export default async function AdminOverviewPage() {
  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    revenueAgg,
    activeMemberships,
    totalBookings,
    paidPayments,
    classes,
    bookingsByClassRaw,
    recentBookings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    }),
    prisma.membership.count({ where: { status: "ACTIVE" } }),
    prisma.booking.count(),
    prisma.payment.findMany({
      where: { status: "PAID", createdAt: { gte: sixMonthsAgo } },
      select: { amount: true, createdAt: true },
    }),
    prisma.class.findMany({ select: { id: true, title: true } }),
    prisma.booking.groupBy({
      by: ["classId"],
      _count: { classId: true },
      orderBy: { _count: { classId: "desc" } },
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true, phone: true } },
        class: { select: { title: true } },
      },
    }),
  ]);

  const totalRevenue = revenueAgg._sum.amount ?? 0;

  // ---- Revenue grouped by month (last 6 months, zero-filled) ----
  const revenueByMonth = new Map<string, { label: string; sort: number; revenue: number }>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const { key, label, sort } = jalaliMonthKey(d);
    revenueByMonth.set(key, { label, sort, revenue: 0 });
  }
  for (const p of paidPayments) {
    const { key } = jalaliMonthKey(p.createdAt);
    const bucket = revenueByMonth.get(key);
    if (bucket) bucket.revenue += p.amount;
  }
  const revenueData = Array.from(revenueByMonth.values())
    .sort((a, b) => a.sort - b.sort)
    .map(({ label, revenue }) => ({ month: label, revenue }));

  // ---- Bookings grouped by class ----
  const classTitleMap = new Map(classes.map((c) => [c.id, c.title]));
  const bookingsData = bookingsByClassRaw.slice(0, 8).map((row) => ({
    title: classTitleMap.get(row.classId) ?? "کلاس حذف‌شده",
    count: row._count.classId,
  }));

  const stats = [
    {
      label: "کاربران",
      value: toFa(totalUsers),
      hint: "کاربر ثبت‌نام‌شده",
      icon: Users,
      iconWrap: "bg-primary-100 text-primary-700",
    },
    {
      label: "درآمد کل",
      value: `${toFa(totalRevenue)} تومان`,
      hint: "مجموع پرداخت‌های موفق",
      icon: CreditCard,
      iconWrap: "bg-accent text-white",
    },
    {
      label: "عضویت‌های فعال",
      value: toFa(activeMemberships),
      hint: "اشتراک جاری اعضا",
      icon: Activity,
      iconWrap: "bg-[#2ec4b6]/15 text-[#1d9e93]",
    },
    {
      label: "رزروها",
      value: toFa(totalBookings),
      hint: "کل رزروهای ثبت‌شده",
      icon: Calendar,
      iconWrap: "bg-primary-100 text-primary-700",
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
            className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1"
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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
          <h2 className="mb-4 text-lg font-bold text-plum">درآمد ۶ ماه گذشته</h2>
          {revenueData.some((d) => d.revenue > 0) ? (
            <RevenueChart data={revenueData} />
          ) : (
            <div className="flex h-72 items-center justify-center text-sm text-plum/40">
              هنوز پرداختی در این بازه ثبت نشده است.
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
          <h2 className="mb-4 text-lg font-bold text-plum">محبوب‌ترین کلاس‌ها (بر اساس رزرو)</h2>
          {bookingsData.length > 0 ? (
            <BookingsByClassChart data={bookingsData} />
          ) : (
            <div className="flex h-72 items-center justify-center text-sm text-plum/40">
              هنوز رزروی ثبت نشده است.
            </div>
          )}
        </section>
      </div>

      {/* Recent bookings table */}
      <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-plum">آخرین رزروها</h2>
          <Link
            href="/admin/bookings"
            className="flex items-center gap-1 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 transition hover:bg-primary-100"
          >
            مشاهده همه
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <p className="py-8 text-center text-sm text-plum/40">هنوز رزروی ثبت نشده است.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-primary-100 text-xs text-plum/50">
                  <th className="px-3 py-3 font-medium">کاربر</th>
                  <th className="px-3 py-3 font-medium">کلاس</th>
                  <th className="px-3 py-3 font-medium">وضعیت</th>
                  <th className="px-3 py-3 font-medium">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-primary-50 last:border-0 hover:bg-primary-50/50"
                  >
                    <td className="px-3 py-3 font-medium text-plum">
                      {b.user?.name ?? "کاربر"}
                      <span className="mr-2 text-xs text-plum/40" dir="ltr">
                        {b.user?.phone}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-plum/80">{b.class?.title}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${b.status === "CONFIRMED"
                          ? "bg-[#2ec4b6]/15 text-[#1d9e93]"
                          : b.status === "PENDING"
                            ? "bg-amber-100 text-amber-700"
                            : b.status === "CANCELLED"
                              ? "bg-red-100 text-red-600"
                              : "bg-primary-100 text-primary-700"
                          }`}
                      >
                        {b.status === "PENDING"
                          ? "در انتظار"
                          : b.status === "CONFIRMED"
                            ? "تأییدشده"
                            : b.status === "CANCELLED"
                              ? "لغوشده"
                              : b.status === "ATTENDED"
                                ? "حاضر"
                                : "غایب"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-plum/60">
                      {new Date(b.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

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
