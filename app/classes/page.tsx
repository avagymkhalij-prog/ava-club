import type { Metadata } from "next";
import Link from "next/link";
import { classesData } from "@/data/classesData";
import SectionHeading from "@/components/landing/SectionHeading";

export const metadata: Metadata = {
  title: "کلاس‌های باشگاه",
  description:
    "همه کلاس‌های باشگاه آوا — یوگا، کراس فیت، TRX، تکواندو، ایروبیک، ژیمناستیک و بیشتر؛ با برنامه هفتگی و مربیان هر سانس.",
};

export default function ClassesPage() {
  return (
    <main className="min-h-screen bg-cream">
      <section className="bg-gradient-to-b from-primary-50 to-cream py-16">
        <div className="container-site">
          <SectionHeading
            badge="کلاس‌های ما"
            title="انواع کلاس‌های باشگاه آوا"
            subtitle="روی هر کلاس کلیک کنید تا برنامه هفتگی، ساعت سانس‌ها و مربیان آن را ببینید."
          />
        </div>
      </section>

      <section className="py-12">
        <div className="container-site">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classesData.map((sport) => (
              <article
                key={sport.slug}
                className="group flex flex-col justify-between rounded-3xl border border-primary-100 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary-200"
              >
                <div>
                  <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                    {sport.schedule.length} سانس در هفته
                  </span>

                  <h2 className="mt-3 text-xl font-bold text-plum">
                    {sport.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-7 text-plum/60">
                    {sport.description}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="mb-4 text-xs text-plum/50">
                    مربیان: {Array.from(
                      new Set(sport.schedule.map((s) => s.trainer))
                    ).join("، ")}
                  </p>

                  <Link
                    href={`/classes/${sport.slug}`}
                    className="flex h-11 w-full items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white transition group-hover:bg-primary-600"
                  >
                    مشاهده جزئیات و سانس‌ها
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
