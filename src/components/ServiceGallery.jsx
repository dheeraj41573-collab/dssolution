"use client";

import { useCallback, useEffect, useState } from "react";

function MagnifyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6 fill-none stroke-current"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4M11 8.5v5M8.5 11h5" />
    </svg>
  );
}

// Grid of the real images lifted out of the imported copy. Clicking one opens a
// lightbox that can be stepped through with the arrow keys or buttons.
export default function ServiceGallery({
  images,
  title = "Inside this service",
}) {
  const [openIndex, setOpenIndex] = useState(-1);
  const isOpen = openIndex >= 0;
  const total = images.length;

  const close = useCallback(() => setOpenIndex(-1), []);

  const step = useCallback(
    (delta) => {
      setOpenIndex((current) =>
        current < 0 ? current : (current + delta + total) % total,
      );
    },
    [total],
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [isOpen, close, step]);

  if (!total) return null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {images.map((image, index) => {
          const featured = index === 0 && total > 2;
          return (
            <li
              key={image.src}
              className={featured ? "col-span-2 row-span-2" : undefined}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`Open image ${index + 1} of ${total}`}
                className={`sd-gallery-item group border-border bg-light focus-visible:outline-primary relative block size-full overflow-hidden rounded-2xl border focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  featured ? "min-h-64" : ""
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className={`w-full object-cover ${
                    featured ? "h-full" : "aspect-square"
                  }`}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 grid place-items-center text-[#fff] opacity-0 transition duration-200 group-hover:bg-[#08122a]/45 group-hover:opacity-100 group-focus-visible:bg-[#08122a]/45 group-focus-visible:opacity-100"
                >
                  <MagnifyIcon />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title}: image ${openIndex + 1} of ${total}`}
          className="sd-lightbox fixed inset-0 z-100 flex flex-col gap-4 bg-[#050a18]/94 p-4 sm:p-8"
        >
          <div className="flex items-center justify-between text-[#fff]">
            <p className="text-sm font-semibold tracking-wider">
              {openIndex + 1} / {total}
            </p>
            <button
              type="button"
              onClick={close}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#fff]/35 px-4 text-sm font-semibold transition hover:bg-[#fff]/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff]"
            >
              Close ✕
            </button>
          </div>

          <div className="sd-lightbox-figure relative flex min-h-0 flex-1 items-center justify-center">
            <img
              key={images[openIndex].src}
              src={images[openIndex].src}
              alt={images[openIndex].alt}
              className="max-h-full max-w-full rounded-2xl object-contain"
            />
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                  className="sd-lightbox-btn left-2 sm:left-4"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next image"
                  className="sd-lightbox-btn right-2 sm:right-4"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {images[openIndex].alt && (
            <p className="text-center text-sm text-[#fff]/80">
              {images[openIndex].alt}
            </p>
          )}
        </div>
      )}
    </>
  );
}
