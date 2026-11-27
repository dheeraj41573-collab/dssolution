// ─────────────────────────────────────────────────────────────
// Instagram reels shown above the footer.
// Account: https://www.instagram.com/digital__solutions___/
//
// Manual fallback entries are used only when the Instagram API is unavailable.
// Posts must be public for the Instagram player to work.
// ─────────────────────────────────────────────────────────────

export const instagram = {
  handle: "digital__solutions___",
  url: "https://www.instagram.com/digital__solutions___/",
};

export const reels = [];

export function getEmbedUrl(url = "") {
  const match = url.match(
    /instagram\.com\/(?:[\w.]+\/)?(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/,
  );
  if (!match) return "";
  const type = match[1] === "reels" ? "reel" : match[1];
  return `https://www.instagram.com/${type}/${match[2]}/embed/`;
}
