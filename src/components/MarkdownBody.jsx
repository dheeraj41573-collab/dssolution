"use client";

import { useRouter } from "next/navigation";
import { linkifyEmails } from "@/lib/utils/linkifyEmails";

export default function MarkdownBody({ html, className = "" }) {
  const router = useRouter();

  function handleClick(event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const anchor = event.target.closest?.("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (
      !href ||
      !href.startsWith("/") ||
      anchor.getAttribute("target") === "_blank" ||
      anchor.hasAttribute("download")
    ) {
      return;
    }

    event.preventDefault();
    router.push(href);
  }

  const safeHtml = typeof html === "string" ? linkifyEmails(html) : html;

  return (
    <div
      className={`content ${className}`}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
