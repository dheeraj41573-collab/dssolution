import { getSeoSitemap } from "@/lib/seo";

export const dynamic = "force-dynamic";
const MAX_URLS = 50000;

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sitemapEntry(siteUrl, entry) {
  const loc = new URL(entry.path, `${siteUrl}/`).toString();
  const lastmod = entry.lastmod ? new Date(entry.lastmod) : null;
  if (lastmod && Number.isNaN(lastmod.getTime()))
    throw new Error(`Invalid sitemap lastmod for ${entry.path}.`);
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    ...(lastmod ? [`    <lastmod>${lastmod.toISOString()}</lastmod>`] : []),
    `    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`,
    `    <priority>${Number(entry.priority).toFixed(1)}</priority>`,
    "  </url>",
  ].join("\n");
}

function xmlResponse(xml) {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

export async function GET() {
  const { siteUrl, urls } = await getSeoSitemap();
  if (urls.length <= MAX_URLS) {
    const body = urls.map((entry) => sitemapEntry(siteUrl, entry)).join("\n");
    return xmlResponse(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`,
    );
  }

  const count = Math.ceil(urls.length / MAX_URLS);
  const entries = Array.from({ length: count }, (_, index) => {
    const loc = new URL(`/sitemap/chunk/${index + 1}`, `${siteUrl}/`);
    return `  <sitemap><loc>${escapeXml(loc.toString())}</loc></sitemap>`;
  }).join("\n");
  return xmlResponse(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`,
  );
}
