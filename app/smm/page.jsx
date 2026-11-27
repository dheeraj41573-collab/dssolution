import Link from "next/link";
import { CampaignShowcase } from "@/components/Sections";
import HeroBackdrop from "@/components/HeroBackdrop";
import { getPageSections } from "@/lib/pageSections";
import { getPortfolioShowcase } from "@/lib/portfolio";
import { getSiteSettings } from "@/lib/siteSettings";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata() {
  return getPageMetadata("/smm", {
    title: "Social Media Marketing",
    description:
      "Social media strategy, creative content, community management and paid campaigns, planned around your business.",
  });
}

export default async function SmmPage() {
  const [{ config }, sections, showcase] = await Promise.all([
    getSiteSettings(),
    getPageSections("smm"),
    getPortfolioShowcase(2),
  ]);
  const plansSection = sections.find(
    (section) => section.sectionKey === "plans",
  );
  const pillarsSection = sections.find(
    (section) => section.sectionKey === "pillars",
  );
  const faqsSection = sections.find((section) => section.sectionKey === "faqs");
  if (!Array.isArray(plansSection?.data?.plans)) {
    throw new Error("The SMM plans section is missing from the CMS.");
  }
  if (
    !Array.isArray(pillarsSection?.data?.pillars) ||
    !Array.isArray(faqsSection?.data?.faqs)
  ) {
    throw new Error("The SMM pillars or FAQs are missing from the CMS.");
  }
  const contentPillars = pillarsSection.data.pillars;
  const faqs = faqsSection.data.faqs;
  const plans = plansSection.data.plans.map((plan) => ({
    name: plan.title,
    description: plan.description,
    features: plan.features
      .filter((feature) => feature.included !== false)
      .map((feature) => feature.label),
    popular: plan.is_featured,
    offerText: plan.offer_text,
  }));
  const phoneDigits = (
    config.params.footer_phone_secondary || config.params.footer_phone
  ).replace(/\D/g, "");
  const message = encodeURIComponent(
    "Hi, I would like to discuss social media marketing for my business.",
  );
  const heroVisuals = [
    {
      image:
        "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80",
      label: "Social media campaign",
      position: "one",
    },
    {
      image:
        "https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&w=800&q=80",
      label: "Social content strategy",
      position: "two",
    },
    {
      image:
        "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80",
      label: "Brand creative",
      position: "three",
    },
  ];

  return (
    <main className="smm-page">
      <section className="smm-hero">
        <HeroBackdrop />
        <div className="smm-hero-inner container">
          <div className="smm-hero-copy">
            <span className="smm-kicker">
              <i aria-hidden="true" /> SOCIAL MEDIA GROWTH
            </span>
            <h1>
              Show up with
              <br />
              <em>something to say.</em>
            </h1>
            <p>
              Build a recognisable social presence with a connected plan for
              content, community and paid campaigns—made to fit your brand and
              your goals.
            </p>
            <div className="smm-hero-actions">
              <a
                href="#smm-plans"
                className="smm-primary-link text-white! transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
              >
                Explore monthly plans <span aria-hidden="true">↓</span>
              </a>
              <a
                href={`https://wa.me/${phoneDigits}?text=${message}`}
                target="_blank"
                rel="noopener noreferrer"
                className="smm-secondary-link hover:text-primary transition-colors duration-300"
              >
                Chat on WhatsApp <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="smm-hero-points">
              <span>
                <b>✓</b> Brand-led creative
              </span>
              <span>
                <b>✓</b> Clear monthly scope
              </span>
              <span>
                <b>✓</b> Useful reporting
              </span>
            </div>
          </div>
          <div
            className="smm-hero-visual"
            aria-label="Social media campaign previews"
          >
            <div className="smm-visual-backdrop" aria-hidden="true" />
            {heroVisuals.map((visual) => (
              <figure
                className={`smm-preview smm-preview-${visual.position}`}
                key={visual.image}
              >
                <img src={visual.image} alt={visual.label} />
                <figcaption>{visual.label}</figcaption>
              </figure>
            ))}
            <div className="smm-calendar-card">
              <span>CONTENT PLAN</span>
              <strong>
                One clear voice.
                <br />
                Every channel.
              </strong>
              <small>
                <i /> Ready to publish
              </small>
            </div>
            <span
              className="smm-social-bubble smm-bubble-one"
              aria-hidden="true"
            >
              ◎
            </span>
            <span
              className="smm-social-bubble smm-bubble-two"
              aria-hidden="true"
            >
              ▶
            </span>
          </div>
          <div className="smm-hero-rail">
            <span>STRATEGY</span>
            <i />
            <span>CONTENT</span>
            <i />
            <span>COMMUNITY</span>
            <i />
            <span>CAMPAIGNS</span>
          </div>
        </div>
      </section>

      <section className="smm-pillars section-sm">
        <div className="smm-pillar-grid container">
          {contentPillars.map((pillar, index) => (
            <article key={pillar.title}>
              <span className="smm-pillar-icon">{pillar.icon}</span>
              <small>0{index + 1} / WHAT WE DO</small>
              <h2>{pillar.title}</h2>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="smm-plans section" id="smm-plans">
        <div className="container">
          <div className="mb-10 max-w-2xl">
            <span className="text-primary mb-4 block text-xs font-bold tracking-[0.18em] uppercase">
              SIMPLE MONTHLY PLANS
            </span>
            <h2 className="text-text-dark mb-4 text-3xl leading-tight font-bold tracking-tight lg:text-5xl">
              {plansSection.data.heading}
            </h2>
            <p className="text-text max-w-xl leading-7">
              {plansSection.data.description}
            </p>
          </div>
          <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => (
              <article
                className={`relative flex min-h-[520px] flex-col rounded-3xl border p-7 transition duration-300 ${
                  plan.popular
                    ? "border-primary ring-primary/20 bg-white shadow-[0_18px_50px_-32px_var(--color-primary)] ring-1 dark:bg-white/5"
                    : "border-border bg-white/70 shadow-[0_12px_35px_-30px_rgba(15,23,42,0.45)] dark:bg-white/5"
                }`}
                key={plan.name}
              >
                {plan.popular && (
                  <span className="bg-primary text-on-accent absolute top-5 right-5 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase">
                    {plan.offerText || "MOST POPULAR"}
                  </span>
                )}
                <h3 className="text-text-dark mb-3 pr-28 text-xl font-bold">
                  {plan.name}
                </h3>
                <p className="text-text mb-8 min-h-[48px] text-sm leading-6">
                  {plan.description}
                </p>
                <Link
                  href={`/contact?plan=${encodeURIComponent(plan.name)}`}
                  className={
                    plan.popular
                      ? "bg-primary text-on-accent mb-8 flex min-h-12 items-center justify-between rounded-xl px-5 text-sm font-bold no-underline transition hover:brightness-110"
                      : "border-border text-text-dark hover:border-primary hover:text-primary mb-8 flex min-h-12 items-center justify-between rounded-xl border px-5 text-sm font-bold no-underline transition"
                  }
                >
                  Choose {plan.name} <span aria-hidden="true">→</span>
                </Link>
                <span className="text-text-dark mb-4 text-xs font-bold tracking-[0.12em] uppercase">
                  IN THIS PLAN
                </span>
                <ul className="mt-0 space-y-3.5">
                  {plan.features.map((feature) => (
                    <li
                      className="text-text flex items-start gap-3 text-sm leading-6"
                      key={feature}
                    >
                      <i
                        className="bg-primary/10 text-primary flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold not-italic"
                        aria-hidden="true"
                      >
                        ✓
                      </i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          {/* <p className="smm-plan-note">
            Plans are starting scopes. Final deliverables depend on your
            requirements. Paid media spend, where applicable, is agreed
            separately.
          </p> */}
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container">
          <h2 className="text-text-dark mb-6 text-xl font-bold lg:text-2xl">
            Compare plans side by side
          </h2>
          <div className="border-border overflow-hidden rounded-3xl border bg-white/70 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.35)] dark:bg-white/5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-center">
                <thead>
                  <tr className="border-border border-b">
                    <th className="w-[44%] px-6 py-5 text-left" />
                    {plans.map((plan) => (
                      <th
                        className="text-text-dark border-border border-l px-5 py-5 text-base font-bold"
                        key={plan.name}
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-text text-sm">
                  {[
                    ["Social platforms", ["2", "3", "4"]],
                    ["Posts each month", ["12", "20", "30"]],
                    ["Edited reels", ["3", "8", "12"]],
                    ["Festival creatives", ["1", "3", "6"]],
                    ["Meta Ads", ["–", "Setup", "Management"]],
                    ["Google Business Profile support", ["–", "–", "✓"]],
                    [
                      "Reporting and calls",
                      [
                        "Monthly report",
                        "Monthly strategy call",
                        "Weekly update",
                      ],
                    ],
                  ].map(([label, values], index) => (
                    <tr
                      className={`border-border ${index === 6 ? "" : "border-b"}`}
                      key={label}
                    >
                      <th className="text-text px-6 py-4 text-left font-normal">
                        {label}
                      </th>
                      {values.map((value, columnIndex) => (
                        <td
                          className={`text-primary border-border border-l px-5 py-4 ${
                            columnIndex === 1 ? "font-semibold" : ""
                          }`}
                          key={`${label}-${columnIndex}`}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <CampaignShowcase
        data={{
          ...showcase,
          title: "Creative in the wild",
          description:
            "A look at the campaign artwork and content concepts featured across our homepage showcase.",
        }}
      />

      <section className="smm-faq section">
        <div className="smm-faq-inner container">
          <div className="smm-section-heading">
            <span className="smm-section-kicker">GOOD TO KNOW</span>
            <h2>Questions before we start?</h2>
            <p>Get a clearer idea of how a social media engagement works.</p>
          </div>
          <div className="smm-faq-list">
            {faqs.map(({ question, answer }) => (
              <details key={question}>
                <summary>
                  {question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="smm-contact-wrap container">
        <div className="smm-contact-banner">
          <div>
            <span>YOUR BRAND, WITH A STEADIER PRESENCE</span>
            <h2>Let&apos;s plan your next month of content.</h2>
            <p>
              Tell us what you want your social channels to do for your
              business.
            </p>
          </div>
          <Link className="smm-contact-button" href="/contact">
            Request a social plan <span aria-hidden="true">↗</span>
          </Link>
          <span className="smm-contact-orbit" aria-hidden="true">
            ◎
          </span>
        </div>
      </section>
    </main>
  );
}
