import type { Metadata } from "next";
import AuthForm from "./AuthForm";

export const metadata: Metadata = {
  title: "ورود / ثبت‌نام",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}
