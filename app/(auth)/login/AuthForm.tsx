"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Phone, KeyRound, ArrowRight, Loader2 } from "lucide-react";
import { sendOtp, verifyOtpAndLogin } from "../actions";

type Step = "phone" | "otp";

export default function AuthForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const PHONE_REGEX = /^09\d{9}$/;

  // ---------- Step 1: request OTP ----------
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = phone.trim().replace(/[۰-۹]/g, (d) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    );

    if (!PHONE_REGEX.test(normalized)) {
      toast.error("شماره موبایل معتبر نیست. (مثال: ۰۹۱۲۳۴۵۶۷۸۹)");
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(normalized);
      if (!res.success) {
        toast.error(res.error ?? "ارسال کد ناموفق بود.");
        return;
      }
      setPhone(normalized);
      setStep("otp");
      toast.success("کد تایید پیامک شد.");
    } catch {
      toast.error("خطای شبکه. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Step 2: verify OTP and log in ----------
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(code.trim())) {
      toast.error("کد تایید باید ۵ رقم باشد.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtpAndLogin(phone, code.trim());
      if (!res.success) {
        toast.error(res.error ?? "کد وارد شده اشتباه یا منقضی شده است.");
        return;
      }

      toast.success("خوش آمدید! در حال انتقال...");

      // Route admins to the admin panel, everyone else to the dashboard
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      router.push(session?.user?.role === "ADMIN" ? "/admin" : "/dashboard");
      router.refresh();
    } catch {
      toast.error("خطای شبکه. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[#e5d5dd] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#4ecdc4] focus:ring-2 focus:ring-[#4ecdc4]/30";

  return (
    <div className="rounded-2xl border border-[#e5d5dd] bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-center text-2xl font-bold text-[#341c27]">
        ورود / ثبت‌نام
      </h1>
      <p className="mb-6 text-center text-sm text-[#7a5c6b]">
        {step === "phone"
          ? "برای ورود یا ثبت‌نام، شماره موبایل خود را وارد کنید"
          : `کد تایید ارسال‌شده به ${phone} را وارد کنید`}
      </p>

      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-[#341c27]">
              شماره موبایل
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#c98da8]" />
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                dir="ltr"
                inputMode="numeric"
                maxLength={11}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className={`${inputClass} pl-10 text-left`}
                placeholder="09xxxxxxxxx"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#341c27] py-3 text-sm font-semibold text-white transition hover:bg-[#4a2a3a] disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            دریافت کد تایید
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label htmlFor="code" className="mb-1 block text-sm font-medium text-[#341c27]">
              کد تایید
            </label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#c98da8]" />
              <input
                id="code"
                name="code"
                type="text"
                required
                dir="ltr"
                inputMode="numeric"
                maxLength={5}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className={`${inputClass} pl-10 text-center text-lg tracking-[0.5em]`}
                placeholder="- - - - -"
              />
            </div>
            <p className="mt-2 text-xs text-[#7a5c6b]">کد ۵ رقمی تا ۲ دقیقه معتبر است.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2ec4b6] py-3 text-sm font-semibold text-white transition hover:bg-[#25a99d] disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            ورود / ثبت‌نام
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("phone");
              setCode("");
            }}
            className="flex w-full items-center justify-center gap-1 text-sm text-[#7a5c6b] hover:text-[#341c27]"
          >
            <ArrowRight className="h-4 w-4" />
            تغییر شماره موبایل
          </button>
        </form>
      )}
    </div>
  );
}
