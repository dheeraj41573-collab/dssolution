import { cache } from "react";

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_URL?.replace(/\/+$/, "");

export const getPageSections = cache(async function getPageSections(page) {
  if (!apiUrl) {
    throw new Error(
      "NEXT_PUBLIC_CMS_API_URL is required to load page sections.",
    );
  }

  const response = await fetch(
    `${apiUrl}/page-sections/${encodeURIComponent(page)}`,
    {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(30000),
    },
  );
  if (!response.ok)
    throw new Error(`Page sections API returned ${response.status}`);
  const payload = await response.json();
  if (!Array.isArray(payload?.sections)) {
    throw new Error("Page sections API returned an invalid response.");
  }
  return payload.sections;
});
