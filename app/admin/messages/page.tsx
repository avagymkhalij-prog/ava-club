import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function toFaDate(d: Date) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-plum">پیام‌ها</h1>
        <p className="mt-1 text-sm text-plum/60">
          پیام‌های دریافتی از فرم تماس — مجموعاً{" "}
          {messages.length.toLocaleString("fa-IR")} پیام.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-primary-100 bg-white shadow-soft">
        <table className="w-full text-right text-sm">
          <thead className="bg-primary-50 text-plum">
            <tr>
              <th className="p-4 font-bold">نام</th>
              <th className="p-4 font-bold">موبایل</th>
              <th className="p-4 font-bold">پیام</th>
              <th className="p-4 font-bold">تاریخ ارسال</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-plum/50">
                  هنوز پیامی دریافت نشده است.
                </td>
              </tr>
            )}
            {messages.map((m) => (
              <tr
                key={m.id}
                className="border-t border-primary-100 transition hover:bg-primary-50/50"
              >
                <td className="p-4 font-semibold text-plum">{m.name}</td>
                <td className="p-4">
                  <a
                    href={`tel:${m.phone}`}
                    dir="ltr"
                    className="text-primary-600 hover:underline"
                    style={{ display: "inline-block", textAlign: "right" }}
                  >
                    {m.phone}
                  </a>
                </td>
                <td className="max-w-md p-4 leading-6 text-plum/70">
                  {m.message}
                </td>
                <td className="whitespace-nowrap p-4 text-plum/70">
                  {toFaDate(m.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
