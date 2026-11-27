// Server-side loader for the Instagram carousel.
// Uses the official Instagram API (graph.instagram.com) when INSTAGRAM_ACCESS_TOKEN is set,
// otherwise falls back to the manual list in src/lib/instagramReels.js.
import { reels as fallbackReels, getEmbedUrl } from "@/lib/instagramReels";

const FIELDS =
  "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{id,media_type,media_url,thumbnail_url}";

const GRADIENTS = [
  "from-orange-300 via-rose-400 to-indigo-900",
  "from-sky-300 via-blue-500 to-indigo-900",
  "from-amber-200 via-orange-400 to-rose-700",
  "from-emerald-300 via-teal-500 to-slate-900",
  "from-fuchsia-300 via-purple-500 to-indigo-900",
];

function splitCaption(caption = "", fallbackTitle) {
  const clean = caption
    .replace(/#[\p{L}\p{N}_]+/gu, "") // drop hashtags
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const title = (clean[0] || fallbackTitle).slice(0, 60);
  const text = (clean.slice(1).join(" ") || "").slice(0, 70);
  return { title, caption: text };
}

function fromApi(post, index) {
  const media =
    post.media_type === "CAROUSEL_ALBUM" && post.children?.data?.length
      ? post.children.data
      : [post];

  return media
    .filter((item) => item.media_url)
    .map((item, mediaIndex) => {
      const isVideo = item.media_type === "VIDEO";
      const { title, caption } = splitCaption(
        post.caption,
        isVideo ? "Watch our latest reel" : "From our Instagram",
      );
      return {
        id: `${post.id}-${item.id || mediaIndex}`,
        type: isVideo ? "video" : "image",
        video: isVideo ? item.media_url : "",
        image: isVideo
          ? item.thumbnail_url || ""
          : item.media_url || item.thumbnail_url || "",
        title,
        caption,
        permalink: post.permalink,
        embedUrl: getEmbedUrl(post.permalink),
        gradient: GRADIENTS[(index + mediaIndex) % GRADIENTS.length],
      };
    });
}

function fromStatic() {
  return fallbackReels.map((reel, index) => ({
    id: `static-${index}`,
    type: reel.video ? "video" : "image",
    video: reel.video || "",
    image: reel.image || "",
    title: reel.title,
    caption: reel.caption,
    permalink: reel.url || "",
    embedUrl: getEmbedUrl(reel.url),
    gradient: reel.gradient || GRADIENTS[index % GRADIENTS.length],
  }));
}

export async function getInstagramPosts() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return { items: fromStatic(), live: false };

  try {
    const firstPage = new URL("https://graph.instagram.com/me/media");
    firstPage.searchParams.set("fields", FIELDS);
    firstPage.searchParams.set("limit", "25");
    firstPage.searchParams.set("access_token", token);
    let url = firstPage.toString();
    const items = [];
    const visitedPages = new Set();
    while (url) {
      if (visitedPages.has(url)) {
        throw new Error("Instagram API pagination returned a repeated page");
      }
      visitedPages.add(url);

      const res = await fetch(url, { next: { revalidate: 3600 } }); // refresh hourly
      if (!res.ok) {
        const responseText = await res.text();
        let apiError;
        try {
          apiError = JSON.parse(responseText).error;
        } catch {
          apiError = null;
        }
        const details = apiError
          ? [
              apiError.message,
              apiError.type,
              apiError.code,
              apiError.error_subcode,
            ]
              .filter(
                (value) =>
                  value !== undefined && value !== null && value !== "",
              )
              .join(" | ")
          : "";
        throw new Error(
          `Instagram API responded ${res.status}${details ? `: ${details}` : ""}`,
        );
      }
      const json = await res.json();
      for (const post of json.data || []) {
        items.push(...fromApi(post, items.length));
      }
      url = json.paging?.next;
    }
    return { items, live: true };
  } catch (error) {
    console.error("Instagram feed error:", error.message); // never log the token
    return { items: fromStatic(), live: false };
  }
}
