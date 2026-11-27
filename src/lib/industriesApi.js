import { cache } from "react";

export const getIndustries = cache(async function getIndustries() {
  const apiUrl = process.env.NEXT_PUBLIC_CMS_API_URL?.replace(/\/+$/, "");
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_CMS_API_URL is required to load industries.");
  }

  const response = await fetch(`${apiUrl}/industries`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok)
    throw new Error(`Industries API returned ${response.status}`);
  const payload = await response.json();
  if (
    !Array.isArray(payload?.items) ||
    payload.items.some((industry) => !industry?.slug || !industry?.title)
  ) {
    throw new Error(
      "Industries API response must contain items with slug and title.",
    );
  }
  return payload.items;
});
