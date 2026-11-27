import Link from "next/link";
import { PageHeader } from "@/components/Content";
import { getServices } from "@/lib/services";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata() {
  return getPageMetadata("/digital-marketing", {
    title: "Digital Marketing",
    description:
      "Connected digital marketing services to help businesses reach their audiences and measure progress.",
  });
}

export default async function DigitalMarketingPage() {
  const services = await getServices();
  const marketingServices = services.filter((service) =>
    [
      "seo",
      "social-media-marketing",
      "google-ads",
      "meta-ads",
      "email-marketing",
      "local-seo",
      "b2b-lead-generation",
    ].includes(service.slug),
  );

  return (
    <>
      <PageHeader
        title="Digital marketing, connected to your goals"
        subtitle="Bring the right channels together around your audience, offer and business priorities."
      />
      <section className="section pt-0">
        <div className="container">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {marketingServices.map((service) => (
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
          <div className="mt-10 text-center">
            <Link className="btn btn-primary" href="/contact">
              Plan your marketing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
