"use server";

import { signIn } from "next-auth/react";
import { prisma } from "@/lib/prisma";

const PHONE_REGEX = /^09\d{9}$/;
const OTP_TTL_MS = 2 * 60 * 1000; // 2 minutes

/**
 * Mock SMS sender — replace with a real provider (Kavenegar, SMS.ir, ...)
 * when the panel is connected. For now, we just log to the server console.
 */
function mockSendSms(phone: string, code: string) {
  console.log(`[MOCK SMS] کد تایید برای ${phone}: ${code}`);
}

/** Step 1: validate the phone, generate a 5-digit code, store it and "send" it. */
export async function sendOtp(phone: string) {
  const normalized = (phone ?? "").trim();

  if (!PHONE_REGEX.test(normalized)) {
    return { success: false as const, error: "شماره موبایل معتبر نیست. (۰۹xxxxxxxxx)" };
  }

  const code = Math.floor(10000 + Math.random() * 90000).toString();

  await prisma.otpToken.create({
    data: {
      phone: normalized,
      code,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  mockSendSms(normalized, code);

  return { success: true as const };
}

/** Step 2: verify the OTP against NextAuth credentials provider and log in. */
export async function verifyOtpAndLogin(phone: string, code: string) {
  const normalizedPhone = (phone ?? "").trim();
  const normalizedCode = (code ?? "").trim();

  try {
    const result = await signIn("credentials", {
      phone: normalizedPhone,
      otp: normalizedCode,
      redirect: false,
    });

    if (result?.error) {
      return { success: false as const, error: "کد وارد شده اشتباه یا منقضی شده است." };
    }

    return { success: true as const };
  } catch {
    return { success: false as const, error: "کد وارد شده اشتباه یا منقضی شده است." };
  }
}
