import { prisma } from "@/lib/prisma";
import { updateBookingStatus } from "@/app/admin/actions";
import ApproveBookingButton from "./ApproveBookingButton";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "در انتظار تأیید",
    className: "bg-accent/10 text-accent",
  },
  CONFIRMED: {
    label: "تأیید شده",
    className: "bg-primary-100 text-primary-700",
  },
  CANCELLED: {
    label: "لغو شده",
    className: "bg-plum/10 text-plum/70",
  },
  ATTENDED: {
    label: "حاضر شده",
    className: "bg-primary-100 text-primary-700",
  },
  NO_SHOW: {
    label: "عدم حضور",
    className: "bg-plum/10 text-plum/70",
  },
};

function toFaDate(d: Date) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      user: { select: { name: true, email: true } },
      class: { select: { title: true, dayType: true, startTime: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-plum">مدیریت رزروها</h1>
        <p className="mt-1 text-sm text-plum/60">
          مجموعاً {bookings.length.toLocaleString("fa-IR")} رزرو ثبت شده است.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-primary-100 bg-white shadow-soft">
        <table className="w-full text-right text-sm">
          <thead className="bg-primary-50 text-plum">
            <tr>
              <th className="p-4 font-bold">کاربر</th>
              <th className="p-4 font-bold">کلاس</th>
              <th className="p-4 font-bold">روزها</th>
              <th className="p-4 font-bold">ساعت</th>
              <th className="p-4 font-bold">وضعیت</th>
              <th className="p-4 font-bold">تاریخ رزرو</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-plum/50">
                  هنوز هیچ رزروی ثبت نشده است.
                </td>
              </tr>
            )}
            {bookings.map((b) => {
              const status =
                STATUS_STYLES[b.status] ?? {
                  label: b.status,
                  className: "bg-plum/10 text-plum/70",
                };

              return (
                <tr
                  key={b.id}
                  className="border-t border-primary-100 transition hover:bg-primary-50/50"
                >
                  <td className="p-4">
                    <p className="font-semibold text-plum">
                      {b.user.name || "بدون نام"}
                    </p>
                    <p dir="ltr" className="text-xs text-plum/50">
                      {b.user.email}
                    </p>
                  </td>
                  <td className="p-4 font-semibold text-plum">
                    {b.class.title}
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-700">
                      {b.class.dayType}
                    </span>
                  </td>
                  <td className="p-4 text-plum/70">{b.class.startTime}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="p-4 text-plum/70">
                    {toFaDate(b.createdAt)}
                  </td>
                  <td className="p-4">
                    {b.status === "PENDING" && (
                      <ApproveBookingButton
                        bookingId={b.id}
                        onUpdate={updateBookingStatus}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
