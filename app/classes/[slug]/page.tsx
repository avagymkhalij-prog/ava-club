import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Flower2,
  Dumbbell,
  Music,
  Feather,
  Sparkles,
  Anchor,
  Swords,
  Flame,
  Activity,
  Medal,
  HeartPulse,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

// Icon per sport slug — visual identity for each class page
const SPORT_ICONS: Record<string, LucideIcon> = {
  yoga: Flower2,
  cx: Dumbbell,
  "body-rhythm": Music,
  "bunji-rhythm": Feather,
  gymnastics: Sparkles,
  trx: Anchor,
  "kung-fu-kickboxing": Swords,
  crossfit: Flame,
  aerobics: Activity,
  "aerobics-combo": Activity,
  taekwondo: Medal,
  "fitness-bodybuilding": HeartPulse,
  "karate-kyokushin": Shield,
};

type Props = {
  params: { slug: string };
};

// Fetch all sessions of one sport (grouped by slug) straight from Prisma
async function getClassSessions(slug: string) {
  return prisma.class.findMany({
    where: { slug },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sessions = await getClassSessions(params.slug);
  if (sessions.length === 0) return { title: "کلاس یافت نشد" };
  return {
    title: `کلاس ${sessions[0].title}`,
    description: (sessions[0].description ?? "").slice(0, 150),
  };
}

const DAY_TYPE_STYLES: Record<string, string> = {
  "روزهای فرد": "bg-primary-100 text-primary-700",
  "روزهای زوج": "bg-accent/10 text-accent",
  "پنجشنبه و جمعه": "bg-plum/10 text-plum",
};

export default async function ClassDetailPage({ params }: Props) {
  const sessions = await getClassSessions(params.slug);

  if (sessions.length === 0) {
    notFound();
  }

  const sport = sessions[0];

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-cream py-16">
        <div className="container-site">
          <nav
            aria-label="مسیر صفحه"
            className="mb-8 flex items-center gap-2 text-sm text-plum/50"
          >
            <Link href="/" className="transition hover:text-primary-500">
              خانه
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/classes" className="transition hover:text-primary-500">
              کلاس‌ها
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-plum">{sport.title}</span>
          </nav>

          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-accent/15 px-4 py-1 text-xs font-bold tracking-wider text-accent">
              سانس‌های هفتگی
            </span>
            <div className="mt-4 flex items-center justify-center gap-3">
              {(() => {
                const Icon = SPORT_ICONS[sport.slug ?? ""] ?? Dumbbell;
                return (
                  <span className="rounded-2xl bg-primary-100 p-3 text-primary-700" aria-hidden>
                    <Icon className="h-8 w-8" />
                  </span>
                );
              })()}
              <h1 className="text-4xl font-bold text-plum sm:text-5xl">
                {sport.title}
              </h1>
            </div>
            {sport.description && (
              <p className="mt-6 rounded-3xl border border-primary-100 bg-white/70 p-6 text-lg leading-relaxed text-plum/70 shadow-soft">
                {sport.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-12" aria-labelledby="schedule-title">
        <div className="container-site">
          <h2
            id="schedule-title"
            className="mb-8 text-center text-2xl font-bold text-plum"
          >
            برنامه هفتگی و مربیان
          </h2>

          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            {sessions.map((session) => (
              <article
                key={session.id}
                className="flex flex-col justify-between rounded-3xl border border-primary-100 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1"
              >
                <div>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${DAY_TYPE_STYLES[session.dayType] ??
                      "bg-primary-100 text-primary-700"
                      }`}
                  >
                    {session.dayType}
                  </span>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-plum/50">ساعت</p>
                      <p className="mt-0.5 text-lg font-bold text-plum">
                        {session.startTime}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-plum/50">مربی</p>
                      <p className="mt-0.5 text-lg font-bold text-primary-600">
                        {session.trainerName || "تعیین نشده"}
                      </p>
                    </div>
                  </div>

                  {session.price > 0 && (
                    <p className="mt-3 text-sm font-semibold text-plum/60">
                      ماهانه: {session.price.toLocaleString("fa-IR")} تومان
                    </p>
                  )}
                </div>

                {/* Book this specific session */}
                <Link
                  href={`/dashboard/book?classId=${session.id}`}
                  className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white transition hover:bg-primary-600"
                >
                  رزرو این سانس
                </Link>
              </article>
            ))}
          </div>

          {sessions.some((s) => s.startTime === "زمان نامشخص") && (
            <p className="mx-auto mt-6 max-w-3xl rounded-2xl bg-accent/10 p-4 text-center text-sm text-plum/70">
              ⓘ برای برخی سانس‌های این کلاس هنوز ساعت دقیق مشخص نشده است؛ برای
              اطلاعات بیشتر با باشگاه تماس بگیرید.
            </p>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              href={`/dashboard/book?slug=${sport.slug ?? ""}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-200 px-10 py-4 text-base font-bold text-primary-600 transition hover:bg-primary-50"
            >
              مشاهده همه سانس‌ها در صفحه رزرو
              <span aria-hidden="true">←</span>
            </Link>
            <p className="mt-3 text-sm text-plum/50">
              ثبت‌نام سریع آنلاین — ظرفیت هر سانس محدود است.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
