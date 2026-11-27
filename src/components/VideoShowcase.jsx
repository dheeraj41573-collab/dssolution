"use client";

import { useEffect, useRef } from "react";

// Cloudinary delivery base for the showcase video.
const CLOUDINARY = "https://res.cloudinary.com/l8vkwojw/video/upload";
const CLOUDINARY_VERSION = "v1794888820";

// Poster frame (WebP/AVIF) — Cloudinary picks the best format per browser.
const POSTER = `${CLOUDINARY}/so_3,w_1280,q_auto,f_auto/${CLOUDINARY_VERSION}/showcase.webp`;
const SOURCE_LARGE = `${CLOUDINARY}/q_auto,w_1280/${CLOUDINARY_VERSION}/showcase.mp4`;

export default function VideoShowcase() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const desktopViewport = window.matchMedia("(min-width: 768px)");
    let observer;
    const loadVideo = () => {
      if (!desktopViewport.matches || video.dataset.loaded === "true") return;
      video.dataset.loaded = "true";
      video.poster = POSTER;
      video.src = SOURCE_LARGE;
      video.load();
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) loadVideo();
        },
        { rootMargin: "200px 0px" },
      );
      observer.observe(container);

      const handleViewportChange = () => {
        if (desktopViewport.matches) observer.observe(container);
        else observer.unobserve(container);
      };
      desktopViewport.addEventListener("change", handleViewportChange);

      return () => {
        observer.disconnect();
        desktopViewport.removeEventListener("change", handleViewportChange);
      };
    }

    loadVideo();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-video w-full max-w-280 overflow-hidden rounded-4xl bg-gradient-to-br from-slate-900 via-slate-800 to-[#164e63]"
      data-gsap-video-showcase
    >
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
      >
        Your browser does not support the video tag.
      </video>
      <div
        className="pointer-events-none absolute inset-0 bg-black/35"
        aria-hidden="true"
      />
    </div>
  );
}
