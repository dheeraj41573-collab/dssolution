import fs from "node:fs/promises";

const pageCatalog = JSON.parse(
  await fs.readFile(new URL("../src/pageCatalog.json", import.meta.url), "utf8"),
);

const routes = [
  ...pageCatalog.map((page) => page.path ?? page.url ?? page.slug),
  "/",
  "/about",
  "/services",
  "/blog",
  "/contact",
  "/pricing",
  "/portfolio",
  "/industries",
  "/legal",
];

const baseUrl = process.env.BASE_URL || "https://www.thedssolution.com";

function extractImagesWithMissingAlt(html) {
  const matches = [...html.matchAll(/<img\b[^>]*>/gi)];
  const issues = [];

  for (const match of matches) {
    const tag = match[0];
    if (!/\balt\s*=\s*(?:""|'')/i.test(tag) && !/\balt\s*=\s*(?:"[^"]*"|'[^']*')/i.test(tag)) {
      const srcMatch = tag.match(/\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([\S]+))/i);
      issues.push({ src: srcMatch ? srcMatch[1] || srcMatch[2] || srcMatch[3] : "unknown" });
    }

    if (/\balt\s*=\s*(?:""|'')/i.test(tag)) {
      const srcMatch = tag.match(/\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([\S]+))/i);
      issues.push({ src: srcMatch ? srcMatch[1] || srcMatch[2] || srcMatch[3] : "unknown", reason: "empty alt" });
    }
  }

  return issues;
}

async function main() {
  const uniqueRoutes = [...new Set(routes.filter(Boolean))];
  const found = [];

  for (const route of uniqueRoutes) {
    const response = await fetch(`${baseUrl}${route}`);
    if (!response.ok) continue;

    const html = await response.text();
    const issues = extractImagesWithMissingAlt(html);
    if (issues.length) {
      for (const issue of issues) {
        found.push({ route, src: issue.src, reason: issue.reason || "missing alt" });
      }
    }
  }

  if (found.length === 0) {
    console.log("Audit complete: no missing alt images found on the checked routes.");
    return;
  }

  console.table(found);
  console.log(`Total missing/empty alt images: ${found.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
