import { cache } from "react";
import { getSiteSettings } from "./siteSettings.js";
import config from "@/config/config.json";

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_URL?.replace(/\/+$/, "");
const localSeoSettings = {
  siteUrl: config.site.base_url,
  siteName: config.site.title,
  defaultOgImage: config.metadata.meta_image,
  globalSchemaJson: "[]",
};
const emptyScripts = {
  customHeadScripts: "",
  customBodyStartScripts: "",
  customFooterScripts: "",
};
let rendererWarningShown = false;
let rendererUnauthorizedWarningShown = false;
let rendererUnavailableWarningShown = false;
let legacySeoWarningShown = false;

async function getJson(url, options, label) {
  if (!apiUrl) throw new Error("NEXT_PUBLIC_CMS_API_URL is required for SEO.");
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${label} returned ${response.status}.`);
  return response.json();
}

export const getSeoSettings = cache(async function getSeoSettings() {
  if (!apiUrl) {
    console.warn("CMS URL is not configured; using local SEO settings.");
    return localSeoSettings;
  }

  try {
    const response = await fetch(`${apiUrl}/seo/settings`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300, tags: ["seo-settings"] },
      signal: AbortSignal.timeout(5000),
    });
    if (response.status === 404) {
      if (!legacySeoWarningShown) {
        console.warn(
          "SEO settings API returned 404; using legacy CMS defaults until the updated API is deployed.",
        );
        legacySeoWarningShown = true;
      }
      const { config: siteConfig } = await getSiteSettings();
      return {
        ...localSeoSettings,
        siteUrl: siteConfig.site.base_url,
        siteName: siteConfig.site.name || config.site.title,
        defaultOgImage:
          siteConfig.metadata.meta_image || config.metadata.meta_image,
      };
    }
    if (!response.ok)
      throw new Error(`SEO settings API returned ${response.status}.`);
    const payload = await response.json();
    if (!payload || typeof payload !== "object" || Array.isArray(payload))
      throw new Error("SEO settings API returned an invalid response.");
    return payload;
  } catch (error) {
    console.warn("SEO settings unavailable; using local defaults.", error);
    return localSeoSettings;
  }
});

export const getPageSeo = cache(async function getPageSeo(path) {
  if (/^\/(?:admin|api|_next|private|internal)(?:\/|$)/i.test(path))
    return null;
  if (!apiUrl) return null;

  try {
    const url = new URL(`${apiUrl}/seo/page`);
    url.searchParams.set("path", path);
    const options = {
      headers: { Accept: "application/json" },
      next: {
        revalidate: 300,
        tags: ["seo-pages", `seo-page:${path}`],
      },
      signal: AbortSignal.timeout(5000),
    };
    let response = await fetch(url, options);
    if (response.status === 404) {
      const legacyUrl = new URL(`${apiUrl}/pages`);
      legacyUrl.searchParams.set("path", path);
      response = await fetch(legacyUrl, options);
      if (!response.ok)
        throw new Error(
          `Legacy page metadata API returned ${response.status}.`,
        );
      const legacy = await response.json();
      if (!legacy?.page) return null;
      return {
        path: legacy.page.path,
        label: legacy.page.label || "",
        metaTitle: legacy.page.title || "",
        metaDescription: legacy.page.description || "",
        canonicalUrl: legacy.page.canonicalUrl || "",
        ogTitle: legacy.page.ogTitle || "",
        ogDescription: legacy.page.ogDescription || "",
        ogImage: "",
        noindex: false,
        includeInSitemap: true,
        schemaJson: "[]",
      };
    }
    if (!response.ok)
      throw new Error(`Page SEO API returned ${response.status}.`);
    const payload = await response.json();
    if (
      !payload ||
      typeof payload !== "object" ||
      !("seo" in payload) ||
      (payload.seo !== null &&
        (typeof payload.seo !== "object" || Array.isArray(payload.seo)))
    ) {
      throw new Error("Page SEO API returned an invalid response.");
    }
    return payload.seo;
  } catch (error) {
    console.warn(
      `Page SEO unavailable for ${path}; using page defaults.`,
      error,
    );
    return null;
  }
});

export const getPageContentOverrides = cache(
  async function getPageContentOverrides(path) {
    if (/^\/(?:admin|api|_next|private|internal)(?:\/|$)/i.test(path))
      return { contentEdits: [], imageAlts: [] };
    if (!apiUrl) return { contentEdits: [], imageAlts: [] };
    try {
      const url = new URL(`${apiUrl}/pages`);
      url.searchParams.set("path", path);
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        next: {
          revalidate: 300,
          tags: ["page-content", `page-content:${path}`],
        },
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok)
        throw new Error(`Page content API returned ${response.status}.`);
      const payload = await response.json();
      if (!payload || !("page" in payload))
        throw new Error("Page content API returned an invalid response.");
      const page = payload.page;
      if (page === null || page?.published === false)
        return { contentEdits: [], imageAlts: [] };
      if (
        !page ||
        typeof page !== "object" ||
        (page.contentEdits !== undefined &&
          !Array.isArray(page.contentEdits)) ||
        (page.imageAlts !== undefined && !Array.isArray(page.imageAlts))
      ) {
        throw new Error("Page content API returned invalid edit data.");
      }
      return {
        contentEdits: page.contentEdits || [],
        imageAlts: page.imageAlts || [],
      };
    } catch (error) {
      console.warn(
        `Page content overrides unavailable for ${path}; using defaults.`,
        error,
      );
      return { contentEdits: [], imageAlts: [] };
    }
  },
);

export const getSeoRenderSettings = cache(
  async function getSeoRenderSettings() {
    const secret = process.env.SEO_RENDERER_SECRET;
    if (!secret || !apiUrl) {
      if (!rendererWarningShown) {
        console.error(
          "SEO renderer configuration is incomplete; custom SEO scripts are disabled.",
        );
        rendererWarningShown = true;
      }
      return emptyScripts;
    }
    try {
      const response = await fetch(`${apiUrl}/internal/seo/render-settings`, {
        headers: {
          Accept: "application/json",
          "x-seo-renderer-secret": secret,
        },
        next: { revalidate: 300, tags: ["seo-settings"] },
        signal: AbortSignal.timeout(5000),
      });
      if (response.status === 401) {
        if (!rendererUnauthorizedWarningShown) {
          console.warn(
            "SEO renderer settings API returned 401; confirm SEO_RENDERER_SECRET matches between the client and CMS API. Custom SEO scripts are disabled.",
          );
          rendererUnauthorizedWarningShown = true;
        }
        return emptyScripts;
      }
      if (response.status === 503) {
        if (!rendererUnavailableWarningShown) {
          console.error(
            "SEO renderer settings API returned 503; custom SEO scripts are disabled.",
          );
          rendererUnavailableWarningShown = true;
        }
        return emptyScripts;
      }
      if (!response.ok)
        throw new Error(
          `SEO renderer settings API returned ${response.status}.`,
        );
      const payload = await response.json();
      if (!payload || typeof payload !== "object" || Array.isArray(payload))
        throw new Error(
          "SEO renderer settings API returned an invalid response.",
        );
      return {
        customHeadScripts: payload.customHeadScripts || "",
        customBodyStartScripts: payload.customBodyStartScripts || "",
        customFooterScripts: payload.customFooterScripts || "",
      };
    } catch (error) {
      console.error(
        "SEO renderer settings unavailable; custom scripts are disabled.",
        error,
      );
      return emptyScripts;
    }
  },
);

export const getSeoSitemap = cache(async function getSeoSitemap() {
  const payload = await getJson(
    `${apiUrl}/seo/sitemap`,
    {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600, tags: ["seo-sitemap"] },
      signal: AbortSignal.timeout(30000),
    },
    "SEO sitemap API",
  );
  if (
    !payload ||
    typeof payload.siteUrl !== "string" ||
    !Array.isArray(payload.urls)
  ) {
    throw new Error("SEO sitemap API returned an invalid response.");
  }
  return payload;
});

export function parseSchemaJson(value) {
  if (!value) return [];
  let parsed;
  try {
    parsed = typeof value === "string" ? JSON.parse(value) : value;
  } catch (error) {
    throw new Error("SEO API returned invalid JSON-LD.", { cause: error });
  }
  const schemas = Array.isArray(parsed) ? parsed : [parsed];
  if (
    !schemas.every(
      (schema) =>
        schema &&
        typeof schema === "object" &&
        !Array.isArray(schema) &&
        schema["@context"] &&
        schema["@type"],
    )
  ) {
    throw new Error("SEO API returned JSON-LD without @context and @type.");
  }
  return schemas;
}
