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

export async function GET(_request, { params }) {
  const { id } = await params;
  const chunkNumber = Number.parseInt(id, 10);
  if (!Number.isInteger(chunkNumber) || chunkNumber < 1)
    return new Response("Not found", { status: 404 });

  const { siteUrl, urls } = await getSeoSitemap();
  const offset = (chunkNumber - 1) * MAX_URLS;
  if (offset >= urls.length) return new Response("Not found", { status: 404 });
  const body = urls
    .slice(offset, offset + MAX_URLS)
    .map((entry) => {
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
    })
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control":
          "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
