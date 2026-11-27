"use client";

import { useEffect } from "react";

const editableSelector = "h1,h2,h3,h4,h5,p,li,blockquote,figcaption,a,button";

function hash(value) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(36);
}

function safeHref(value) {
  const href = String(value || "").trim();
  return /^(?:https?:\/\/|mailto:|tel:|\/(?!\/)|#|\.\/|[a-z0-9][a-z0-9._/-]*(?:[?#]|$))/i.test(
    href,
  )
    ? href
    : "";
}

function wrapTextWithLink(element, phrase, href) {
  if (!phrase) return false;

  const textNodes = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let fullText = "";
  let textNode;
  while ((textNode = walker.nextNode())) {
    const start = fullText.length;
    fullText += textNode.textContent;
    textNodes.push({ node: textNode, start, end: fullText.length });
  }

  const start = fullText.indexOf(phrase);
  if (start < 0) return false;
  const end = start + phrase.length;
  const firstNode = textNodes.find(
    (entry) => start >= entry.start && start < entry.end,
  );
  const lastNode = textNodes.find(
    (entry) => end > entry.start && end <= entry.end,
  );
  if (!firstNode || !lastNode) return false;

  const range = document.createRange();
  range.setStart(firstNode.node, start - firstNode.start);
  range.setEnd(lastNode.node, end - lastNode.start);
  if (range.cloneContents().querySelector?.("a")) return false;

  const link = document.createElement("a");
  link.setAttribute("href", href);
  link.dataset.pageEditLink = "true";
  link.appendChild(range.extractContents());
  range.insertNode(link);
  return true;
}

