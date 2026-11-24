"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("ایمیل یا رمز عبور اشتباه است.");
        return;
      }

      // Prefer explicit callbackUrl; otherwise redirect by role
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        // Fetch the session to learn the role, then redirect
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        const role = session?.user?.role;
        router.push(role === "ADMIN" ? "/admin" : "/dashboard");
      }
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
      <h1 className="mb-2 text-center text-2xl font-bold">ورود</h1>
      <p className="mb-6 text-center text-sm text-[#7a5c6b]">
        به حساب کاربری خود در باشگاه آوا وارد شوید
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            ایمیل
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            dir="ltr"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            رمز عبور
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            dir="ltr"
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#341c27] py-3 text-sm font-semibold text-white transition hover:bg-[#4a2a3a] disabled:opacity-60"
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#7a5c6b]">
        حساب کاربری ندارید؟{" "}
        <Link
          href="/register"
          className="font-medium text-[#c98da8] hover:underline"
        >
          ثبت‌نام کنید
        </Link>
      </p>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={null}>
      <LoginFormInner />
    </Suspense>
  );
}
