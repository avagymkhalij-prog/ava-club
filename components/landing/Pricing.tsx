// Pricing plans: 3 tiers, middle one highlighted with gold accent.
import { Check } from "lucide-react";
import Link from "next/link";
import { PLANS } from "@/lib/content";
import { cn } from "@/lib/utils";
import SectionHeading from "./SectionHeading";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="bg-primary-50/50 py-20"
      aria-labelledby="pricing-title"
    >
      <div className="container-site">
        <SectionHeading
          badge="تعرفه عضویت"
          title="پلن مناسب خود را انتخاب کنید"
          subtitle="پرداخت آنلاین با درگاه امن زرین‌پال — لغو عضویت هر زمان ممکن است."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-3xl border bg-white p-8 shadow-soft transition duration-300 hover:-translate-y-1",
                plan.highlighted
                  ? "border-primary-400 ring-2 ring-primary-200"
                  : "border-primary-100"
              )}
            >
              {/* Badge for the recommended plan */}
              {plan.highlighted && (
                <span className="absolute -top-3 right-8 rounded-full bg-accent px-4 py-1 text-xs font-bold text-plum">
                  پیشنهاد ما
                </span>
              )}

              <h3 className="text-xl font-bold text-plum">{plan.name}</h3>
              <p className="mt-4">
                <span className="text-3xl font-extrabold text-primary-600">
                  {plan.monthlyPrice}
                </span>
                <span className="mr-2 text-sm text-plum/60">تومان / ماه</span>
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-plum/75">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary-500"
                      aria-hidden
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={cn(
                  "mt-8 rounded-full py-3 text-center text-sm font-semibold transition",
                  plan.highlighted
                    ? "bg-primary-500 text-white hover:bg-primary-600"
                    : "border border-primary-200 text-primary-700 hover:bg-primary-50"
                )}
              >
                انتخاب پلن {plan.name}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
