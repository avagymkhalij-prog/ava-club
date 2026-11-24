"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type BookClassResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function bookClass(classId: string): Promise<BookClassResult> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return {
      success: false,
      error: "برای رزرو کلاس ابتدا وارد حساب خود شوید.",
    };
  }

  const userId = session.user.id;

  const gymClass = await prisma.class.findUnique({ where: { id: classId } });
  if (!gymClass) {
    return { success: false, error: "سانس مورد نظر پیدا نشد." };
  }

  // جلوگیری از رزرو تکراری: کاربر نباید همان سانس را دوباره رزرو کند
  const existing = await prisma.booking.findUnique({
    where: {
      userId_classId: {
        userId,
        classId,
      },
    },
  });
  if (existing && existing.status !== "CANCELLED") {
    return { success: false, error: "شما قبلاً این سانس را رزرو کرده‌اید." };
  }

  // چک ظرفیت: تعداد رزروهای فعال نباید از ظرفیت بیشتر شود
  const activeBookings = await prisma.booking.count({
    where: { classId, status: { not: "CANCELLED" } },
  });
  if (activeBookings >= gymClass.capacity) {
    return { success: false, error: "ظرفیت این سانس تکمیل شده است." };
  }

  if (existing && existing.status === "CANCELLED") {
    // Reactivate a previously cancelled booking
    await prisma.booking.update({
      where: { id: existing.id },
      data: { status: "PENDING" },
    });
  } else {
    await prisma.booking.create({
      data: {
        userId,
        classId,
        status: "PENDING",
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/book");
  revalidatePath(`/classes/${gymClass.slug ?? ""}`);

  return { success: true, message: "سانس با موفقیت رزرو شد." };
}

export async function updateProfile(
  formData: FormData
): Promise<{ success: boolean; message?: string; error?: string }> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return { success: false, error: "برای ویرایش پروفایل ابتدا وارد حساب خود شوید." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name) {
    return { success: false, error: "نام نمی‌تواند خالی باشد." };
  }
  if (phone && !/^0\d{10}$/.test(phone)) {
    return { success: false, error: "شماره موبایل معتبر نیست (مثلاً 09121234567)." };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        ...(phone ? { phone } : {}),
      },
    });
  } catch {
    return { success: false, error: "خطا در به‌روزرسانی پروفایل." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");

  return { success: true, message: "پروفایل با موفقیت به‌روزرسانی شد." };
}
