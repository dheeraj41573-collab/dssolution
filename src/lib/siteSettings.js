import { cache } from "react";
import config from "@/config/config.json";
import menu from "@/config/menu.json";
import social from "@/config/social.json";
import theme from "@/config/theme.json";
import { domesticLocations, internationalLocations } from "@/lib/footerData";

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_URL?.replace(/\/+$/, "");
const localSettings = {
  config,
  theme,
  menu,
  social,
  locations: {
    domestic: domesticLocations.map(({ name }) => name),
    international: internationalLocations.map(({ name }) => name),
  },
};

export const getSiteSettings = cache(async function getSiteSettings() {
  if (!apiUrl) {
    console.warn("CMS URL is not configured; using local site settings.");
    return localSettings;
  }

  try {
    const response = await fetch(`${apiUrl}/site-settings`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok)
      throw new Error(`Site settings API returned ${response.status}`);

    const settings = await response.json();
    if (
      !settings?.config ||
      !settings?.theme ||
      !settings?.menu ||
      !settings?.social ||
      !settings?.locations
    ) {
      throw new Error("CMS returned incomplete site settings.");
    }
    return settings;
  } catch (error) {
    console.warn(
      "Site settings unavailable; using local site settings.",
      error,
    );
    return localSettings;
  }
});

export const getFooterSettings = cache(async function getFooterSettings() {
  if (!apiUrl) {
    console.warn("CMS URL is not configured; using local footer settings.");
    return {};
  }

  try {
    const response = await fetch(`${apiUrl}/footer`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok)
      throw new Error(`Footer settings API returned ${response.status}`);
    const payload = await response.json();
    if (!payload?.footer || typeof payload.footer !== "object") {
      throw new Error("CMS returned invalid footer settings.");
    }
    return payload.footer;
  } catch (error) {
    console.warn("Footer settings unavailable; using local defaults.", error);
    return {};
  }
});

const kebabCase = (value) => value.replace(/_/g, "-");

export function getThemeVariables(theme) {
  const variables = {};
  const colors = theme.colors?.default;
  for (const [section, prefix] of [
    ["theme_color", ""],
    ["text_color", ""],
  ]) {
    for (const [name, value] of Object.entries(colors?.[section] ?? {})) {
      variables[`--color-${prefix}${kebabCase(name)}`] = value;
    }
  }

  const fontFamily = theme.fonts?.font_family ?? {};
  for (const [name, value] of Object.entries(fontFamily)) {
    if (name.endsWith("_type")) continue;
    const family = value.replace(/\+/g, " ").replace(/:[^:]+/g, "");
    variables[`--font-${kebabCase(name)}`] =
      `${family}, ${fontFamily[`${name}_type`] || "sans-serif"}`;
  }
  const baseSize = Number(theme.fonts?.font_size?.base || 16);
  const scale = Number(theme.fonts?.font_size?.scale || 1.25);
  variables["--text-base"] = `${baseSize}px`;
  variables["--text-base-sm"] = `${baseSize * 0.8}px`;
  let headingSize = scale;
  for (let heading = 6; heading >= 1; heading -= 1) {
    variables[`--text-h${heading}`] = `${headingSize}rem`;
    variables[`--text-h${heading}-sm`] = `${headingSize * 0.9}rem`;
    headingSize *= scale;
  }
  return variables;
}

export function getDarkThemeCss(theme) {
  const variables = [];
  const colors = theme.colors?.darkmode;
  for (const section of ["theme_color", "text_color"]) {
    for (const [name, value] of Object.entries(colors?.[section] ?? {})) {
      if (!/^#[\da-f]{3,8}$/i.test(value)) {
        throw new Error(`Invalid theme color for "${name}".`);
      }
      variables.push(`--color-${kebabCase(name)}:${value}`);
    }
  }
  return `.dark{${variables.join(";")}}`;
}

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function getLocations(locations) {
  const toLocations = (names) =>
    names.map((name) => ({ name, slug: slugify(name) }));

  return {
    domestic: toLocations(locations.domestic),
    international: toLocations(locations.international),
  };
}

export function findLocation(locations, slug) {
  const { domestic, international } = getLocations(locations);
  return [...domestic, ...international].find(
    (location) => location.slug === slug,
  );
}
