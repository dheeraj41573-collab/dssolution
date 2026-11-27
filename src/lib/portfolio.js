import { cache } from "react";
import { adsCampaigns } from "./adsCampaigns";

export const getPortfolioProjects = cache(
  async function getPortfolioProjects() {
    const apiUrl = process.env.NEXT_PUBLIC_CMS_API_URL?.replace(/\/+$/, "");
    if (!apiUrl) {
      console.warn(
        "CMS URL is not configured; portfolio showcase is disabled.",
      );
      return [];
    }

    try {
      const response = await fetch(`${apiUrl}/portfolio`, {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok)
        throw new Error(`Portfolio API returned ${response.status}`);
      const payload = await response.json();
      if (
        !Array.isArray(payload?.items) ||
        payload.items.some(
          (item) =>
            typeof item.slug !== "string" ||
            typeof item.title !== "string" ||
            typeof item.image !== "string",
        )
      ) {
        throw new Error(
          "Portfolio API returned an invalid projects collection.",
        );
      }
      return payload.items;
    } catch (error) {
      console.warn(
        "Portfolio unavailable; disabling campaign showcase.",
        error,
      );
      return [];
    }
  },
);

export async function getPortfolioShowcase(maxRows) {
  const projects = await getPortfolioProjects();
  const rowSize = 8;
  const visibleProjects = Number.isInteger(maxRows)
    ? projects.slice(0, Math.max(0, maxRows) * rowSize)
    : projects;
  return {
    enable: true,
    title: "Live Campaign Showcase",
    description:
      "Explore campaign artwork and creative concepts from the portfolio.",
    rows: Array.from(
      { length: Math.ceil(visibleProjects.length / rowSize) },
      (_, index) =>
        visibleProjects
          .slice(index * rowSize, index * rowSize + rowSize)
          .map((project) => ({
            id: project.slug,
            image: project.image,
            industry: project.title,
            title: project.summary,
          })),
    ),
  };
}

export function getAdsCampaignShowcase(maxRows) {
  const rowSize = 8;
  const visibleCampaigns = Number.isInteger(maxRows)
    ? adsCampaigns.slice(0, Math.max(0, maxRows) * rowSize)
    : adsCampaigns;

  return {
    enable: true,
    title: "Live Campaign Showcase",
    description:
      "Explore campaign artwork and creative concepts from the portfolio.",
    rows: Array.from(
      { length: Math.ceil(visibleCampaigns.length / rowSize) },
      (_, index) =>
        visibleCampaigns
          .slice(index * rowSize, index * rowSize + rowSize)
          .map((campaign) => ({
            id: campaign.id,
            image: campaign.image,
            industry: campaign.name,
            title: campaign.summary,
          })),
    ),
  };
}
