"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createClass, updateClass } from "@/app/admin/actions";

const DAY_TYPES = ["روزهای فرد", "روزهای زوج", "پنجشنبه و جمعه"];

export type EditableClass = {
  id: string;
  title: string;
  dayType: string;
  startTime: string;
  endTime: string;
  trainerName: string;
  capacity: number;
  price: number;
};

export default function ClassDialog({
  editing,
  triggerLabel = "+ کلاس جدید",
}: {
  /** When provided, the dialog opens pre-filled and submits an UPDATE. */
  editing?: EditableClass;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;

    startTransition(async () => {
      const result = editing
        ? await updateClass(editing.id, formData)
        : await createClass(formData);

      if (result?.success) {
        toast.success(result.message ?? "ذخیره شد.");
        setOpen(false);
        form.reset();
      } else {
        toast.error(result?.error ?? "خطا در ذخیره کلاس");
      }
    });
  }

  const inputClass =
    "w-full rounded-xl border border-primary-200 px-3 py-2 outline-none transition focus:border-primary-500";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          editing
            ? "rounded-full border border-primary-200 px-4 py-1.5 text-xs font-bold text-primary-700 transition hover:bg-primary-50"
            : "rounded-full bg-primary-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary-600"
        }
      >
        {editing ? "ویرایش" : triggerLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-plum/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-primary-100 bg-white p-6 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-plum">
                {editing ? "ویرایش کلاس" : "افزودن سانس جدید"}
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="بستن"
                className="rounded-full p-2 text-plum/50 transition hover:bg-primary-50"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block text-plum/70">عنوان کلاس *</span>
                <input
                  name="title"
                  required
                  defaultValue={editing?.title ?? ""}
                  className={inputClass}
                  placeholder="مثلاً یوگا"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block text-plum/70">نوع روز *</span>
                <select
                  name="dayType"
                  defaultValue={editing?.dayType ?? DAY_TYPES[0]}
                  className={`${inputClass} bg-white`}
                >
                  {DAY_TYPES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                <span className="mb-1 block text-plum/70">ساعت شروع *</span>
                <input
                  name="startTime"
                  required
                  defaultValue={editing?.startTime ?? ""}
                  className={inputClass}
                  placeholder="۸ تا ۹"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block text-plum/70">ساعت پایان</span>
                <input
                  name="endTime"
                  defaultValue={editing?.endTime ?? ""}
                  className={inputClass}
                  placeholder="۹ تا ۱۰"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block text-plum/70">مربی *</span>
                <input
                  name="trainerName"
                  required
                  defaultValue={editing?.trainerName ?? ""}
                  className={inputClass}
                  placeholder="مثلاً زهرا قاسمی"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block text-plum/70">ظرفیت *</span>
                <input
                  name="capacity"
                  type="number"
                  min="1"
                  required
                  defaultValue={editing?.capacity ?? 15}
                  className={`${inputClass} text-right`}
                  dir="ltr"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block text-plum/70">
                  قیمت ماهانه (تومان) *
                </span>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="50000"
                  required
                  defaultValue={editing?.price ?? 0}
                  className={`${inputClass} text-right`}
                  dir="ltr"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block text-plum/70">
                  نوع ورزش (گروه‌بندی)
                </span>
                <input
                  name="slug"
                  dir="ltr"
                  defaultValue=""
                  className={`${inputClass} text-right`}
                  placeholder="yoga / trx / crossfit ..."
                />
                <span className="mt-1 block text-xs text-plum/40">
                  برای گروه‌بندی سانس‌های یک ورزش در صفحه جزئیات کلاس
                </span>
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-primary-500 px-8 py-2.5 text-sm font-bold text-white transition hover:bg-primary-600 disabled:opacity-50"
              >
                {pending ? "در حال ذخیره..." : editing ? "ذخیره تغییرات" : "ایجاد کلاس"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-primary-200 px-8 py-2.5 text-sm font-bold text-primary-700 transition hover:bg-primary-50"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
