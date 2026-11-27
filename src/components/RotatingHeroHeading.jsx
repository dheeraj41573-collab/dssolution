"use client";

import { useEffect, useState } from "react";

const services = [
  "Video & Content",
  "Digital Marketing",
  "Web Development",
  "SEO & Paid Ads",
  "Branding & Design",
  "Social Media",
];

function RotatingService() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % services.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <span
      key={activeIndex}
      className="hero-service-name text-primary inline-block text-[0.68em] sm:text-[0.84em] lg:text-[1em]"
      aria-hidden="true"
    >
      {services[activeIndex]}
    </span>
  );
}

export default function RotatingHeroHeading() {
  return (
    <h1 className="mx-auto mb-4 pt-12 text-balance lg:mb-8 lg:w-9/12 lg:pt-2">
      <span className="block">We help your business grow with</span>
      <span className="block min-h-[1.2em]">
        <RotatingService />
      </span>
      <span className="sr-only">
        We help your business grow with digital marketing, web development, SEO
        and paid ads, branding and design, social media marketing, and video
        content.
      </span>
    </h1>
  );
}
