// Landing classes section: highlights the first 6 sports from static data.
// Clicking a card navigates to /classes/[slug] for full schedule details.
import Link from "next/link";
import { classesData } from "@/data/classesData";
import SectionHeading from "./SectionHeading";

export default function Classes() {
  return (
    <section id="classes" className="py-20 bg-white" aria-labelledby="classes-title">
      <div className="container-site">
        <SectionHeading
          badge="کلاس‌های ما"
          title="کلاس مورد علاقه‌ات را پیدا کن"
          subtitle="با هر سلیقه‌ای که داری، یه کلاس عالی اینجا هست!"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classesData.slice(0, 6).map((sport) => (
            <Link
              key={sport.slug}
              href={`/classes/${sport.slug}`}
              className="group flex flex-col justify-between rounded-3xl border border-primary-100 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary-200"
              aria-label={`جزئیات کلاس ${sport.title}`}
            >
              <div>
                <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                  {sport.schedule.length} سانس در هفته
                </span>

                <h3 className="mt-3 text-xl font-bold text-plum">
                  {sport.title}
                </h3>

                <p className="mt-2 line-clamp-3 text-sm leading-7 text-plum/60">
                  {sport.description}
                </p>
              </div>

              <div className="mt-5">
                <p className="mb-4 text-xs text-plum/50">
                  مربیان:{" "}
                  {Array.from(new Set(sport.schedule.map((s) => s.trainer))).join(
                    "، "
                  )}
                </p>

                <span className="flex h-11 w-full items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white transition group-hover:bg-primary-600">
                  مشاهده جزئیات و سانس‌ها
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/classes"
            className="inline-flex items-center gap-2 rounded-full border border-primary-200 px-8 py-3 text-sm font-bold text-primary-600 transition hover:bg-primary-50"
          >
            مشاهده همه کلاس‌ها
            <span aria-hidden="true">←</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
