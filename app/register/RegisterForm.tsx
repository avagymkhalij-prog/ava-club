"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }
    if (form.password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "خطا در ثبت‌نام.");
        return;
      }

      // Auto sign-in after successful registration
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
        return;
      }

      // Role-based redirect handled server-side too; new users are MEMBER
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("خطای شبکه. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[#e5d5dd] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#c98da8] focus:ring-2 focus:ring-[#eac5d5]/50";

  return (
    <div className="rounded-2xl border border-[#e5d5dd] bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-center text-2xl font-bold">ثبت‌نام</h1>
      <p className="mb-6 text-center text-sm text-[#7a5c6b]">
        به باشگاه آوا خوش آمدید — حساب خود را بسازید
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            نام و نام خانوادگی <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            placeholder="مثلاً: سارا محمدی"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            ایمیل <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            dir="ltr"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium">
            شماره تماس
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            dir="ltr"
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder="09121234567"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            رمز عبور <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            dir="ltr"
            value={form.password}
            onChange={handleChange}
            className={inputClass}
            placeholder="حداقل ۸ کاراکتر"
          />
        </div>

        <div>
          <label htmlFor="confirm" className="mb-1 block text-sm font-medium">
            تکرار رمز عبور <span className="text-red-500">*</span>
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            dir="ltr"
            value={form.confirm}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#341c27] py-3 text-sm font-semibold text-white transition hover:bg-[#4a2a3a] disabled:opacity-60"
        >
          {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#7a5c6b]">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link href="/login" className="font-medium text-[#c98da8] hover:underline">
          وارد شوید
        </Link>
      </p>
    </div>
  );
}
