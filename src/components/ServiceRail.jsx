"use client";

import { useEffect, useState } from "react";

// Sticky in-page navigation for a service page. It tracks which section is
// currently on screen and smooth-scrolls to a section when its link is used,
// so readers can jump around a long page without losing their place.
export default function ServiceRail({ items, label = "On this page" }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const key = items.map((item) => item.id).join("|");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-22% 0px -62% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  function handleClick(event, id) {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", `#${id}`);
    setActive(id);
  }

  if (items.length < 3) return null;

  return (
    <nav
      aria-label={label}
      className="sd-rail bg-body/90 sticky top-16 z-30 -mx-8 px-8 py-2 backdrop-blur lg:top-28 lg:z-auto lg:mx-0 lg:self-start lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none"
    >
      <p className="text-text-light mb-3 hidden text-xs font-semibold tracking-[0.18em] uppercase lg:block">
        {label}
      </p>
      <ul className="sd-rail-list flex gap-2 overflow-x-auto pb-1 lg:max-h-[calc(100vh-9rem)] lg:flex-col lg:gap-1 lg:overflow-y-auto lg:pb-0">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id} className="shrink-0 lg:shrink">
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                onClick={(event) => handleClick(event, item.id)}
                className={`sd-rail-link sd-hover-tint block rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors lg:rounded-lg lg:px-5 lg:py-2.5 ${
                  isActive
                    ? "is-active sd-accent-border sd-chip font-semibold lg:border-transparent lg:bg-transparent"
                    : "border-border bg-light text-text lg:border-transparent lg:bg-transparent"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
