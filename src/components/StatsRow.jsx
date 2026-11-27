"use client";

import { useEffect, useRef, useState } from "react";

// The same figures the homepage uses, so the numbers stay consistent site-wide.
const STATS = [
  { value: 1500, suffix: "+", label: "Projects Delivered Worldwide" },
  { value: 120, suffix: "+", label: "Expert IT & Web Solutions" },
  { value: 100, suffix: "%", label: "Client Trust & Transparency" },
  { value: 98, suffix: "%", label: "Creative Team Collaboration" },
];

// Compact counter strip that animates the first time it scrolls into view.
export default function StatsRow() {
  const root = useRef(null);
  const played = useRef(false);
  const [inView, setInView] = useState(false);
  const [values, setValues] = useState(() => STATS.map(() => 0));

  useEffect(() => {
    const element = root.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || played.current) return undefined;
    played.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValues(STATS.map((stat) => stat.value));
      return undefined;
    }

    const start = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min((now - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValues(STATS.map((stat) => Math.round(stat.value * eased)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  return (
    <div
      ref={root}
      className="sd-accent-bg sd-accent-ring grid gap-8 rounded-3xl p-8 sm:grid-cols-2 sm:p-10 lg:grid-cols-4"
    >
      {STATS.map((stat, index) => (
        <div key={stat.label}>
          <p className="sd-stat-value text-4xl font-extrabold text-[#fff] sm:text-5xl">
            {values[index]}
            {stat.suffix}
          </p>
          <p className="mt-2 text-sm font-semibold text-[#fff]/85">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
