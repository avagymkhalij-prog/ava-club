"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

const DAY_TYPE_ORDER: Record<string, number> = {
  "روزهای فرد": 0,
  "روزهای زوج": 1,
  "پنجشنبه و جمعه": 2,
};

const DAY_TYPES = Object.keys(DAY_TYPE_ORDER);

function parseClassForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const dayType = String(formData.get("dayType") ?? DAY_TYPES[0]);
  const startTime = String(formData.get("startTime") ?? "").trim();
  const endTime = String(formData.get("endTime") ?? "").trim();
  const trainerName = String(formData.get("trainerName") ?? "").trim();
  const capacity = Number(formData.get("capacity") ?? 15);
  const price = Number(formData.get("price") ?? 0);
  const slug = String(formData.get("slug") ?? "").trim();

  return { title, dayType, startTime, endTime, trainerName, capacity, price, slug };
}

export async function deleteClass(classId: string) {
  const session = await requireAdmin();
  if (!session) {
    return { success: false, error: "دسترسی غیرمجاز" };
  }

  try {
    // Bookings cascade-delete with the class (schema: onDelete: Cascade)
    await prisma.class.delete({ where: { id: classId } });
  } catch {
    return { success: false, error: "خطا در حذف کلاس" };
  }

  revalidatePath("/admin/classes");
  revalidatePath("/admin");
  revalidatePath("/classes");
  return { success: true };
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const session = await requireAdmin();
  if (!session) {
    return { success: false, error: "دسترسی غیرمجاز" };
  }

  const allowed = ["PENDING", "CONFIRMED", "CANCELLED", "ATTENDED", "NO_SHOW"];
  if (!allowed.includes(status)) {
    return { success: false, error: "وضعیت نامعتبر" };
  }

  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
  } catch {
    return { success: false, error: "خطا در به‌روزرسانی رزرو" };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  return { success: true };
}

export async function createClass(formData: FormData) {
  const session = await requireAdmin();
  if (!session) {
    return { success: false, error: "دسترسی غیرمجاز" };
  }

  const data = parseClassForm(formData);

  if (!data.title) {
    return { success: false, error: "عنوان کلاس الزامی است." };
  }
  if (!data.trainerName) {
    return { success: false, error: "نام مربی الزامی است." };
  }
  if (!DAY_TYPES.includes(data.dayType)) {
    return { success: false, error: "نوع روز نامعتبر است." };
  }
  if (Number.isNaN(data.capacity) || data.capacity < 1) {
    return { success: false, error: "ظرفیت باید عددی بزرگ‌تر از صفر باشد." };
  }
  if (Number.isNaN(data.price) || data.price < 0) {
    return { success: false, error: "قیمت نامعتبر است." };
  }

  try {
    await prisma.class.create({
      data: {
        slug: data.slug || null,
        title: data.title,
        description: null,
        dayType: data.dayType,
        startTime: data.startTime || "زمان نامشخص",
        endTime: data.endTime || data.startTime || "زمان نامشخص",
        trainerName: data.trainerName,
        dayOfWeek: DAY_TYPE_ORDER[data.dayType] ?? 0,
        capacity: data.capacity,
        price: data.price,
      },
    });
  } catch {
    return { success: false, error: "خطا در ایجاد کلاس" };
  }

  revalidatePath("/admin/classes");
  revalidatePath("/admin");
  revalidatePath("/classes");
  return { success: true, message: "کلاس جدید ایجاد شد." };
}

export async function updateClass(id: string, formData: FormData) {
  const session = await requireAdmin();
  if (!session) {
    return { success: false, error: "دسترسی غیرمجاز" };
  }

  const data = parseClassForm(formData);

  if (!data.title) {
    return { success: false, error: "عنوان کلاس الزامی است." };
  }
  if (!data.trainerName) {
    return { success: false, error: "نام مربی الزامی است." }
  }
  if (!DAY_TYPES.includes(data.dayType)) {
    return { success: false, error: "نوع روز نامعتبر است." };
  }
  if (Number.isNaN(data.capacity) || data.capacity < 1) {
    return { success: false, error: "ظرفیت باید عددی بزرگ‌تر از صفر باشد." };
  }
  if (Number.isNaN(data.price) || data.price < 0) {
    return { success: false, error: "قیمت نامعتبر است." };
  }

  const existing = await prisma.class.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, error: "کلاس مورد نظر پیدا نشد." };
  }

  try {
    await prisma.class.update({
      where: { id },
      data: {
        slug: data.slug || null,
        title: data.title,
        dayType: data.dayType,
        startTime: data.startTime || "زمان نامشخص",
        endTime: data.endTime || data.startTime || "زمان نامشخص",
        trainerName: data.trainerName,
        dayOfWeek: DAY_TYPE_ORDER[data.dayType] ?? 0,
        capacity: data.capacity,
        price: data.price,
      },
    });
  } catch {
    return { success: false, error: "خطا در به‌روزرسانی کلاس" };
  }

  revalidatePath("/admin/classes");
  revalidatePath("/admin");
  revalidatePath("/classes");
  if (existing.slug) {
    revalidatePath(`/classes/${existing.slug}`);
  }
  return { success: true, message: "کلاس با موفقیت به‌روزرسانی شد." };
}
