import { getPageMetadata } from "@/lib/pageMetadata";
import PortfolioGallery from "./PortfolioGallery";

export async function generateMetadata() {
  return getPageMetadata("/portfolio", {
    title: "Portfolio Gallery",
    description:
      "Explore our portfolio of digital experiences crafted with strategy, creativity, and performance to help brands grow and lead.",
    alternates: { canonical: "/portfolio" },
  });
}

export default function PortfolioPage() {
  return <PortfolioGallery />;
}
