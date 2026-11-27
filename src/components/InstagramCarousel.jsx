"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaInstagram,
  FaPlay,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { instagram } from "@/lib/instagramReels";

const IMAGE_MS = 5000;

export default function InstagramCarousel({ items }) {
  const total = items.length;
  const [active, setActive] = useState(Math.min(1, total - 1));
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [embedOpen, setEmbedOpen] = useState(false);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const touchX = useRef(null);

  const go = (index) => {
    setEmbedOpen(false);
    setProgress(0);
    setActive(((index % total) + total) % total);
  };
  const next = () => go(active + 1);
  const prev = () => go(active - 1);

  const current = items[active];
  const isVideo = Boolean(current?.video);

  // Only run while the section is on screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Play / pause the active video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!inView || embedOpen) {
      video.pause();
      return;
    }
    video.muted = muted;
    video.play().catch(() => {
      // browser blocked sound autoplay -> fall back to muted
      setMuted(true);
      video.muted = true;
      video.play().catch(() => {});
    });
  }, [active, inView, muted, embedOpen]);

  // Auto-advance for image posts (videos advance when they finish)
  useEffect(() => {
    if (total < 2 || !inView || paused || embedOpen || isVideo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => go(active + 1), IMAGE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, inView, paused, embedOpen, isVideo, total]);

  if (!total) {
    return (
      <section className="section pb-0" aria-label="From our Instagram">
        <div className="container">
          <div className="border-border bg-light rounded-[2rem] border px-4 py-12 text-center sm:px-8 sm:py-16">
            <FaInstagram className="mx-auto size-7 text-[#e1306c]" />
            <h2 className="text-text-dark mt-5 mb-3 text-3xl font-black tracking-tight sm:text-4xl">
              Photos, videos &amp; Reels
            </h2>
            <p className="text-text-light mx-auto mb-6 max-w-lg text-sm">
              See the latest posts from our Instagram profile.
            </p>
            <a
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-brand-link inline-flex items-center gap-2.5 rounded-full bg-[#0b1530] px-5 py-2.5 text-xs font-semibold shadow-lg transition hover:-translate-y-0.5"
            >
              Follow us on Instagram
            </a>
          </div>
        </div>
      </section>
    );
  }

  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
  };

  return (
    <section
      ref={sectionRef}
      aria-label="From our Instagram"
      className="section pb-0"
    >
      <div className="container">
        <div className="border-border bg-light relative overflow-hidden rounded-[2rem] border px-4 py-12 sm:px-8 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full opacity-60 blur-3xl"
            style={{
              background:
                "color-mix(in srgb, var(--color-primary) 25%, transparent)",
            }}
          />

          <div className="relative mx-auto max-w-2xl text-center">
            <span className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase">
              <i
                className="bg-primary size-1.5 rounded-full"
                aria-hidden="true"
              />
              From our Instagram
            </span>
            <h2 className="text-text-dark mt-5 mb-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              A little more life in every scroll.
            </h2>
            <p className="text-text-light mx-auto mb-6 max-w-lg text-sm">
              Short stories, fresh ideas and a closer look at the work behind
              the brand.
            </p>
            <a
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-brand-link inline-flex items-center gap-2.5 rounded-full bg-[#0b1530] px-5 py-2.5 text-xs font-semibold shadow-lg transition hover:-translate-y-0.5"
            >
              <FaInstagram className="size-4 text-[#e1306c]" /> Follow us on
              Instagram
            </a>
          </div>

          <div
            className="relative mx-auto mt-10 h-[25rem] max-w-4xl [--reel-gap:9.5rem] sm:h-[29rem] sm:[--reel-gap:15rem]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={onTouchEnd}
          >
            {items.map((item, i) => {
              let d = (((i - active) % total) + total) % total;
              if (d > total / 2) d -= total;
              if (Math.abs(d) > 2) return null; // only render neighbours (works with 100s of posts)

              const isActive = d === 0;
              const visible = Math.abs(d) <= 1;
              const showEmbed = isActive && embedOpen && item.embedUrl;

              return (
                <article
                  key={item.id}
                  aria-hidden={!visible}
                  onClick={() => !isActive && visible && go(i)}
                  className={`absolute top-3 left-1/2 h-[22rem] w-56 overflow-hidden rounded-3xl border-4 border-white/80 shadow-2xl transition-all duration-700 ease-out sm:h-[26rem] sm:w-64 dark:border-white/10 ${
                    isActive ? "z-20" : "z-10 cursor-pointer"
                  } ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
                  style={{
                    transform: isActive
                      ? "translateX(-50%) scale(1)"
                      : `translateX(calc(-50% + ${d} * var(--reel-gap))) rotate(${d * 7}deg) scale(0.82)`,
                    filter: isActive
                      ? "none"
                      : "saturate(0.9) brightness(0.95)",
                  }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} ${
                      isActive
                        ? "animate-[reel-zoom_8s_ease-in-out_infinite_alternate] motion-reduce:animate-none"
                        : ""
                    }`}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={
                          item.title
                            ? `${item.title} preview`
                            : "Instagram reel preview"
                        }
                        className="size-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {isActive && item.video && !showEmbed && (
                      <video
                        ref={videoRef}
                        key={item.id}
                        src={inView ? item.video : undefined}
                        poster={item.image || undefined}
                        className="absolute inset-0 size-full object-cover"
                        muted={muted}
                        playsInline
                        loop={total === 1}
                        preload="none"
                        onEnded={next}
                        onTimeUpdate={(e) =>
                          setProgress(
                            (e.currentTarget.currentTime /
                              (e.currentTarget.duration || 1)) *
                              100,
                          )
                        }
                        onError={() => {
                          if (item.embedUrl) setEmbedOpen(true);
                        }}
                      />
                    )}
                  </div>
                  <div className="instagram-reel-overlay absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                  <span className="text-on-accent absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase backdrop-blur">
                    <i
                      className="size-1.5 rounded-full bg-rose-500"
                      aria-hidden="true"
                    />
                    {isActive
                      ? "Now playing"
                      : `Reel ${String(i + 1).padStart(2, "0")}`}
                  </span>

                  {/* sound toggle for the playing video */}
                  {isActive && item.video && !showEmbed && (
                    <button
                      type="button"
                      onClick={() => setMuted((m) => !m)}
                      aria-label={muted ? "Turn sound on" : "Mute"}
                      className="home-carousel-control text-on-accent absolute top-3 right-3 z-10 grid size-8 place-items-center rounded-full bg-black/45 backdrop-blur"
                    >
                      {muted ? (
                        <FaVolumeMute className="size-3.5" />
                      ) : (
                        <FaVolumeUp className="size-3.5" />
                      )}
                    </button>
                  )}

                  {/* play button only for items that have no playable file */}
                  {isActive &&
                    !item.video &&
                    !showEmbed &&
                    (item.embedUrl || item.permalink) &&
                    (item.embedUrl ? (
                      <button
                        type="button"
                        aria-label={`Play ${item.title}`}
                        onClick={() => setEmbedOpen(true)}
                        className="home-carousel-control text-on-accent absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/25 backdrop-blur transition hover:scale-110"
                      >
                        <FaPlay className="ml-1 size-5" />
                      </button>
                    ) : (
                      <a
                        href={item.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${item.title} on Instagram`}
                        className="home-carousel-control text-on-accent absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/25 backdrop-blur transition hover:scale-110"
                      >
                        <FaPlay className="ml-1 size-5" />
                      </a>
                    ))}

                  <div className="absolute right-0 bottom-0 left-0 p-4 pb-5">
                    <h3 className="text-on-accent mb-1 line-clamp-2 text-base leading-tight font-extrabold sm:text-lg">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-on-accent mb-0 line-clamp-1 text-[10px]">
                        {item.caption}
                      </p>
                    )}
                  </div>

                  {isActive && (
                    <div className="absolute right-4 bottom-2 left-4 h-0.5 overflow-hidden rounded-full bg-white/30">
                      <div
                        key={`${i}-${paused}`}
                        className="h-full rounded-full bg-white"
                        style={
                          item.video
                            ? { width: `${progress}%` }
                            : total > 1 && !paused && !embedOpen && inView
                              ? {
                                  animation: `reel-progress ${IMAGE_MS}ms linear forwards`,
                                }
                              : { width: "0%" }
                        }
                      />
                    </div>
                  )}

                  {showEmbed && (
                    <div className="absolute inset-0 z-30 bg-white">
                      <iframe
                        src={item.embedUrl}
                        title={item.title}
                        className="size-full border-0"
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                        scrolling="no"
                      />
                      <button
                        type="button"
                        aria-label="Close player"
                        onClick={() => setEmbedOpen(false)}
                        className="text-on-accent absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-black/60 text-base"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </article>
              );
            })}

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous reel"
                  className="home-carousel-control border-border bg-body text-primary absolute top-1/2 left-[calc(50%-9.7rem)] z-30 grid size-9 -translate-y-1/2 place-items-center rounded-full border shadow-md transition hover:scale-110 sm:left-[calc(50%-10.7rem)]"
                >
                  <FaChevronLeft className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next reel"
                  className="home-carousel-control border-border bg-body text-primary absolute top-1/2 right-[calc(50%-9.7rem)] z-30 grid size-9 -translate-y-1/2 place-items-center rounded-full border shadow-md transition hover:scale-110 sm:right-[calc(50%-10.7rem)]"
                >
                  <FaChevronRight className="size-3" />
                </button>
              </>
            )}
          </div>

          {total > 1 &&
            (total <= 8 ? (
              <div className="mt-2 flex items-center justify-center gap-2">
                {items.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Go to reel ${i + 1}`}
                    aria-current={i === active}
                    className={`home-carousel-dot h-1.5 rounded-full transition-all ${i === active ? "bg-primary w-5" : "bg-border w-1.5"}`}
                  />
                ))}
              </div>
            ) : (
              <p className="text-text mt-2 mb-0 text-center text-xs font-bold tabular-nums">
                {String(active + 1).padStart(2, "0")}{" "}
                <span className="text-text-light font-normal">
                  / {String(total).padStart(2, "0")}
                </span>
              </p>
            ))}
          <p className="text-text-light mt-6 mb-0 text-center text-[10px] font-semibold tracking-[0.2em] uppercase">
            Auto-playing · Looping · Soft zoom
          </p>
        </div>
      </div>
    </section>
  );
}
