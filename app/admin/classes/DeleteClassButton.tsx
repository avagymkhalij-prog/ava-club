"use client";

import { useTransition } from "react";
import { toast } from "sonner";

export default function DeleteClassButton({
  classId,
  onDelete,
}: {
  classId: string;
  onDelete: (classId: string) => Promise<{ success: boolean; error?: string }>;
}) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("این کلاس حذف شود؟")) return;
    startTransition(async () => {
      const result = await onDelete(classId);
      if (result?.success) {
        toast.success("کلاس حذف شد.");
      } else {
        toast.error(result?.error ?? "خطا در حذف کلاس");
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
    >
      {pending ? "..." : "حذف"}
    </button>
  );
}
