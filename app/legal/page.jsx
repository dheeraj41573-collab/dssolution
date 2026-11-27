import Link from "next/link";
import LegalDirectory from "./LegalDirectory";
import { getPageSections } from "@/lib/pageSections";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata() {
  return getPageMetadata("/legal", {
    title: "Legal Support for Businesses",
    description:
      "Explore business legal support across intellectual property, business setup, contracts, compliance and advisory.",
  });
}

export default async function LegalPage() {
  const sections = await getPageSections("legal");
  const directorySection = sections.find(
    (section) => section.sectionKey === "directory",
  );
  if (
    !Array.isArray(directorySection?.data?.categories) ||
    !Array.isArray(directorySection?.data?.topics) ||
    !Array.isArray(directorySection?.data?.services) ||
    !Array.isArray(directorySection?.data?.policies)
  ) {
    throw new Error("The legal directory section is missing from the CMS.");
  }
  const policies = directorySection.data.policies.filter(
    (policy) => policy.href !== "/term-and-condition",
  );

  return (
    <main className="legal-page">
      <LegalDirectory
        categories={directorySection.data.categories}
        topics={directorySection.data.topics}
        services={directorySection.data.services}
      />
      <section className="legal-policy-section section">
        <div className="container">
          <div className="legal-policy-heading">
            <div>
              <span className="legal-section-kicker">SITE POLICIES</span>
              <h2>Our policies, in one place.</h2>
              <p>
                Read the terms and policies that apply when you use our website
                and services.
              </p>
            </div>
            <Link href="/contact">
              Questions? Contact us <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="legal-policy-grid">
            {policies.map((policy) => (
              <article className="legal-policy-card" key={policy.href}>
                <span aria-hidden="true">{policy.icon}</span>
                <h3>{policy.title}</h3>
                <p>{policy.description}</p>
                <Link href={policy.href}>
                  Read policy <i aria-hidden="true">→</i>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="legal-contact-wrap container" id="legal-contact">
        <div className="legal-contact-banner">
          <div>
            <span>LET&apos;S TALK THROUGH YOUR NEXT STEP</span>
            <h2>Have a legal question for your business?</h2>
            <p>
              Tell us what you&apos;re working through. We&apos;ll help direct
              you to the right conversation.
            </p>
          </div>
          <Link href="/contact" className="legal-contact-button">
            Contact our team <span aria-hidden="true">↗</span>
          </Link>
          <div className="legal-contact-mark" aria-hidden="true">
            §
          </div>
        </div>
      </section>
    </main>
  );
}
