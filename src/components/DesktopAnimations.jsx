"use client";

import { useEffect } from "react";

const animationScripts = [
  {
    src: "https://cdn.jsdelivr.net/npm/gsap@3.14.1/dist/gsap.min.js",
    crossOrigin: "anonymous",
  },
  {
    src: "https://cdn.jsdelivr.net/npm/gsap@3.14.1/dist/ScrollTrigger.min.js",
    crossOrigin: "anonymous",
  },
  {
    src: "https://unpkg.com/lenis@1.3.17/dist/lenis.min.js",
    crossOrigin: "anonymous",
  },
  { src: "/scripts/animations.js", type: "module" },
];

let desktopAnimationsPromise;

function loadScript({ src, type, crossOrigin }) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    if (type) script.type = type;
    if (crossOrigin) script.crossOrigin = crossOrigin;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

function loadDesktopAnimations() {
  if (!desktopAnimationsPromise) {
    desktopAnimationsPromise = animationScripts.reduce(
      (pending, script) => pending.then(() => loadScript(script)),
      Promise.resolve(),
    );
    desktopAnimationsPromise.catch((error) => {
      console.error("Could not load desktop animations.", error);
    });
  }
  return desktopAnimationsPromise;
}

export default function DesktopAnimations() {
  useEffect(() => {
    const desktopViewport = window.matchMedia("(min-width: 768px)");
    const scheduleLoad = () => {
      if (!desktopViewport.matches) return;
      const startLoad = () => loadDesktopAnimations();
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(startLoad, { timeout: 3000 });
      } else {
        window.setTimeout(startLoad, 1000);
      }
    };
    const handleViewportChange = () => {
      if (desktopViewport.matches) scheduleLoad();
    };

    if (document.readyState === "complete") {
      scheduleLoad();
    } else {
      window.addEventListener("load", scheduleLoad, { once: true });
    }
    desktopViewport.addEventListener("change", handleViewportChange);
    return () => {
      window.removeEventListener("load", scheduleLoad);
      desktopViewport.removeEventListener("change", handleViewportChange);
    };
  }, []);

  return null;
}
