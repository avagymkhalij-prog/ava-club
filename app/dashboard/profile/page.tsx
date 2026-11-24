import { prisma } from "@/lib/prisma";
import { updateProfile } from "@/app/dashboard/actions";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  // The layout/middleware guarantee an authenticated user on /dashboard/*
  const bookings = await prisma.booking.findFirst({
    where: { status: { not: "CANCELLED" } },
    select: { user: { select: { id: true, name: true, email: true, phone: true, role: true } } },
  });

  const userId = bookings?.user.id;
  const user = userId
    ? await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true },
    })
    : null;

  if (!user) {
    return (
      <div className="rounded-3xl border border-primary-100 bg-white p-8 text-center shadow-soft">
        <p className="text-plum/70">برای مشاهده پروفایل ابتدا وارد شوید.</p>
      </div>
    );
  }

  const roleLabel = user.role === "ADMIN" ? "مدیر" : "عضو";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-plum">پروفایل من</h1>
        <p className="mt-1 text-sm text-plum/60">
          اطلاعات حساب خود را مشاهده و ویرایش کنید.
        </p>
      </div>

      {/* Read-only account info */}
      <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-bold text-plum">اطلاعات ثابت حساب</h2>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-primary-50 p-4">
            <dt className="text-xs text-plum/50">ایمیل (غیرقابل تغییر)</dt>
            <dd dir="ltr" className="mt-1 text-right font-semibold text-plum">
              {user.email}
            </dd>
          </div>
          <div className="rounded-2xl bg-primary-50 p-4">
            <dt className="text-xs text-plum/50">نقش</dt>
            <dd className="mt-1">
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                {roleLabel}
              </span>
            </dd>
          </div>
        </dl>
      </section>

      {/* Editable form */}
      <section className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-bold text-plum">ویرایش اطلاعات</h2>
        <ProfileForm
          initialName={user.name ?? ""}
          initialPhone={user.phone ?? ""}
          action={updateProfile}
        />
      </section>
    </div>
  );
}
