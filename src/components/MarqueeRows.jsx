"use client";

import { useEffect, useState } from "react";

/**
 * Infinite marquee rows. Row direction alternates automatically:
 * row 0 -> left to right, row 1 -> right to left, row 2 -> left to right ...
 * Hover (or keyboard focus) pauses a row.
 */
function MarqueeRow({ index, speed, children }) {
  const direction = index % 2 === 0 ? "ltr" : "rtl";
  return (
    <div className="marquee-row" data-direction={direction}>
      <div
        className="marquee-track"
        style={{ "--marquee-duration": `${speed}s` }}
      >
        {/* two identical halves => seamless -50% loop */}
        <div className="marquee-half">{children}</div>
        <div className="marquee-half" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ShowcaseMarquee({ rows }) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === "Escape" && setActive(null);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <>
      <div className="marquee-stack">
        {rows.map((row, rowIndex) => (
          <MarqueeRow key={rowIndex} index={rowIndex} speed={50 + rowIndex * 8}>
            {[...row, ...row].map((item, i) => (
              <button
                type="button"
                className="showcase-card"
                key={`${item.id}-${i}`}
                onClick={() => setActive(item)}
                aria-label={`Preview ${item.industry} campaign artwork`}
              >
                <span className="showcase-card-caption">
                  <span className="showcase-card-industry">
                    {item.industry}
                  </span>
                  <span className="showcase-card-title">{item.title}</span>
                </span>
                <img
                  src={item.image}
                  alt={`${item.industry} campaign artwork`}
                  loading="lazy"
                  draggable="false"
                />
              </button>
            ))}
          </MarqueeRow>
        ))}
      </div>

      {active && (
        <div
          className="showcase-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.industry} campaign preview`}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="showcase-lightbox-close"
            aria-label="Close"
            onClick={() => setActive(null)}
          >
            <span aria-hidden="true">×</span> Close
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img
              src={active.image}
              alt={`${active.industry} campaign artwork`}
            />
          </figure>
        </div>
      )}
    </>
  );
}

function initials(name) {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function VoicesMarquee({ rows }) {
  return (
    <div className="marquee-stack">
      {rows.map((row, rowIndex) => (
        <MarqueeRow key={rowIndex} index={rowIndex} speed={60 + rowIndex * 10}>
          {[...row, ...row].map((item, i) => (
            <article className="voice-card" key={`${item.name}-${i}`}>
              <div className="voice-card-stars" aria-label="5 out of 5 stars">
                {"★★★★★"}
              </div>
              <p className="voice-card-quote">“{item.content}”</p>
              <div className="voice-card-author">
                <span className="voice-card-avatar" aria-hidden="true">
                  {initials(item.name)}
                </span>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.designation}</p>
                  {item.industry && <span>{item.industry}</span>}
                </div>
              </div>
            </article>
          ))}
        </MarqueeRow>
      ))}
    </div>
  );
}
