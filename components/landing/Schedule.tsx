// Weekly schedule: responsive table.
// On mobile the table scrolls horizontally inside a card wrapper.
import { SCHEDULE } from "@/lib/content";
import SectionHeading from "./SectionHeading";

export default function Schedule() {
  const days = Object.keys(SCHEDULE);

  return (
    <section id="schedule" className="py-20" aria-labelledby="schedule-title">
      <div className="container-site">
        <SectionHeading
          badge="برنامه هفتگی"
          title="جدول کلاس‌های هفته"
          subtitle="زمان مناسب خود را پیدا کنید و از داشبورد عضویت، کلاس‌تان را رزرو کنید."
        />

        <div className="overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-right text-sm">
              <thead>
                <tr className="bg-primary-500 text-white">
                  <th scope="col" className="px-6 py-4 font-bold">روز</th>
                  <th scope="col" className="px-6 py-4 font-bold">ساعت</th>
                  <th scope="col" className="px-6 py-4 font-bold">کلاس</th>
                  <th scope="col" className="px-6 py-4 font-bold">مربی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {days.map((day) =>
                  SCHEDULE[day].map((session, i) => (
                    <tr
                      key={`${day}-${i}`}
                      className="transition-colors hover:bg-primary-50/60"
                    >
                      {/* Day cell spans its sessions */}
                      <th
                        scope="row"
                        rowSpan={SCHEDULE[day].length}
                        className="px-6 py-4 align-top font-bold text-primary-700"
                      >
                        {day}
                      </th>
                      <td className="px-6 py-4 text-plum/80" dir="ltr" style={{ textAlign: "right" }}>
                        {session.time}
                      </td>
                      <td className="px-6 py-4 font-medium text-plum">
                        {session.classTitle}
                      </td>
                      <td className="px-6 py-4 text-plum/60">
                        {session.trainer}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
