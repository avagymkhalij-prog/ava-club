// Contact section: info card + working message form (Server Action).
"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { submitContactForm } from "@/app/actions";
import { Phone, MapPin, Clock, AtSign, Send, MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/content";
import SectionHeading from "./SectionHeading";

const SOCIALS = [
  { href: CONTACT.instagram, label: "اینستاگرام", icon: AtSign },
  { href: CONTACT.telegram, label: "تلگرام", icon: Send },
  { href: CONTACT.whatsapp, label: "واتس‌اپ", icon: MessageCircle },
];

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await submitContactForm(formData);
      if (result?.success) {
        toast.success(result.message);
        formRef.current?.reset();
      } else {
        toast.error(result?.error ?? "خطا در ارسال پیام");
      }
    });
  }

  return (
    <section
      id="contact"
      className="bg-primary-50/50 py-20"
      aria-labelledby="contact-title"
    >
      <div className="container-site">
        <SectionHeading
          badge="تماس با ما"
          title="منتظر شما هستیم"
          subtitle="برای مشاوره رایگان و بازدید از باشگاه، با ما در تماس باشید."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Info card */}
          <div className="rounded-3xl border border-primary-100 bg-white p-8 shadow-soft">
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <span className="rounded-2xl bg-primary-50 p-3 text-primary-500">
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-bold text-plum">تلفن تماس</p>
                  <p className="mt-1 text-sm text-plum/70" dir="ltr" style={{ textAlign: "right" }}>
                    {CONTACT.phone} | {CONTACT.mobile}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="rounded-2xl bg-primary-50 p-3 text-primary-500">
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-bold text-plum">آدرس</p>
                  <p className="mt-1 text-sm text-plum/70">{CONTACT.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="rounded-2xl bg-primary-50 p-3 text-primary-500">
                  <Clock className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-bold text-plum">ساعات کاری</p>
                  <p className="mt-1 text-sm text-plum/70">{CONTACT.hours}</p>
                </div>
              </li>
            </ul>

            {/* Social links */}
            <div className="mt-8 flex gap-3 border-t border-primary-100 pt-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="rounded-full bg-primary-50 p-3 text-primary-600 transition hover:bg-primary-500 hover:text-white"
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Message form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex min-h-[320px] flex-col justify-between rounded-3xl border border-primary-100 bg-white p-8 shadow-soft"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-plum">ارسال پیام</h3>

              <label className="block text-sm">
                <span className="mb-1 block text-plum/70">نام شما *</span>
                <input
                  name="name"
                  required
                  className="w-full rounded-xl border border-primary-200 px-3 py-2 outline-none transition focus:border-primary-500"
                  placeholder="نام و نام خانوادگی"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block text-plum/70">شماره موبایل *</span>
                <input
                  name="phone"
                  dir="ltr"
                  inputMode="tel"
                  required
                  className="w-full rounded-xl border border-primary-200 px-3 py-2 text-right outline-none transition focus:border-primary-500"
                  placeholder="09121234567"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block text-plum/70">پیام شما *</span>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full resize-none rounded-xl border border-primary-200 px-3 py-2 outline-none transition focus:border-primary-500"
                  placeholder="سوال یا درخواست خود را بنویسید..."
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-6 w-full rounded-full bg-primary-500 py-3 text-sm font-bold text-white transition hover:bg-primary-600 disabled:opacity-50"
            >
              {pending ? "در حال ارسال..." : "ارسال پیام"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
