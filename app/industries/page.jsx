import Link from "next/link";
import IndustriesDirectory from "./IndustriesDirectory";
import HeroBackdrop from "@/components/HeroBackdrop";
import { getIndustries } from "@/lib/industriesApi";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata() {
  return getPageMetadata("/industries", {
    title: "Industries We Serve",
    description:
      "Explore tailored digital growth plans for 89 industries, with searchable sectors and industry-specific playbooks.",
  });
}

export default async function IndustriesPage() {
  const industries = await getIndustries();
  const industryCategories = [
    ...new Set(industries.map(({ category }) => category).filter(Boolean)),
  ];
  return (
    <main className="industries-page">
      <section className="industries-hero">
        <HeroBackdrop />
        <div className="industries-hero-inner container">
          <div className="industries-hero-copy">
            <span className="industries-kicker">
              <i aria-hidden="true" /> INDUSTRY-SPECIFIC GROWTH
            </span>
            <h1>
              89 industries.
              <br />
              <em>One plan that fits.</em>
            </h1>
            <p>
              Every sector has a different customer journey. Explore tailored
              digital growth ideas built around the way your industry works.
            </p>
            <a className="industries-hero-link" href="#industry-directory">
              Find your industry <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="industries-hero-visual" aria-hidden="true">
            <div className="industries-orbit orbit-one" />
            <div className="industries-orbit orbit-two" />
            <div className="industries-orbit-core">
              <span>89</span>
              <small>INDUSTRIES</small>
            </div>
            <span className="industry-float float-one">🏥</span>
            <span className="industry-float float-two">🏫</span>
            <span className="industry-float float-three">🏗️</span>
            <span className="industry-float float-four">☁️</span>
          </div>
        </div>
        <div className="industries-proof-row container">
          <span>
            <b>{industries.length}</b> industry pages
          </span>
          <i />
          <span>
            <b>{industryCategories.length}</b> sectors
          </span>
          <i />
          <span>Searchable directory</span>
        </div>
      </section>

      <section className="industries-directory-section" id="industry-directory">
        <div className="container">
          <div className="industries-section-heading">
            <div>
              <span className="industries-kicker">
                <i aria-hidden="true" /> EXPLORE THE DIRECTORY
              </span>
              <h2>Find your industry</h2>
              <p>
                Search all sectors or filter by category. Open any card for its
                tailored growth playbook.
              </p>
            </div>
            <Link href="/contact" className="industries-help-link">
              Need help choosing? <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <IndustriesDirectory
            industries={industries}
            categories={industryCategories}
          />
        </div>
      </section>

      <section className="industries-contact container">
        <div>
          <span>YOUR BUSINESS, YOUR NEXT CHAPTER</span>
          <h2>Can&apos;t find the perfect fit?</h2>
          <p>
            Tell us about your business. We&apos;ll shape the right approach
            together.
          </p>
        </div>
        <Link className="btn btn-primary" href="/contact">
          Talk to our team <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
