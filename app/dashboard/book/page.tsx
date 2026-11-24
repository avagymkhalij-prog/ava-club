"use client";

import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { bookClass } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";

type BookableClass = {
  id: string;
  title: string;
  description: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  price: number;
  trainer: { name: string } | null;
  _count?: { bookings: number };
};

const DAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

export default function BookPage() {
  const { data: session, status } = useSession();
  const [classes, setClasses] = useState<BookableClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/classes")
      .then((res) => (res.ok ? res.json() : { classes: [] }))
      .then((data) => setClasses(data.classes ?? []))
      .catch(() => toast.error("خطا در دریافت کلاس‌ها"))
      .finally(() => setLoading(false));
  }, []);

  async function handleBook(classId: string) {
    setBookingId(classId);
    startTransition(async () => {
      const result = await bookClass(classId);
      if (result?.success) {
        toast.success(result.message ?? "کلاس با موفقیت رزرو شد.");
      } else {
        toast.error(result?.error ?? "خطا در رزرو کلاس");
      }
      setBookingId(null);
    });
  }

  if (status === "loading" || loading) {
    return (
      <div className="container-site py-20 text-center text-plum/60">
        در حال بارگذاری...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container-site py-20 text-center">
        <h1 className="text-2xl font-bold text-plum">ورود لازم است</h1>
        <p className="mt-3 text-plum/60">
          برای رزرو کلاس ابتدا وارد حساب کاربری خود شوید.
        </p>
        <a href="/login" className="mt-6 inline-block rounded-full bg-primary-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-primary-600">
          ورود به حساب
        </a>
      </div>
    );
  }

  return (
    <div className="container-site py-12">
      <h1 className="text-3xl font-bold text-plum">رزرو کلاس</h1>
      <p className="mt-2 text-plum/60">
        کلاس مورد نظر خود را انتخاب کنید و رزرو کنید.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.length === 0 && (
          <p className="col-span-full text-center text-plum/60">
            در حال حاضر کلاسی برای رزرو وجود ندارد.
          </p>
        )}

        {classes.map((cls) => {
          const booked = cls._count?.bookings ?? 0;
          const isFull = booked >= cls.capacity;
          return (
            <div
              key={cls.id}
              className="flex flex-col justify-between rounded-3xl border border-primary-100 bg-white p-6 shadow-soft"
            >
              <div>
                <h2 className="text-lg font-bold text-plum">{cls.title}</h2>
                {cls.description && (
                  <p className="mt-1 text-sm text-plum/70">{cls.description}</p>
                )}
                <div className="mt-3 space-y-1 text-sm text-plum/60">
                  <p>
                    روز: {DAYS[cls.dayOfWeek] ?? "نامشخص"} — ساعت {cls.startTime} تا{" "}
                    {cls.endTime}
                  </p>
                  <p>مربی: {cls.trainer?.name || "تعیین نشده"}</p>
                  <p>
                    ظرفیت: {booked} از {cls.capacity}
                  </p>
                  <p className="font-semibold text-primary-600">
                    {cls.price.toLocaleString("fa-IR")} تومان
                  </p>
                </div>
              </div>

              <Button
                className="mt-4 w-full"
                variant={isFull ? "outline" : "default"}
                disabled={isFull || (pending && bookingId === cls.id)}
                onClick={() => handleBook(cls.id)}
              >
                {pending && bookingId === cls.id
                  ? "در حال رزرو..."
                  : isFull
                    ? "ظرفیت تکمیل"
                    : "رزرو این کلاس"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
