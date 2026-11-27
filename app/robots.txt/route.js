import { getSeoSettings } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSeoSettings();
  const siteUrl = settings.siteUrl;
  if (!siteUrl)
    throw new Error("Configure siteUrl before generating robots.txt.");
  const extraRules = (settings.robotsExtraRules || "").trim();
  const lines = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /api",
    ...(extraRules ? extraRules.split(/\r?\n/) : []),
    `Sitemap: ${new URL("/sitemap.xml", `${siteUrl}/`).toString()}`,
  ];
  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
