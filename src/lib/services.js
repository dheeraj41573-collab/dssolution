import { cache } from "react";

function getServiceList(payload) {
  return Array.isArray(payload?.items) ? payload.items : null;
}

export const getServices = cache(async function getServices() {
  const apiUrl = process.env.NEXT_PUBLIC_CMS_API_URL?.replace(/\/+$/, "");
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_CMS_API_URL is required to load services.");
  }

  const response = await fetch(`${apiUrl}/services`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`Services API returned ${response.status}`);
  const services = getServiceList(await response.json());
  if (
    !services ||
    services.some((service) => !service?.slug || !service?.title)
  ) {
    throw new Error(
      "Services API response must contain items with slug and title.",
    );
  }
  return services;
});
