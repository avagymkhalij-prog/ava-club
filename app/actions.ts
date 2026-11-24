"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ContactFormResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function submitContactForm(
  formData: FormData
): Promise<ContactFormResult> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) {
    return { success: false, error: "نام شما الزامی است." };
  }
  if (!phone || !/^0\d{10}$/.test(phone)) {
    return {
      success: false,
      error: "شماره موبایل معتبر نیست (مثلاً 09121234567).",
    };
  }
  if (!message || message.length < 5) {
    return { success: false, error: "متن پیام خیلی کوتاه است." };
  }

  try {
    await prisma.contactMessage.create({
      data: { name, phone, message },
    });
  } catch {
    return { success: false, error: "خطا در ثبت پیام. لطفاً دوباره تلاش کنید." };
  }

  revalidatePath("/admin/messages");

  return { success: true, message: "پیام شما با موفقیت ارسال شد. به‌زودی تماس می‌گیریم." };
}
