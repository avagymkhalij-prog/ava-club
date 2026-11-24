import { prisma } from "@/lib/prisma";
import { deleteClass } from "@/app/admin/actions";
import ClassDialog from "./ClassDialog";
import DeleteClassButton from "./DeleteClassButton";

export const dynamic = "force-dynamic";

export default async function AdminClassesPage() {
  const classes = await prisma.class.findMany({
    include: {
      _count: { select: { bookings: true } },
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-plum">مدیریت کلاس‌ها</h1>
          <p className="mt-1 text-sm text-plum/60">
            مجموعاً {classes.length.toLocaleString("fa-IR")} سانس ثبت شده است.
          </p>
        </div>
        <ClassDialog triggerLabel="+ کلاس جدید" />
      </div>

      <div className="overflow-x-auto rounded-3xl border border-primary-100 bg-white shadow-soft">
        <table className="w-full text-right text-sm">
          <thead className="bg-primary-50 text-plum">
            <tr>
              <th className="p-4 font-bold">عنوان</th>
              <th className="p-4 font-bold">نوع روز</th>
              <th className="p-4 font-bold">ساعت</th>
              <th className="p-4 font-bold">مربی</th>
              <th className="p-4 font-bold">رزرو / ظرفیت</th>
              <th className="p-4 font-bold">قیمت ماهانه</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-plum/50">
                  هیچ کلاسی ثبت نشده است. از دکمه «کلاس جدید» شروع کنید.
                </td>
              </tr>
            )}
            {classes.map((cls) => (
              <tr
                key={cls.id}
                className="border-t border-primary-100 transition hover:bg-primary-50/50"
              >
                <td className="p-4 font-semibold text-plum">{cls.title}</td>
                <td className="p-4">
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-700">
                    {cls.dayType}
                  </span>
                </td>
                <td className="p-4 text-plum/70">{cls.startTime}</td>
                <td className="p-4 text-plum/70">{cls.trainerName || "—"}</td>
                <td className="p-4 text-plum/70">
                  {cls._count.bookings.toLocaleString("fa-IR")} /{" "}
                  {cls.capacity.toLocaleString("fa-IR")}
                </td>
                <td className="p-4 text-plum/70">
                  {cls.price.toLocaleString("fa-IR")} تومان
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <ClassDialog
                      editing={{
                        id: cls.id,
                        title: cls.title,
                        dayType: cls.dayType,
                        startTime: cls.startTime,
                        endTime: cls.endTime,
                        trainerName: cls.trainerName,
                        capacity: cls.capacity,
                        price: cls.price,
                      }}
                    />
                    <DeleteClassButton classId={cls.id} onDelete={deleteClass} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