export default function PageContentBridge({
  pathname,
  contentEdits = [],
  imageAlts = [],
}) {
  useEffect(() => {
    const editorMode =
      window.parent !== window &&
      new URLSearchParams(window.location.search).get("__page_editor") === "1";
    const contentOriginals = new Map();
    const trackedContentNodes = new Map();
    const imageOriginals = new Map();
    let activeContentEdits = contentEdits;
    let activeImageAlts = imageAlts;
    let lastInventorySignature = "";

    function getHeaderLogos() {
      return [
        ...document.querySelectorAll(
          "header .site-header-brand img, #mobile-nav-drawer img",
        ),
      ];
    }

    function scan() {
      const main =
        document.querySelector("#main-content") ||
        document.querySelector("main") ||
        document.body;
      const candidates = [...main.querySelectorAll(editableSelector)].filter(
        (node) => {
          if (!node.textContent.trim() || node.closest("header,nav,footer"))
            return false;
          if (
            node.matches("h1") &&
            node.querySelector(".sr-only, [aria-hidden='true']")
          )
            return false;
          if (node.matches('a[data-page-edit-link="true"]')) return false;
          const currentKey = node.dataset.pageEditKey;
          if (currentKey && trackedContentNodes.get(currentKey) === node)
            return true;
          return ![...node.querySelectorAll(editableSelector)].some(
            (child) => !child.matches('a[data-page-edit-link="true"]'),
          );
        },
      );
      const occurrences = new Map();
      candidates.forEach((node) => {
        const type = node.tagName.toLowerCase() === "a" ? "link" : "text";
        const text = node.textContent.trim();
        const signature = `${node.tagName.toLowerCase()}:${hash(text)}`;
        const occurrence = occurrences.get(signature) || 0;
        occurrences.set(signature, occurrence + 1);
        const key =
          node.dataset.pageEditKey ||
          `content-${node.tagName.toLowerCase()}-${hash(text)}-${occurrence}`;
        node.dataset.pageEditKey = key;
        if (!contentOriginals.has(key)) {
          contentOriginals.set(key, {
            html: node.innerHTML,
            text,
            href: node.getAttribute("href") || "",
            type,
            tag: node.tagName.toLowerCase(),
          });
        }
        trackedContentNodes.set(key, node);
      });
      const content = [...trackedContentNodes.entries()]
        .filter(([, node]) => node.isConnected)
        .map(([key]) => {
          const original = contentOriginals.get(key);
          return {
            key,
            type: original.type,
            tag: original.tag,
            text: original.text,
            href: original.href,
          };
        });

      const imageOccurrences = new Map();
      const allHeaderLogos = getHeaderLogos();
      allHeaderLogos.forEach((image) => {
        if (!image.hasAttribute("data-page-image-original-src"))
          image.dataset.pageImageOriginalSrc = image.getAttribute("src") || "";
        if (!image.hasAttribute("data-page-image-original-alt"))
          image.dataset.pageImageOriginalAlt = image.getAttribute("alt") || "";
        if (!image.hasAttribute("data-page-image-original-title"))
          image.dataset.pageImageOriginalTitle =
            image.getAttribute("title") || "";
      });
      const headerLogos = pathname === "/" ? allHeaderLogos : [];
      const seenImageKeys = new Set();
      const images = [...main.querySelectorAll("img"), ...headerLogos]
        .map((image) => {
          const isHeaderLogo = allHeaderLogos.includes(image);
          const sourceCandidates = isHeaderLogo
            ? [image.dataset.pageImageOriginalSrc]
            : [image.getAttribute("src"), image.dataset.src, image.currentSrc];
          const src = sourceCandidates.find(
            (candidate) =>
              candidate &&
              !/^(?:data|blob|javascript|vbscript):/i.test(candidate),
          );
          if (!src) return null;
          const occurrence = imageOccurrences.get(src) || 0;
          if (!isHeaderLogo) imageOccurrences.set(src, occurrence + 1);
          const key = isHeaderLogo
            ? "header-logo"
            : image.dataset.pageImageKey || `image-${hash(src)}-${occurrence}`;
          image.dataset.pageImageKey = key;
          if (!imageOriginals.has(key)) {
            imageOriginals.set(key, {
              src,
              alt: isHeaderLogo
                ? image.dataset.pageImageOriginalAlt
                : image.getAttribute("alt") || "",
              title: isHeaderLogo
                ? image.dataset.pageImageOriginalTitle
                : image.getAttribute("title") || "",
            });
          }
          const original = imageOriginals.get(key);
          if (seenImageKeys.has(key)) return null;
          seenImageKeys.add(key);
          return {
            key,
            src: original.src,
            alt: original.alt,
            title: original.title,
            ...(isHeaderLogo ? { label: "Site header logo (Home only)" } : {}),
          };
        })
        .filter(Boolean);
      return {
        main,
        contentNodes: [...trackedContentNodes.entries()]
          .filter(([, node]) => node.isConnected)
          .map(([, node]) => node),
        content,
        images,
      };
    }

    function applyOverrides() {
      const inventory = scan();
      const editsByKey = new Map(
        activeContentEdits.map((edit) => [edit.key, edit]),
      );
      const imageAltsByKey = new Map(
        activeImageAlts.map((image) => [image.key, image]),
      );

      inventory.contentNodes.forEach((node) => {
        const key = node.dataset.pageEditKey;
        const original = contentOriginals.get(key);
        const edit = editsByKey.get(key);
        if (!edit) {
          if (node.innerHTML !== original.html) node.innerHTML = original.html;
          return;
        }
        if (edit.type === "link") {
          const text = edit.text ?? original.text;
          if (node.textContent !== text) node.textContent = text;
          const href = safeHref(edit.href);
          if (href && node.getAttribute("href") !== href)
            node.setAttribute("href", href);
          if (!href && node.hasAttribute("href")) node.removeAttribute("href");
          return;
        }

        const text = edit.text ?? original.text;
        const href = safeHref(edit.href);
        if (href) {
          if (node.tagName.toLowerCase() === "a") {
            if (node.getAttribute("href") !== href)
              node.setAttribute("href", href);
            if (node.textContent !== text) node.textContent = text;
          } else {
            const linkText = (edit.linkText || "").trim();
            const existingLink = node.querySelector(
              'a[data-page-edit-link="true"]',
            );
            if (
              existingLink?.textContent === linkText &&
              existingLink.getAttribute("href") === href &&
              node.textContent === text
            ) {
              return;
            }
            if (existingLink) node.innerHTML = original.html;
            if (node.textContent !== text) node.textContent = text;
            if (linkText) wrapTextWithLink(node, linkText, href);
          }
        } else {
          if (node.querySelector('a[data-page-edit-link="true"]'))
            node.innerHTML = original.html;
          if (node.textContent !== text) node.textContent = text;
        }
      });

      const pageImages = [
        ...inventory.main.querySelectorAll("img"),
        ...(pathname === "/" ? getHeaderLogos() : []),
      ];
      pageImages.forEach((image) => {
        const key = image.dataset.pageImageKey;
        const original = imageOriginals.get(key);
        const edit = imageAltsByKey.get(key);
        const alt = edit?.alt ?? original?.alt ?? "";
        const src = edit?.src || original?.src || "";
        const title = edit?.title ?? original?.title ?? "";
        if (image.getAttribute("alt") !== alt) image.setAttribute("alt", alt);
        if (src && image.getAttribute("src") !== src)
          image.setAttribute("src", src);
        if (image.getAttribute("title") !== title)
          image.setAttribute("title", title);
      });
      if (pathname !== "/") {
        getHeaderLogos().forEach((image) => {
          const src = image.dataset.pageImageOriginalSrc;
          if (src && image.getAttribute("src") !== src)
            image.setAttribute("src", src);
          const alt = image.dataset.pageImageOriginalAlt || "";
          const title = image.dataset.pageImageOriginalTitle || "";
          if (image.getAttribute("alt") !== alt) image.setAttribute("alt", alt);
          if (image.getAttribute("title") !== title)
            image.setAttribute("title", title);
        });
      }
      return inventory;
    }

    function sendInventory(inventory = scan(), force = false) {
      if (!editorMode) return;
      const signature = JSON.stringify([inventory.content, inventory.images]);
      if (!force && signature === lastInventorySignature) return;
      lastInventorySignature = signature;
      window.parent.postMessage(
        {
          type: "page-editor:inventory",
          pathname,
          content: inventory.content,
          images: inventory.images,
        },
        "*",
      );
    }

    const onMessage = (event) => {
      if (!editorMode || event.source !== window.parent) return;
      if (event.data?.type === "page-editor:request-inventory") {
        sendInventory(scan(), true);
      } else if (event.data?.type === "page-editor:preview") {
        activeContentEdits = Array.isArray(event.data.contentEdits)
          ? event.data.contentEdits
          : [];
        activeImageAlts = Array.isArray(event.data.imageAlts)
          ? event.data.imageAlts
          : [];
        sendInventory(applyOverrides());
      }
    };

    const stopLinkNavigation = (event) => {
      if (editorMode && event.target.closest("a")) event.preventDefault();
    };

    const initialInventory = applyOverrides();
    window.addEventListener("message", onMessage);
    document.addEventListener("click", stopLinkNavigation);
    let observer;
    let scanTimer = 0;
    if (editorMode || contentEdits.length || imageAlts.length) {
      observer = new MutationObserver(() => {
        if (scanTimer) return;
        scanTimer = window.setTimeout(() => {
          scanTimer = 0;
          const inventory =
            activeContentEdits.length || activeImageAlts.length
              ? applyOverrides()
              : scan();
          sendInventory(inventory);
        }, 250);
      });
      observer.observe(initialInventory.main, {
        childList: true,
        subtree: true,
      });
    }
    if (editorMode) window.setTimeout(sendInventory, 0);

    return () => {
      observer?.disconnect();
      if (scanTimer) window.clearTimeout(scanTimer);
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", stopLinkNavigation);
    };
  }, [contentEdits, imageAlts, pathname]);

  return null;
}
