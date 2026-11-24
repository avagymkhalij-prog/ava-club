"use client";

import { useTransition } from "react";
import { toast } from "sonner";

type ActionResult = { success: boolean; message?: string; error?: string };

export default function ProfileForm({
  initialName,
  initialPhone,
  action,
}: {
  initialName: string;
  initialPhone: string;
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await action(formData);
      if (result?.success) {
        toast.success(result.message ?? "پروفایل به‌روزرسانی شد.");
      } else {
        toast.error(result?.error ?? "خطا در به‌روزرسانی پروفایل");
      }
    });
  }

  const inputClass =
    "w-full rounded-xl border border-primary-200 px-3 py-2 outline-none transition focus:border-primary-500";

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block text-plum/70">نام و نام خانوادگی *</span>
        <input
          name="name"
          required
          defaultValue={initialName}
          className={inputClass}
          placeholder="مثلاً سارا محمدی"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-plum/70">شماره موبایل</span>
        <input
          name="phone"
          dir="ltr"
          inputMode="tel"
          defaultValue={initialPhone}
          className={`${inputClass} text-right`}
          placeholder="09121234567"
        />
        <span className="mt-1 block text-xs text-plum/40">
          فرمت: ۰۹ + ۱۰ رقم، بدون خط تیره
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-primary-500 px-8 py-2.5 text-sm font-bold text-white transition hover:bg-primary-600 disabled:opacity-50"
      >
        {pending ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </button>
    </form>
  );
}
