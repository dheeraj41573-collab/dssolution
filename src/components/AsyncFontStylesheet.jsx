"use client";

import { useEffect } from "react";

export default function AsyncFontStylesheet({ href }) {
  useEffect(() => {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = href;
    document.head.appendChild(stylesheet);

    return () => stylesheet.remove();
  }, [href]);

  return null;
}
