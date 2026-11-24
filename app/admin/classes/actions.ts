"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Server Action: delete a class by id (admin only)
export async function deleteClass(classId: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "دسترسی غیرمجاز" };
  }

  await prisma.class.delete({ where: { id: classId } });
  revalidatePath("/admin/classes");
  return { success: true };
}
