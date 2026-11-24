"use client";

// Testimonials slider — dependency-free.
// Horizontal scroll-snap track + prev/next buttons + dots.
// RTL-aware: scrolling works naturally in the rtl direction.
import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronRight, ChevronLeft, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/content";
import { cn } from "@/lib/utils";
import SectionHeading from "./SectionHeading";

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Scroll one card left/right (in RTL, "next" is visually to the left)
  const scrollByCard = useCallback((dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    if (!card) return;
    // In RTL, positive scrollLeft moves toward the start; flip direction
    const rtl = getComputedStyle(track).direction === "rtl";
    const step = card.offsetWidth + 24; // card width + gap
    track.scrollBy({ left: rtl ? -dir * step : dir * step, behavior: "smooth" });
  }, []);

  // Keep the active dot in sync while the user scrolls/swipes
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    if (!card) return;
    const step = card.offsetWidth + 24;
    const idx = Math.min(
      TESTIMONIALS.length - 1,
      Math.max(0, Math.round(Math.abs(track.scrollLeft) / step))
    );
    setActive(idx);
  }, []);

  // Jump to a specific testimonial via dots
  const goTo = useCallback((idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    if (!card) return;
    const step = card.offsetWidth + 24;
    track.scrollTo({ left: -idx * step, behavior: "smooth" });
    setActive(idx);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    track?.addEventListener("scroll", onScroll, { passive: true });
    return () => track?.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <section id="testimonials" className="py-20" aria-labelledby="testimonials-title">
      <div className="container-site">
        <SectionHeading
          badge="نظرات اعضا"
          title="آن‌ها که با ما هستند چه می‌گویند"
        />

        <div className="relative">
          {/* Scroll-snap track */}
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-live="polite"
          >
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="w-[85%] shrink-0 snap-center rounded-3xl border border-primary-100 bg-white p-8 shadow-soft sm:w-[46%] lg:w-[31%]"
              >
                <Quote className="h-8 w-8 text-primary-200" aria-hidden />
                <blockquote className="mt-4 text-sm leading-7 text-plum/75">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-primary-100 pt-4">
                  <p className="font-bold text-plum">{t.name}</p>
                  <p className="mt-0.5 text-xs text-primary-500">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Prev / Next controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="نظر قبلی"
              className="rounded-full border border-primary-200 bg-white p-2.5 text-primary-600 transition hover:bg-primary-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`نظر ${i + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    active === i ? "w-6 bg-primary-500" : "w-2 bg-primary-200"
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="نظر بعدی"
              className="rounded-full border border-primary-200 bg-white p-2.5 text-primary-600 transition hover:bg-primary-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
