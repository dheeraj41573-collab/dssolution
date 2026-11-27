import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/Content";
import { getServices } from "@/lib/services";
import {
  findLocation,
  getLocations,
  getSiteSettings,
} from "@/lib/siteSettings";
import { getPageMetadata } from "@/lib/pageMetadata";

export const dynamicParams = false;

export async function generateStaticParams() {
  const { locations } = await getSiteSettings();
  const { domestic, international } = getLocations(locations);
  const allLocations = [...domestic, ...international];
  return allLocations.map(({ slug }) => ({ location: slug }));
}

export async function generateMetadata({ params }) {
  const { location } = await params;
  const { locations } = await getSiteSettings();
  const place = findLocation(locations, location);
  if (!place) return {};
  return getPageMetadata(`/digital-marketing/${location}`, {
    title: `Digital Marketing Agency in ${place.name}`,
    description: `SEO, Google Ads, Meta Ads, social media, web design and graphic design services for businesses in ${place.name}.`,
  });
}

export default async function LocationPage({ params }) {
  const { location } = await params;
  const [{ locations }, services] = await Promise.all([
    getSiteSettings(),
    getServices(),
  ]);
  const place = findLocation(locations, location);
  if (!place) notFound();

  return (
    <>
      <PageHeader
        title={`Digital marketing services in ${place.name}`}
        subtitle={`Performance marketing, SEO, websites and creative design for businesses in ${place.name} — with zero lock-in contracts.`}
      />
      <section className="section pt-0">
        <div className="container">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <article
                className="border-border bg-light rounded-2xl border p-6"
                key={service.slug}
              >
                <h2 className="text-h5 mb-3">{service.title}</h2>
                <p className="mb-5">{service.summary}</p>
                <Link
                  className="link font-semibold"
                  href={`/services/${service.slug}`}
                >
                  Learn more
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link className="btn btn-primary" href="/contact">
              Get a free quote for {place.name}
            </Link>
            <Link className="btn btn-outline-primary" href="/locations">
              All locations
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
