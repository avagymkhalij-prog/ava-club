import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "داشبورد",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
      status: { not: "CANCELLED" },
    },
    include: {
      class: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-cream">
      <section className="py-14">
        <div className="container-site">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-plum">
                سلام {session.user.name ?? "عزیز"} 👋
              </h1>
              <p className="mt-2 text-plum/60">
                رزروهای فعلی شما در باشگاه آوا:
              </p>
            </div>

            <Link
              href="/classes"
              className="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-600"
            >
              رزرو کلاس جدید
            </Link>
          </div>

          {bookings.length === 0 ? (
            // Empty state
            <div className="mx-auto mt-16 max-w-lg rounded-3xl border border-primary-100 bg-white p-10 text-center shadow-soft">
              <span className="text-5xl" aria-hidden="true">
                📅
              </span>
              <h2 className="mt-4 text-xl font-bold text-plum">
                هنوز هیچ کلاسی رزرو نکرده‌اید
              </h2>
              <p className="mt-2 text-sm leading-7 text-plum/60">
                از میان یوگا، کراس فیت، TRX، تکواندو و بقیه کلاس‌ها، سانس
                مناسب خود را پیدا کنید و همین حالا رزرو کنید.
              </p>
              <Link
                href="/classes"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-primary-500 px-8 py-3 text-sm font-bold text-white transition hover:bg-primary-600"
              >
                مشاهده کلاس‌ها
              </Link>
            </div>
          ) : (
            // Booking cards
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-plum">
                      کلاس {booking.class.title}
                    </h3>
                    <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                      {booking.status === "PENDING"
                        ? "در انتظار تأیید"
                        : booking.status === "CONFIRMED"
                          ? "تأیید شده"
                          : booking.status}
                    </span>
                  </div>

                  <dl className="mt-4 space-y-2 text-sm text-plum/70">
                    <div className="flex items-center justify-between">
                      <dt className="text-plum/50">روزها</dt>
                      <dd className="font-semibold">{booking.class.dayType}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-plum/50">ساعت</dt>
                      <dd className="font-semibold">{booking.class.startTime}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-plum/50">مربی</dt>
                      <dd className="font-semibold text-primary-600">
                        {booking.class.trainerName || "تعیین نشده"}
                      </dd>
                    </div>
                  </dl>

                  <Link
                    href={`/classes/${booking.class.slug ?? ""}`}
                    className="mt-5 flex h-10 w-full items-center justify-center rounded-full border border-primary-200 text-sm font-bold text-primary-600 transition hover:bg-primary-50"
                  >
                    جزئیات کلاس
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
