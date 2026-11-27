"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "@/styles/about-intro.css";

const TABS = [
  {
    label: "About Us",
    body: (
      <>
        <strong>Digital Solution</strong> is a leading{" "}
        <strong>Digital Marketing and Web Development Company in Mohali</strong>
        . We help businesses build a strong and effective online presence. We
        offer comprehensive <strong>digital marketing solutions</strong>,
        including SEO optimization, Social Media Marketing, Online Reputation
        Management, Content writing, Email marketing, Influencer marketing,
        Google Ads, and Meta Ads, designed to increase visibility, attract the
        right audience, and generate meaningful business growth.
      </>
    ),
    chips: [
      "SEO",
      "Social Media",
      "Reputation",
      "Content",
      "Email",
      "Influencer",
      "Google Ads",
      "Meta Ads",
    ],
  },
  {
    label: "Web Development",
    body: (
      <>
        Our website development expertise covers WordPress, Shopify, Wix, PHP,
        and Laravel, Node.js, React.js, Next.js, and Nest.js development,
        enabling us to create responsive, user-friendly, and high-performing
        websites designed to meet your business needs. We also provide creative
        design and video editing solutions, including logo design, creative
        social media banners, and motion graphics, to strengthen your brand
        identity and make your business stand out.
      </>
    ),
    chips: [
      "WordPress",
      "Shopify",
      "Wix",
      "PHP",
      "Laravel",
      "Node.js",
      "React.js",
      "Next.js",
      "Nest.js",
    ],
  },
  {
    label: "Our Promise",
    body: (
      <>
        We put our expertise, creativity, and dedication into every project to
        create business websites that go beyond expectations. Our results-driven
        digital marketing strategies are focused on driving targeted traffic,
        generating quality leads, increasing conversions, and boosting sales,
        helping your business achieve sustainable growth in the digital
        landscape.
      </>
    ),
    chips: ["Targeted traffic", "Quality leads", "Conversions", "Sales"],
  },
];

const ORBIT = [
  "SEO",
  "Social Media",
  "Online Reputation",
  "Content",
  "Email",
  "Influencer",
  "Google Ads",
  "Meta Ads",
];
const TECH = TABS[1].chips;
const BARS = [
  ["Targeted traffic", 48],
  ["Quality leads", 64],
  ["Conversions", 80],
  ["Sales", 100],
];

const FEATURES = [
  {
    title: "Modern Technology",
    text: "Leveraging cutting-edge technology to enhance efficiency, precision, and sustainability in every project.",
    icon: "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z",
  },
  {
    title: "Experience Engineers",
    text: "A team of skilled professionals dedicated to delivering excellence through expertise and innovation.",
    icon: "M4 19h16M6 19a6 6 0 0 1 12 0M12 7v4M8.5 9l1.5 2.2M15.5 9L14 11.2M7 7h10",
  },
];

