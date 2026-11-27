import Link from "next/link";
import { PageHeader } from "@/components/Content";
import { getLocations, getSiteSettings } from "@/lib/siteSettings";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata() {
  return getPageMetadata("/locations", {
    title: "Service Locations",
    description:
      "Domestic and international locations where DS Solution delivers digital marketing, SEO, web development and design services.",
  });
}

const pill =
  "border-border bg-light text-text hover:border-primary hover:bg-primary inline-block rounded-full border px-4 py-1.5 text-sm transition-colors hover:text-on-accent";

export default async function LocationsPage() {
  const { locations } = await getSiteSettings();
  const { domestic, international } = getLocations(locations);
  return (
    <>
      <PageHeader
        title="Locations we serve"
        subtitle="Our services are available across India and internationally."
      />
      <section className="section pt-0">
        <div className="container space-y-12">
          <div>
            <h2 className="text-h4 mb-5">Domestic Locations</h2>
            <div className="flex flex-wrap gap-2">
              {domestic.map((l) => (
                <Link
                  key={l.slug}
                  href={`/digital-marketing/${l.slug}`}
                  className={pill}
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-h4 mb-5">International Locations</h2>
            <div className="flex flex-wrap gap-2">
              {international.map((l) => (
                <Link
                  key={l.slug}
                  href={`/digital-marketing/${l.slug}`}
                  className={pill}
                >
                  🌐 {l.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
