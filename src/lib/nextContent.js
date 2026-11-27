import { readFile } from "node:fs/promises";
import { cache } from "react";
import { join } from "node:path";
import { parse } from "yaml";

const contentApiUrl = process.env.NEXT_PUBLIC_CMS_API_URL?.replace(/\/+$/, "");
async function getSectionFromMarkdown(sectionId) {
  const markdown = await readFile(
    join(process.cwd(), "src", "content", "sections", `${sectionId}.md`),
    "utf8",
  );
  const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatter) {
    throw new Error(
      `The ${sectionId} Markdown file is missing YAML frontmatter.`,
    );
  }

  const data = parse(frontmatter[1]);
  const isValidItem = (item) =>
    sectionId === "faq"
      ? typeof item?.question === "string" && typeof item?.answer === "string"
      : typeof item?.title === "string" &&
        Array.isArray(item?.images) &&
        item.images.every((image) => typeof image === "string");
  if (
    !data ||
    typeof data !== "object" ||
    typeof data.enable !== "boolean" ||
    typeof data.title !== "string" ||
    (sectionId === "faq" && typeof data.description !== "string") ||
    !Array.isArray(data.items) ||
    data.items.some((item) => !item || !isValidItem(item))
  ) {
    throw new Error(
      `The ${sectionId} Markdown file contains invalid section data.`,
    );
  }

  return { id: sectionId, data, body: "" };
}

function formatBody(body = "") {
  return body
    .replace(/<Button\b([^>]*)\/>/g, (_, attributes) => {
      const label = attributes.match(/\blabel="([^"]*)"/)?.[1] ?? "Button";
      const link = attributes.match(/\blink="([^"]*)"/)?.[1] ?? "#";
      return `**[${label}](${link})**`;
    })
    .replace(/<Notice\b[^>]*>([\s\S]*?)<\/Notice>/g, "\n> $1\n")
    .replace(/<Tabs\b[^>]*>|<\/Tabs>/g, "")
    .replace(/<Tab\s+name="([^"]+)"[^>]*>/g, "\n### $1\n")
    .replace(/<\/Tab>/g, "")
    .replace(/<Accordion\b[^>]*title="([^"]+)"[^>]*>/g, "\n#### $1\n")
    .replace(/<\/Accordion>/g, "")
    .replace(/<Video\b[^>]*src="([^"]+)"[^>]*\/>/g, "\n[Watch video]($1)\n");
}

function contentFromEntry(entry) {
  if (
    !entry ||
    typeof entry.slug !== "string" ||
    !entry.data ||
    typeof entry.data !== "object" ||
    Array.isArray(entry.data) ||
    typeof entry.body !== "string"
  ) {
    throw new Error("CMS returned an invalid content entry.");
  }

  return {
    id: entry.slug,
    data: entry.data,
    body: formatBody(entry.body),
  };
}

async function readLocalMarkdownEntry(collection, slug) {
  const filePath = join(
    process.cwd(),
    "src",
    "content",
    collection,
    `${slug}.md`,
  );
  const markdown = await readFile(filePath, "utf8");
  const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

  if (!frontmatter) {
    const fallback = {
      title: slug,
      description: "",
      draft: false,
    };
    return {
      id: slug,
      data: fallback,
      body: markdown.trim(),
    };
  }

  const data = parse(frontmatter[1]) ?? {};
  const body = markdown.slice(frontmatter[0].length).trim();
  return { id: slug, data, body };
}

async function listLocalMarkdownEntries(collection) {
  const dirPath = join(process.cwd(), "src", "content", collection);
  const entries = await import("node:fs/promises").then(({ readdir }) =>
    readdir(dirPath),
  );
  return entries
    .filter((file) => file.endsWith(".md") && file !== "-index.md")
    .map((file) => file.replace(/\.md$/, ""));
}

async function requestContent(collection, slug) {
  if (!contentApiUrl) {
    if (slug !== undefined) {
      try {
        const entry = await readLocalMarkdownEntry(collection, slug);
        return { managed: false, entry };
      } catch {
        return { managed: false, entry: null, entries: [] };
      }
    }

    const entries = await listLocalMarkdownEntries(collection).catch(() => []);
    return {
      managed: false,
      entry: null,
      entries: entries.map((id) => ({ slug: id, data: {}, body: "" })),
    };
  }

  try {
    const url = new URL(`${contentApiUrl}/content`);
    url.searchParams.set("collection", collection);
    if (slug !== undefined) url.searchParams.set("slug", slug);

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`CMS API returned ${response.status}`);
    return response.json();
  } catch (error) {
    if (slug !== undefined) {
      try {
        const entry = await readLocalMarkdownEntry(collection, slug);
        return { managed: false, entry };
      } catch {
        return { managed: false, entry: null, entries: [] };
      }
    }

    const entries = await listLocalMarkdownEntries(collection).catch(() => []);
    return {
      managed: false,
      entry: null,
      entries: entries.map((id) => ({ slug: id, data: {}, body: "" })),
    };
  }
}

export const getContent = cache(async function getContent(collection, id) {
  if (collection === "sections" && (id === "faq" || id === "comparison-row")) {
    return getSectionFromMarkdown(id);
  }

  const payload = await requestContent(collection, id);
  if (typeof payload?.managed !== "boolean" || !("entry" in payload)) {
    throw new Error("CMS returned an invalid content response.");
  }
  if (!payload.entry) {
    const error = new Error(
      `Content not found in the database: ${collection}/${id}`,
    );
    error.code = "ENOENT";
    throw error;
  }

  return contentFromEntry(payload.entry);
});

export async function getContentCollection(collection) {
  const payload = await requestContent(collection);
  if (
    typeof payload?.managed !== "boolean" ||
    !Array.isArray(payload.entries)
  ) {
    throw new Error("CMS returned an invalid content collection.");
  }

  if (payload.managed === false && payload.entries.length > 0) {
    const localEntries = await Promise.all(
      payload.entries.map(async ({ slug }) =>
        readLocalMarkdownEntry(collection, slug),
      ),
    );
    return localEntries.filter((document) => !document.data.draft);
  }

  return payload.entries
    .map(contentFromEntry)
    .filter((document) => !document.data.draft);
}
