import Link from "next/link";
import { getServices } from "@/lib/services";
import ServicesDirectory from "./ServicesDirectory";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata() {
  return getPageMetadata("/services", {
    title: "Digital Marketing & Business Services",
    description:
      "Explore digital marketing, design and development services from DS Solution.",
  });
}

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <section className="section-ph relative mb-0 overflow-hidden pb-28">
        <div className="relative container">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="hasHighlight mb-6">
              Digital Marketing &amp; Growth Services
            </h1>
            <p className="text-text-light">
              Explore our marketing, design and technology services. Choose a
              category to find the support that fits your goals.
            </p>
          </div>
          <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
            <canvas
              className="heroSporeCanvas w-full opacity-70"
              width={2000}
              height={2000}
            />
          </div>
        </div>
        <div
          className="absolute top-0 left-1/2 -z-20 size-160 -translate-x-1/2 -translate-y-1/2 blur-2xl xl:size-300"
          style={{
            background:
              "radial-gradient(circle, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 78%, transparent) 20%, transparent 70%)",
          }}
        />
      </section>
      <section className="section pt-0">
        <div className="container">
          <ServicesDirectory services={services} />
          <div className="bg-light border-border mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl border p-8 md:flex-row md:items-center">
            <div>
              <h2 className="text-h4 mb-2">Not sure where to start?</h2>
              <p className="mb-0">
                Tell us what you are working toward and we can discuss a
                suitable next step.
              </p>
            </div>
            <Link className="btn btn-primary shrink-0" href="/contact">
              Talk to our team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
