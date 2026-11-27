import { cache } from "react";
import { getContent, getContentCollection } from "@/lib/nextContent";

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_URL?.replace(/\/+$/, "");

function toPost(item, { includeContent = false } = {}) {
  if (
    !item ||
    typeof item.slug !== "string" ||
    typeof item.title !== "string" ||
    (includeContent && typeof item.content !== "string")
  ) {
    throw new Error("Blog API returned an invalid post.");
  }

  const data = item.data && typeof item.data === "object" ? item.data : {};
  return {
    id: item.slug,
    data: {
      ...data,
      title: item.title,
      description: item.summary || data.description || "",
      image: item.image || data.image || "",
      date: data.date ?? item.createdAt ?? item.updatedAt,
      author: "Admin",
    },
    body: item.content ?? "",
    createdAt: item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
  };
}

async function requestBlog(slug) {
  if (!apiUrl) {
    console.warn("Blog API URL is not configured; using local blog content.");
    return slug
      ? [await getContent("blog", slug)]
      : getContentCollection("blog");
  }

  const url = new URL(`${apiUrl}/blog`);
  if (slug) url.searchParams.set("slug", slug);
  let response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    console.warn("Blog API is unavailable; using local blog content.");
    return slug
      ? [await getContent("blog", slug)]
      : getContentCollection("blog");
  }
  if (!response.ok) throw new Error(`Blog API returned ${response.status}`);
  const payload = await response.json();
  if (!Array.isArray(payload?.items)) {
    throw new Error("Blog API returned an invalid posts collection.");
  }
  return payload.items.map((item) =>
    toPost(item, { includeContent: Boolean(slug) }),
  );
}

export const getBlogPosts = cache(async function getBlogPosts() {
  return requestBlog();
});

export const getBlogPost = cache(async function getBlogPost(slug) {
  const posts = await requestBlog(slug);
  const post = posts.find((entry) => entry.id === slug);
  if (!post) {
    const error = new Error(`Blog post not found: ${slug}`);
    error.code = "ENOENT";
    throw error;
  }
  return post;
});
