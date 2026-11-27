"use client";

import { useEffect, useRef, useState } from "react";
import "@/styles/stats-showcase.css";

const STATS = [
  {
    value: 1500,
    suffix: "+",
    ring: 0.9,
    title: "Projects Delivered Worldwide",
    text: "We build professional websites and digital platforms tailored to business goals, helping brands establish a strong online presence globally.",
    icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z",
  },
  {
    value: 120,
    suffix: "+",
    ring: 0.72,
    title: "Expert IT & Web Solutions",
    text: "From responsive website design to custom development and digital support, we deliver solutions focused on performance, security, and scalability.",
    icon: "M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12",
  },
  {
    value: 100,
    suffix: "%",
    ring: 1,
    title: "Client Trust & Transparency",
    text: "Our projects are built on clear communication, honest commitments, and long-term client relationships that drive sustainable business growth.",
    icon: "M12 4a8 8 0 1 0 8 8M12 8a4 4 0 1 0 4 4M12 12l7-7M16 5h3v3",
  },
  {
    value: 98,
    suffix: "%",
    ring: 0.98,
    title: "Creative Team Collaboration",
    text: "Our designers, developers, and strategists work together to create visually engaging and technically powerful digital experiences.",
    icon: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12l2-1-1.5-2.6-2.2.6a7 7 0 0 0-1.5-.9L15.5 5h-3l-.3 2.1a7 7 0 0 0-1.5.9l-2.2-.6L7 10l2 1v2l-2 1 1.5 2.6 2.2-.6c.5.4 1 .7 1.5.9l.3 2.1h3l.3-2.1c.5-.2 1-.5 1.5-.9l2.2.6L21 14l-2-1z",
  },
];

const R = 118;
const C = 2 * Math.PI * R;

export default function StatsShowcase() {
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [n, setN] = useState(0);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.35,
    });
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = STATS[active].value;
    if (reduce.current || !inView) {
      setN(v);
      return;
    }
    let raf;
    const s = performance.now();
    const tick = (t) => {
      const k = Math.min((t - s) / 1100, 1);
      setN(Math.round(v * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, inView]);

  const cur = STATS[active];

  return (
    <section
      className="ss-section relative py-10 xl:py-14"
      aria-label="Our numbers"
    >
      <div className="mx-auto px-8 xl:max-w-330.5!">
        <div
          className="ss-shell"
          ref={root}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="ss-spot">
            <img
              className="ss-bg"
              src="/images/about/about-office.webp"
              alt="DS Solution office workspace"
              loading="lazy"
            />
            <div className="ss-veil" />

            <div className="ss-badge" aria-label="Your Digital Growth Partner">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <defs>
                  <path
                    id="ss-circ"
                    d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
                  />
                </defs>
                <text>
                  <textPath href="#ss-circ">
                    Your Digital Growth Partner • Your Digital Growth Partner •
                  </textPath>
                </text>
              </svg>
              <span>↗</span>
            </div>

            <div className="ss-dial">
              <svg viewBox="0 0 260 260" aria-hidden="true">
                <circle className="ss-track" cx="130" cy="130" r={R} />
                <circle
                  className="ss-arc"
                  cx="130"
                  cy="130"
                  r={R}
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - (inView ? cur.ring : 0))}
                />
              </svg>
              <div className="ss-figure" key={active}>
                <span className="ss-number">
                  <span className="ss-big">{n}</span>
                  <sup>{cur.suffix}</sup>
                </span>
              </div>
            </div>
          </div>

          <div className="ss-list" role="tablist" aria-label="Key numbers">
            {STATS.map((s, i) => {
              const on = active === i;
              return (
                <div key={s.title} className={on ? "ss-row on" : "ss-row"}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    className="ss-tab"
                    onClick={() => setActive(i)}
                  >
                    <span className="ss-ic">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d={s.icon} />
                      </svg>
                    </span>
                    <span className="ss-t">
                      <small>
                        {s.value}
                        {s.suffix}
                      </small>
                      <h3>{s.title}</h3>
                    </span>
                  </button>
                  <div className="ss-more">
                    <div>
                      <p>{s.text}</p>
                    </div>
                  </div>
                  {on && inView && !reduce.current && (
                    <i
                      key={`p${active}`}
                      className={paused ? "ss-prog paused" : "ss-prog"}
                      onAnimationEnd={() =>
                        setActive((x) => (x + 1) % STATS.length)
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
