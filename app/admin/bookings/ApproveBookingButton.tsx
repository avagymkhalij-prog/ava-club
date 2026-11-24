"use client";

import { useTransition } from "react";
import { toast } from "sonner";

export default function ApproveBookingButton({
  bookingId,
  onUpdate,
}: {
  bookingId: string;
  onUpdate: (
    bookingId: string,
    status: string
  ) => Promise<{ success: boolean; error?: string }>;
}) {
  const [pending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      const result = await onUpdate(bookingId, "CONFIRMED");
      if (result?.success) {
        toast.success("رزرو تأیید شد.");
      } else {
        toast.error(result?.error ?? "خطا در تأیید رزرو");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleApprove}
      disabled={pending}
      className="rounded-full bg-primary-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-primary-600 disabled:opacity-50"
    >
      {pending ? "..." : "تایید"}
    </button>
  );
}
