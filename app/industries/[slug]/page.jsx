import Link from "next/link";
import { notFound } from "next/navigation";
import { getIndustries } from "@/lib/industriesApi";
import { getServices } from "@/lib/services";
import { getSiteSettings } from "@/lib/siteSettings";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateStaticParams() {
  return (await getIndustries()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const industry = (await getIndustries()).find((item) => item.slug === slug);
  if (!industry) return {};
  return getPageMetadata(`/industries/${slug}`, {
    title: `Digital Marketing for ${industry.title}`,
    description: industry.summary,
  });
}

export default async function IndustryDetailPage({ params }) {
  const { slug } = await params;
  const [industries, services, { config }] = await Promise.all([
    getIndustries(),
    getServices(),
    getSiteSettings(),
  ]);
  const industry = industries.find((item) => item.slug === slug);
  if (!industry) notFound();

  const featuredServices = services.slice(0, 6);
  const phone =
    config.params.footer_phone_secondary || config.params.footer_phone;
  const phoneDigits = phone.replace(/\D/g, "");
  const message = encodeURIComponent(
    `Hi, I run a ${industry.title.toLowerCase()} business and would like to discuss a growth plan.`,
  );
  const opportunityCards = [
    { title: "Industry challenge", content: industry.challenge },
    ...industry.channels.map((channel, index) => ({
      title: `Growth focus 0${index + 1}`,
      content: channel,
    })),
  ];

  return (
    <main className="industry-detail-page industry-reference-page">
      <div className="container">
        <nav className="industry-detail-breadcrumb" aria-label="Breadcrumb">
          <Link href="/industries">Industries</Link>
          <span aria-hidden="true">›</span>
          <strong aria-current="page">{industry.title} Hub</strong>
        </nav>
        <section className="industry-reference-hero">
          <span className="industry-reference-icon" aria-hidden="true">
            {industry.icon}
          </span>
          <div className="industry-reference-hero-copy">
            <div className="industry-reference-badges">
              <span>{industry.category}</span>
              <span>Industry-specific strategy</span>
              <span>Growth focused</span>
            </div>
            <h1>Digital Marketing for {industry.title}</h1>
            <p>{industry.summary}</p>
            <a
              className="industry-reference-whatsapp"
              href={`https://wa.me/${phoneDigits}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Discuss a growth plan on WhatsApp{" "}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="industry-reference-overview">
          <h2>Industry Overview — {industry.title}</h2>
          <p>
            {industry.challenge} {industry.summary}
          </p>
        </section>

        <section className="industry-reference-insights">
          <h2>Growth opportunities for {industry.title}</h2>
          <div className="industry-reference-insight-grid">
            {opportunityCards.map((card, index) => (
              <article key={card.title}>
                <span>0{index + 1}</span>
                <h3>{card.title}</h3>
                <p>{card.content}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="industry-reference-services">
          <div className="industry-reference-section-heading">
            <span>OUR SERVICES</span>
            <h2>Tailored Growth Engines for {industry.title}</h2>
            <p>
              Build a practical plan around the channels and services that fit
              your business.
            </p>
          </div>
          <div className="industry-reference-service-grid">
            {featuredServices.map((service) => (
              <Link
                className="industry-reference-service-card"
                href={`/services/${service.slug}`}
                key={service.slug}
              >
                <span
                  className="industry-reference-service-icon"
                  aria-hidden="true"
                >
                  {service.icon}
                </span>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <span className="industry-reference-service-link">
                  Explore service <span aria-hidden="true">↗</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <a
          className="industry-reference-bottom-cta"
          href={`https://wa.me/${phoneDigits}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Request a Digital Marketing Proposal for {industry.title} on WhatsApp
          <span aria-hidden="true">↗</span>
        </a>
        <div className="industry-reference-more">
          <Link href="/industries">← Explore all industries</Link>
          <Link href="/services">View all services →</Link>
        </div>
      </div>
    </main>
  );
}
