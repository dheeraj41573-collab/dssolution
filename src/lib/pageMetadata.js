import { cache } from "react";
import { getPageSeo, getSeoSettings } from "./seo.js";
const pathAliases = {
  "/about": ["/about-us"],
  "/blog": ["/blogs"],
  "/contact": ["/contact-us"],
};

export const getPageMetadata = cache(
  async function getPageMetadata(path, fallback) {
    let page = null;
    try {
      for (const candidatePath of [path, ...(pathAliases[path] ?? [])]) {
        const candidate = await getPageSeo(candidatePath);
        if (!page && candidate) page = candidate;
        if (
          candidate &&
          [
            candidate.metaTitle,
            candidate.metaDescription,
            candidate.keywords,
            candidate.canonicalUrl,
            candidate.ogTitle,
            candidate.ogDescription,
            candidate.ogImage,
          ].some((value) => typeof value === "string" && value.trim())
        ) {
          page = candidate;
          break;
        }
      }
    } catch (error) {
      console.error(`Could not load admin SEO metadata for ${path}.`, error);
      return fallback;
    }
    const customTitle = page?.metaTitle?.trim();
    const title = customTitle || fallback.title;
    const description = page?.metaDescription?.trim() || fallback.description;
    const ogTitle = page?.ogTitle?.trim() || title;
    const ogDescription = page?.ogDescription?.trim() || description;
    const settings = await getSeoSettings().catch((error) => {
      console.error("Could not load SEO site settings for metadata.", error);
      return {};
    });
    const ogImage =
      page?.ogImage?.trim() ||
      settings.defaultOgImage ||
      fallback.openGraph?.images?.[0];
    const siteUrl = settings.siteUrl || fallback.metadataBase?.toString();
    const canonical =
      page?.canonicalUrl?.trim() ||
      (siteUrl
        ? new URL(path, `${siteUrl.replace(/\/+$/, "")}/`).toString()
        : "");

    return {
      ...fallback,
      ...(customTitle ? { title: { absolute: customTitle } } : {}),
      ...(description ? { description } : {}),
      ...(canonical
        ? {
            alternates: {
              ...fallback.alternates,
              canonical,
            },
          }
        : {}),
      ...(ogTitle || ogDescription
        ? {
            openGraph: {
              ...fallback.openGraph,
              ...(ogTitle ? { title: ogTitle } : {}),
              ...(ogDescription ? { description: ogDescription } : {}),
              ...(ogImage ? { images: [ogImage] } : {}),
            },
            twitter: {
              ...fallback.twitter,
              ...(ogTitle ? { title: ogTitle } : {}),
              ...(ogDescription ? { description: ogDescription } : {}),
              ...(ogImage ? { images: [ogImage] } : {}),
            },
          }
        : {}),
      ...(page?.noindex
        ? {
            robots: {
              index: false,
              follow: false,
              googleBot: { index: false, follow: false },
            },
          }
        : {}),
    };
  },
);
