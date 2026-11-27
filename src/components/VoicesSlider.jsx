"use client";

import { useEffect, useState } from "react";

const initials = (name) =>
  String(name || "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// Client testimonials shown one at a time. It advances on its own, pauses while
// someone is reading or tabbing through it, and can be stepped with the dots.
export default function VoicesSlider({ voices }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = voices.length;

  useEffect(() => {
    if (paused || total < 2) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % total),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [paused, total]);

  if (!total) return null;

  const go = (delta) =>
    setIndex((current) => (current + delta + total) % total);

  return (
    <div
      className="relative"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="sd-slider-track flex w-full"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {voices.map((voice) => (
            <figure
              key={`${voice.name}-${voice.content.slice(0, 18)}`}
              className="w-full shrink-0 px-1"
            >
              <blockquote className="border-border bg-light flex h-full flex-col rounded-3xl border p-7 sm:p-9">
                <span
                  aria-hidden="true"
                  className="sd-accent-text text-5xl leading-none"
                >
                  “
                </span>
                <p className="text-text mt-2 flex-1 text-lg leading-relaxed">
                  {voice.content}
                </p>
                <figcaption className="border-border mt-6 flex items-center gap-3 border-t pt-5">
                  <span className="sd-accent-bg grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold">
                    {initials(voice.name)}
                  </span>
                  <span>
                    <span className="text-text-dark block font-semibold">
                      {voice.name}
                    </span>
                    <span className="text-text-light block text-xs">
                      {voice.designation}
                    </span>
                  </span>
                </figcaption>
              </blockquote>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {voices.map((voice, dotIndex) => (
            <button
              key={`dot-${voice.name}-${dotIndex}`}
              type="button"
              onClick={() => setIndex(dotIndex)}
              aria-label={`Show testimonial ${dotIndex + 1}`}
              aria-current={dotIndex === index ? "true" : undefined}
              className={`sd-dot ${
                dotIndex === index ? "is-active" : ""
              } focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="border-border text-text-dark hover:border-primary hover:text-primary focus-visible:outline-primary grid size-10 place-items-center rounded-full border text-lg transition focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="border-border text-text-dark hover:border-primary hover:text-primary focus-visible:outline-primary grid size-10 place-items-center rounded-full border text-lg transition focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