function Icon({ d, size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

function TechScene() {
  const st = useRef({ i: 0, n: 0, del: false });
  const [, force] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      st.current.n = TECH[0].length;
      force((x) => x + 1);
      return;
    }
    const t = setInterval(() => {
      const s = st.current;
      const w = TECH[s.i];
      if (!s.del) {
        if (s.n >= w.length) s.del = true;
        else s.n += 1;
      } else if (s.n <= 0) {
        s.del = false;
        s.i = (s.i + 1) % TECH.length;
      } else {
        s.n -= 1;
      }
      force((x) => x + 1);
    }, 110);
    return () => clearInterval(t);
  }, []);

  const { i, n } = st.current;

  return (
    <div className="ai-win">
      <div className="ai-bar">
        <i />
        <i />
        <i />
      </div>
      <div className="ai-code">
        &gt; <em>{TECH[i].slice(0, n)}</em>
        <u />
      </div>
      <div className="ai-tech">
        {TECH.map((t, k) => (
          <button
            key={t}
            type="button"
            className={k === i ? "ai-tile on" : "ai-tile"}
            onClick={() => {
              st.current = { i: k, n: 0, del: false };
              force((x) => x + 1);
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AboutIntro() {
  const [tab, setTab] = useState(0);
  const [paused, setPaused] = useState(false);
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const el = countRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const s = performance.now();
      const tick = (t) => {
        const p = Math.min((t - s) / 1500, 1);
        setCount(Math.round(1000 * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      className="ai-section relative py-16 xl:py-19"
      aria-labelledby="ai-title"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto px-8 xl:max-w-330.5!">
        <div className="ai-grid">
          <div>
            <h2 id="ai-title" className="ai-title">
              Digital Marketing And Web Development Company In Mohali
            </h2>

            <div className="ai-tabs" role="tablist">
              {TABS.map((t, i) => (
                <button
                  key={t.label}
                  type="button"
                  role="tab"
                  id={`ai-tab-${i}`}
                  aria-selected={tab === i}
                  aria-controls={`ai-panel-${i}`}
                  className="ai-tab"
                  onClick={() => setTab(i)}
                >
                  {t.label}
                  {tab === i && (
                    <i
                      key={`${tab}`}
                      className={paused ? "ai-prog paused" : "ai-prog"}
                      onAnimationEnd={() =>
                        setTab((x) => (x + 1) % TABS.length)
                      }
                    />
                  )}
                </button>
              ))}
            </div>

            {TABS.map((t, i) => (
              <div
                key={t.label}
                id={`ai-panel-${i}`}
                role="tabpanel"
                aria-labelledby={`ai-tab-${i}`}
                hidden={tab !== i}
                className="ai-panel"
              >
                <p>{t.body}</p>
                <div className="ai-chips">
                  {t.chips.map((c) => (
                    <span key={c} className="ai-chip">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <div className="ai-cards">
              {FEATURES.map((f) => (
                <article key={f.title} className="ai-card" onPointerMove={spot}>
                  <span className="ai-ic">
                    <Icon d={f.icon} />
                  </span>
                  <h3 className="text-h5">{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              ))}
            </div>

            <div className="ai-cta">
              <Link className="ai-btn" href="/about">
                More About Us <span aria-hidden="true">→</span>
              </Link>
              <a className="ai-call" href="tel:+918872150361">
                <span className="ai-ph">
                  <Icon
                    size={22}
                    d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
                  />
                </span>
                <span>
                  <small>Contact Us 24/7</small>
                  <strong>+91 88721 50361</strong>
                </span>
              </a>
            </div>
          </div>

          <div className="ai-stage">
            <div
              className="ai-scene"
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty(
                  "--x",
                  `${((e.clientX - r.left) / r.width) * 100}%`,
                );
                e.currentTarget.style.setProperty(
                  "--y",
                  `${((e.clientY - r.top) / r.height) * 100}%`,
                );
              }}
            >
              <div className="ai-mesh" />
              <div className="ai-glow" />

              {tab === 0 && (
                <div className="ai-sl">
                  <div className="ai-ring">
                    {ORBIT.map((o, i) => {
                      const a = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2;
                      return (
                        <div
                          key={o}
                          className="ai-ob"
                          style={{
                            left: `${50 + Math.cos(a) * 50}%`,
                            top: `${50 + Math.sin(a) * 50}%`,
                          }}
                        >
                          {o}
                        </div>
                      );
                    })}
                  </div>
                  <div className="ai-hub">
                    Digital
                    <br />
                    Solution
                  </div>
                </div>
              )}

              {tab === 1 && (
                <div className="ai-sl">
                  <TechScene />
                </div>
              )}

              {tab === 2 && (
                <div className="ai-sl">
                  <span className="ai-tip">Sustainable growth</span>
                  <div className="ai-chart">
                    {BARS.map(([l, h]) => (
                      <div className="ai-col" key={l}>
                        <div className="ai-b" style={{ "--h": `${h}%` }} />
                        <span>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link className="ai-trust" href="/portfolio">
              <span className="ai-av" aria-hidden="true">
                <i style={{ background: "var(--ds-primary)" }}>A</i>
                <i style={{ background: "var(--ds-violet)" }}>P</i>
                <i style={{ background: "var(--ds-cyan)" }}>R</i>
              </span>
              <span ref={countRef}>
                <em>{count}</em>+ Trusted Customers
              </span>
              <span className="ai-go" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
