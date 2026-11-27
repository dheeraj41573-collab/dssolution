import Link from "next/link";
import { notFound } from "next/navigation";
import { getServices } from "@/lib/services";
import { getSiteSettings } from "@/lib/siteSettings";
import { getPageMetadata } from "@/lib/pageMetadata";
import JsonLd from "@/components/seo/JsonLd";
import { getPageSeo, getSeoSettings, parseSchemaJson } from "@/lib/seo";
import { splitServiceContent } from "@/lib/serviceContent";
import { getServiceFallback } from "@/lib/serviceFallbacks";
import { serviceTheme } from "@/lib/serviceTheme";
import { clientVoices } from "@/lib/clientVoices";
import ServiceArt from "@/components/ServiceArt";
import MarkdownBody from "@/components/MarkdownBody";
import ServiceRail from "@/components/ServiceRail";
import ServiceGallery from "@/components/ServiceGallery";
import VoicesSlider from "@/components/VoicesSlider";
import StatsRow from "@/components/StatsRow";
import "@/styles/service-detail.css";

export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getServices()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = (await getServices()).find((item) => item.slug === slug);
  if (!service) return {};
  return getPageMetadata(`/services/${slug}`, {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.title,
      description: service.summary,
      type: "website",
      ...(service.image ? { images: [service.image] } : {}),
    },
  });
}

/* ───────────── shared class strings and helpers ───────────── */

const eyebrowPill =
  "sd-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-[0.16em] uppercase";
const h2Class =
  "text-3xl font-bold tracking-tight text-balance text-text-dark sm:text-4xl";
const focusClass =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const panelClass =
  "rounded-2xl border sd-accent-border bg-light p-6 transition duration-200";
const proseClass =
  "prose max-w-none [--tw-prose-body:var(--ds-text)] [--tw-prose-headings:var(--ds-strong)] [--tw-prose-lead:var(--ds-text)] [--tw-prose-links:var(--ds-primary)] [--tw-prose-bold:var(--ds-strong)] [--tw-prose-bullets:var(--ds-primary)] [--tw-prose-counters:var(--ds-primary)] [--tw-prose-hr:var(--ds-border)] [--tw-prose-quotes:var(--ds-strong)] [--tw-prose-quote-borders:var(--ds-primary)] [--tw-prose-captions:var(--ds-muted)] [--tw-prose-th-borders:var(--ds-border)] [--tw-prose-td-borders:var(--ds-border)] prose-headings:font-bold prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-xl prose-p:my-4 prose-p:text-[16px] prose-p:leading-[1.8] prose-li:text-[16px] prose-ul:my-4 prose-a:font-semibold prose-a:underline-offset-4 prose-img:mx-auto prose-img:rounded-2xl prose-img:border prose-img:border-border";

const bodyBase =
  "mt-3 text-[15px] leading-relaxed text-text prose-p:my-0 prose-p:text-[15px] prose-p:leading-relaxed prose-li:text-[15px] prose-ul:my-2 [&_li]:mt-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:font-semibold [&_a]:no-underline";
const bodyClass = (onDark) =>
  `${bodyBase} ${
    onDark
      ? "[&_a]:text-[#fff] [&_p]:text-[#fff]/85 [&_li]:text-[#fff]/85 [&_strong]:text-[#fff]"
      : "[&_a]:text-primary"
  }`;

const processSteps = [
  {
    number: "01",
    title: "Understand",
    text: "We learn about your audience, goals and current setup.",
  },
  {
    number: "02",
    title: "Plan",
    text: "We agree on the right scope, deliverables and measures.",
  },
  {
    number: "03",
    title: "Deliver",
    text: "We do the work, share progress and refine it with you.",
  },
];

const defaultFaqs = [
  {
    question: "How do we get started?",
    answer:
      "Contact our team and tell us what you are looking to achieve. We will discuss the scope, timeline and next steps before work begins.",
  },
  {
    question: "Can the service be tailored to my business?",
    answer:
      "Yes. We shape the deliverables around your audience, goals and priorities, then agree the plan with you.",
  },
  {
    question: "How will we track progress?",
    answer:
      "We agree on useful progress measures at the start and keep you updated throughout the engagement.",
  },
];

const pad = (value) => String(value).padStart(2, "0");

const gridCols = (count) =>
  count === 2 || count === 4
    ? "sm:grid-cols-2"
    : "sm:grid-cols-2 lg:grid-cols-3";

const shortLabel = (text) => {
  const value = String(text || "").trim();
  return value.length > 34 ? `${value.slice(0, 33).trimEnd()}…` : value;
};

function pickVoices(offset, count) {
  const total = clientVoices.length;
  return Array.from(
    { length: Math.min(count, total) },
    (_, index) => clientVoices[(offset + index) % total],
  );
}

/* ───────────── small building blocks ───────────── */

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px] fill-current"
      aria-hidden="true"
    >
      <path d="M20.52 3.48A11.8 11.8 0 0 0 12.12 0C5.58 0 .26 5.32.26 11.86c0 2.09.55 4.13 1.6 5.93L.16 24l6.37-1.67a11.9 11.9 0 0 0 5.59 1.42h.01c6.54 0 11.86-5.32 11.86-11.86a11.8 11.8 0 0 0-3.47-8.41ZM12.13 21.73a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.78.99 1.01-3.69-.23-.38a9.84 9.84 0 0 1-1.51-5.2c0-5.46 4.45-9.91 9.92-9.91 2.65 0 5.14 1.03 7.02 2.91a9.86 9.86 0 0 1 2.9 7.02c0 5.47-4.45 9.92-9.93 9.92Zm5.44-7.43c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.8-1.49-1.78-1.66-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.11 4.52.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px] fill-current"
      aria-hidden="true"
    >
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

function SectionHeading({ id, eyebrow, title, center = false }) {
  return (
    <div className={`mb-8 max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className={eyebrowPill}>
          <i aria-hidden="true" className="size-1.5 rounded-full bg-current" />
          {eyebrow}
        </p>
      )}
      <h2 id={id} className={`${h2Class} ${eyebrow ? "mt-4" : ""}`}>
        {title}
      </h2>
      <span
        aria-hidden="true"
        className={`sd-accent-bg mt-4 block h-1 w-16 rounded-full ${
          center ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}

function Breadcrumb({ title }) {
  return (
    <nav aria-label="Breadcrumb" className="text-text-light mb-4 text-sm">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link className="hover:text-primary" href="/">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link className="hover:text-primary" href="/services">
            Services
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-text-dark font-semibold">
          {title}
        </li>
      </ol>
    </nav>
  );
}

/* ───────────── hero ───────────── */

function HeroActions({ whatsappHref, phoneLink, onDark }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition hover:-translate-y-0.5 ${focusClass} ${
          onDark
            ? "bg-[#fff] text-[#0b1535] hover:shadow-lg"
            : "bg-[#0f7a47] text-[#fff] hover:brightness-110"
        }`}
      >
        <WhatsAppIcon /> Chat on WhatsApp
        <span aria-hidden="true">↗</span>
      </a>
      <a
        href={`tel:${phoneLink}`}
        className={`inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition hover:-translate-y-0.5 ${focusClass} ${
          onDark
            ? "border border-[#fff]/70 text-[#fff] hover:bg-[#fff]/15"
            : "bg-text-dark text-body hover:brightness-110"
        }`}
      >
        <PhoneIcon /> Book a Call
        <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

function Highlights({ items, onDark }) {
  const list = items.slice(0, 6);
  if (list.length < 3) return null;
  return (
    <ul className="mt-7 flex flex-wrap gap-2">
      {list.map((item) => (
        <li
          key={item}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
            onDark ? "border-[#fff]/30 bg-[#fff]/12 text-[#fff]" : "sd-chip"
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function HeroMeta({ price, emails, onDark }) {
  return (
    <div
      className={`mt-8 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between ${
        onDark ? "border-[#fff]/25" : "border-border"
      }`}
    >
      <div>
        <p
          className={`text-xs font-semibold tracking-[0.14em] uppercase ${
            onDark ? "text-[#fff]/70" : "text-text-light"
          }`}
        >
          Price range
        </p>
        <p
          className={`mt-1 text-2xl font-bold ${
            onDark ? "text-[#fff]" : "text-text-dark"
          }`}
        >
          {price || "Custom quote"}
        </p>
      </div>
      <p
        className={`flex flex-wrap gap-x-5 gap-y-1 text-sm ${
          onDark ? "text-[#fff]/85" : "text-text-light"
        }`}
      >
        {emails.map((email) => (
          <a
            key={email}
            href={`mailto:${email}`}
            className="font-semibold break-all underline underline-offset-4"
          >
            {email}
          </a>
        ))}
      </p>
    </div>
  );
}

function Hero({
  service,
  theme,
  cover,
  capabilities,
  whatsappHref,
  phoneLink,
  emails,
}) {
  const media = cover ? (
    <img
      src={cover}
      alt={service.title}
      width={800}
      height={600}
      fetchPriority="high"
      decoding="async"
      className="size-full object-cover"
    />
  ) : (
    <ServiceArt
      slug={service.slug}
      icon={service.icon}
      category={service.category}
    />
  );

  if (theme.heroVariant === 1) {
    return (
      <section
        id="service-overview"
        className="sd-accent-border relative isolate min-h-96 scroll-mt-28 overflow-hidden rounded-[2rem] border"
      >
        <div className="absolute inset-0 -z-10">{media}</div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[#08122a]/72"
        />
        <div className="relative max-w-3xl p-7 sm:p-12 lg:p-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#fff]/30 bg-[#fff]/15 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-[#fff] uppercase">
            <i
              aria-hidden="true"
              className="size-1.5 rounded-full bg-current"
            />
            {service.category || "Our services"}
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-balance text-[#fff] sm:text-5xl">
            {service.title}
          </h1>
          {service.summary && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#fff]/85">
              {service.summary}
            </p>
          )}
          <Highlights items={capabilities} onDark />
          <HeroActions
            whatsappHref={whatsappHref}
            phoneLink={phoneLink}
            onDark
          />
          <HeroMeta price={service.price} emails={emails} onDark />
        </div>
      </section>
    );
  }

  return (
    <section
      id="service-overview"
      className="sd-accent-border bg-light relative isolate scroll-mt-28 overflow-hidden rounded-[2rem] border p-6 shadow-sm sm:p-10 lg:p-12"
    >
      <div
        aria-hidden="true"
        className="sd-accent-bg absolute inset-x-0 top-0 h-1.5"
      />
      <div
        aria-hidden="true"
        className="sd-glow pointer-events-none absolute -top-24 -right-16 size-80 rounded-full opacity-60 blur-2xl"
      />
      <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className={eyebrowPill}>
            <i
              aria-hidden="true"
              className="size-1.5 rounded-full bg-current"
            />
            {service.category || "Our services"}
          </span>
          <div className="mt-6 flex items-start gap-4">
            <span
              aria-hidden="true"
              className="sd-chip grid size-14 shrink-0 place-items-center rounded-2xl text-3xl"
            >
              {service.icon || "✦"}
            </span>
            <h1 className="text-text-dark text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
              {service.title}
            </h1>
          </div>
          {service.summary && (
            <p className="text-text mt-6 max-w-2xl text-lg leading-relaxed">
              {service.summary}
            </p>
          )}
          <Highlights items={capabilities} />
          <HeroActions whatsappHref={whatsappHref} phoneLink={phoneLink} />
          <HeroMeta price={service.price} emails={emails} />
        </div>
        <div className="sd-accent-border aspect-4/3 overflow-hidden rounded-3xl border">
          {media}
        </div>
      </div>
    </section>
  );
}

/* ───────────── layouts for the imported content ───────────── */

function CardGrid({ cards, bento }) {
  return (
    <div className={`grid gap-5 ${gridCols(cards.length)}`}>
      {cards.map((card, cardIndex) => {
        const featured = bento && cardIndex === 0;
        return (
          <article
            key={`${card.title}-${cardIndex}`}
            className={`group relative flex flex-col overflow-hidden rounded-2xl border p-6 transition duration-200 hover:-translate-y-1 ${
              featured
                ? "sd-accent-bg sd-accent-ring border-transparent hover:shadow-xl sm:col-span-2"
                : `${panelClass} hover:shadow-primary/10 hover:shadow-lg`
            }`}
          >
            <span
              className={`grid size-11 place-items-center rounded-xl text-sm font-bold ${
                featured ? "bg-[#fff]/20 text-[#fff]" : "sd-chip"
              }`}
            >
              {pad(cardIndex + 1)}
            </span>
            <h3
              className={`mt-5 text-xl font-semibold ${
                featured ? "text-[#fff]" : "text-text-dark"
              }`}
            >
              {card.title}
            </h3>
            {card.html && (
              <MarkdownBody html={card.html} className={bodyClass(featured)} />
            )}
            <span
              aria-hidden="true"
              className={`mt-auto pt-5 text-lg opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100 ${
                featured ? "text-[#fff]" : "sd-accent-text"
              }`}
            >
              →
            </span>
          </article>
        );
      })}
    </div>
  );
}

function CardRows({ cards }) {
  return (
    <ul className="sd-accent-border bg-light overflow-hidden rounded-3xl border">
      {cards.map((card, cardIndex) => (
        <li
          key={`${card.title}-${cardIndex}`}
          className={`sd-hover-tint grid gap-3 p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:gap-6 ${
            cardIndex ? "border-border border-t" : ""
          }`}
        >
          <span className="sd-accent-text text-3xl font-extrabold tabular-nums sm:w-14">
            {pad(cardIndex + 1)}
          </span>
          <div className="min-w-0">
            <h3 className="text-text-dark text-lg font-semibold">
              {card.title}
            </h3>
            {card.html && (
              <MarkdownBody html={card.html} className={bodyClass(false)} />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function StepsCards({ steps }) {
  const cols =
    steps.length === 2 || steps.length === 4
      ? "md:grid-cols-2"
      : "md:grid-cols-3";
  return (
    <ol className={`grid gap-5 ${cols}`}>
      {steps.map((step) => (
        <li
          key={step.number}
          className={`group relative overflow-hidden ${panelClass} hover:-translate-y-1`}
        >
          <span
            aria-hidden="true"
            className="text-text-dark/5 absolute -top-3 right-4 text-7xl font-extrabold"
          >
            {step.number}
          </span>
          <span className="sd-accent-bg relative grid size-11 place-items-center rounded-xl text-sm font-bold">
            {step.number}
          </span>
          <h3 className="text-text-dark relative mt-5 text-xl font-semibold">
            {step.title}
          </h3>
          {step.html && (
            <MarkdownBody
              html={step.html}
              className={`relative ${bodyClass(false)}`}
            />
          )}
        </li>
      ))}
    </ol>
  );
}

function StepsTimeline({ steps }) {
  return (
    <ol className="sd-timeline relative">
      {steps.map((step) => (
        <li key={step.number} className="relative pb-6 pl-16 last:pb-0">
          <span className="sd-timeline-dot">{step.number}</span>
          <div className="border-border bg-light rounded-2xl border p-5 transition hover:border-[color:var(--sd-accent)] hover:shadow-md sm:p-6">
            <h3 className="text-text-dark text-lg font-semibold">
              {step.title}
            </h3>
            {step.html && (
              <MarkdownBody html={step.html} className={bodyClass(false)} />
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function ProseSection({ section, headingId, twoCol }) {
  if (twoCol && section.title) {
    return (
      <section
        id={section.id}
        className="scroll-mt-28 pt-16 sm:pt-20"
        aria-labelledby={headingId}
      >
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id={headingId}
              eyebrow={section.eyebrow}
              title={section.title}
            />
          </div>
          <MarkdownBody html={section.html} className={proseClass} />
        </div>
      </section>
    );
  }

  return (
    <section
      id={section.id}
      className="scroll-mt-28 pt-16 sm:pt-20"
      aria-labelledby={headingId}
    >
      <div className="border-border bg-light rounded-3xl border p-6 sm:p-10">
        {section.title && (
          <SectionHeading
            id={headingId}
            eyebrow={section.eyebrow}
            title={section.title}
          />
        )}
        <MarkdownBody html={section.html} className={proseClass} />
      </div>
    </section>
  );
}

function ContentSection({ section, index, theme, first }) {
  const headingId = section.title ? `${section.id}-heading` : undefined;
  const spacing = first ? "pt-10 sm:pt-14 lg:pt-0" : "pt-16 sm:pt-20";
  const cardsVariant = (theme.cardsVariant + index) % 3;
  const stepsVariant = (theme.stepsVariant + index) % 2;
  const proseVariant = (theme.proseVariant + index) % 2;

  if (section.kind === "cards") {
    const centered = cardsVariant === 2;
    return (
      <section
        id={section.id}
        className={`scroll-mt-28 ${spacing}`}
        aria-labelledby={headingId}
      >
        {section.title && (
          <SectionHeading
            id={headingId}
            eyebrow={section.eyebrow}
            title={section.title}
            center={centered}
          />
        )}
        {section.intro && (
          <MarkdownBody
            html={section.intro}
            className={`${proseClass} -mt-4 mb-8 max-w-3xl ${
              centered ? "mx-auto text-center" : ""
            }`}
          />
        )}
        {cardsVariant === 1 ? (
          <CardRows cards={section.cards} />
        ) : (
          <CardGrid cards={section.cards} bento={cardsVariant === 2} />
        )}
      </section>
    );
  }

  if (section.kind === "steps") {
    return (
      <section
        id={section.id}
        className={`scroll-mt-28 ${spacing}`}
        aria-labelledby={headingId}
      >
        {section.title && (
          <SectionHeading
            id={headingId}
            eyebrow={section.eyebrow}
            title={section.title}
          />
        )}
        {section.intro && (
          <MarkdownBody
            html={section.intro}
            className={`${proseClass} -mt-4 mb-8 max-w-3xl`}
          />
        )}
        {stepsVariant === 1 && section.steps.length > 3 ? (
          <StepsTimeline steps={section.steps} />
        ) : (
          <StepsCards steps={section.steps} />
        )}
      </section>
    );
  }

  return (
    <div className={spacing}>
      <ProseSection
        section={section}
        headingId={headingId}
        twoCol={proseVariant === 1}
      />
    </div>
  );
}

/* ───────────── used only when a service has neither content nor a fallback ───────────── */

function Capabilities({ capabilities }) {
  const items = capabilities.length
    ? capabilities
    : ["Scope and deliverables tailored to your needs"];
  return (
    <section
      id="included"
      className="scroll-mt-28 pt-16 sm:pt-20"
      aria-labelledby="included-heading"
    >
      <SectionHeading
        id="included-heading"
        eyebrow="Built around your goals"
        title="What we can work on together"
      />
      <ul className={`grid gap-5 ${gridCols(items.length)}`}>
        {items.map((capability, index) => (
          <li key={capability} className={panelClass}>
            <span className="sd-chip grid size-11 place-items-center rounded-xl text-sm font-bold">
              {pad(index + 1)}
            </span>
            <h3 className="text-text-dark mt-5 text-xl font-semibold">
              {capability}
            </h3>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Process() {
  return (
    <section
      className="scroll-mt-28 pt-16 sm:pt-20"
      aria-labelledby="process-heading"
    >
      <SectionHeading
        id="process-heading"
        eyebrow="How we work"
        title="A clear path from start to progress"
      />
      <ol className="grid gap-5 md:grid-cols-3">
        {processSteps.map((step) => (
          <li key={step.number} className={panelClass}>
            <span className="sd-accent-bg grid size-11 place-items-center rounded-xl text-sm font-bold">
              {step.number}
            </span>
            <h3 className="text-text-dark mt-5 text-xl font-semibold">
              {step.title}
            </h3>
            <p className={bodyClass(false)}>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Faq({ faqs }) {
  return (
    <section
      id="service-faq"
      className="grid scroll-mt-28 gap-10 pt-16 sm:pt-20 lg:grid-cols-[0.8fr_1.2fr]"
      aria-labelledby="faq-heading"
    >
      <div>
        <p className={eyebrowPill}>
          <i aria-hidden="true" className="size-1.5 rounded-full bg-current" />
          Common questions
        </p>
        <h2 id="faq-heading" className={`${h2Class} mt-4`}>
          Good to know
        </h2>
        <span
          aria-hidden="true"
          className="sd-accent-bg mt-4 block h-1 w-16 rounded-full"
        />
      </div>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="sd-accent-border group bg-light rounded-2xl border open:shadow-md"
          >
            <summary
              className={`text-text-dark flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-5 font-semibold marker:content-none [&::-webkit-details-marker]:hidden ${focusClass}`}
            >
              {faq.question}
              <span
                aria-hidden="true"
                className="sd-chip grid size-8 shrink-0 place-items-center rounded-full text-lg transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="text-text px-5 pb-5 leading-relaxed">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ───────────── closing call to action and related services ───────────── */

function CallToAction({ title, text, whatsappHref, phoneLink, emails }) {
  return (
    <section className="pt-16 sm:pt-20" aria-labelledby="cta-heading">
      <div className="sd-accent-bg sd-accent-ring relative overflow-hidden rounded-3xl p-8 text-center sm:p-14">
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 size-72 rounded-full bg-[#fff]/10 blur-2xl"
        />
        <h2
          id="cta-heading"
          className="relative mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance text-[#fff] sm:text-4xl"
        >
          {title}
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-lg text-[#fff]/90">
          {text}
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-12 items-center gap-2 rounded-full bg-[#fff] px-6 text-sm font-semibold text-[#101b33] transition hover:-translate-y-0.5 hover:shadow-lg ${focusClass}`}
          >
            <WhatsAppIcon /> Chat on WhatsApp
          </a>
          <a
            href={`tel:${phoneLink}`}
            className={`inline-flex min-h-12 items-center gap-2 rounded-full border border-[#fff]/70 px-6 text-sm font-semibold text-[#fff] transition hover:bg-[#fff]/15 ${focusClass}`}
          >
            <PhoneIcon /> Book a Call
          </a>
        </div>
        <p className="relative mt-6 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-[#fff]/90">
          {emails.map((email) => (
            <a
              key={email}
              href={`mailto:${email}`}
              className="font-semibold break-all underline underline-offset-4 hover:text-[#fff]"
            >
              {email}
            </a>
          ))}
        </p>
      </div>
    </section>
  );
}

function RelatedServices({ eyebrow, title, items }) {
  return (
    <section className="pt-16 sm:pt-20" aria-labelledby="related-heading">
      <SectionHeading id="related-heading" eyebrow={eyebrow} title={title} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/services/${item.slug}`}
            className={`group flex flex-col ${panelClass} hover:-translate-y-1 hover:shadow-lg ${focusClass}`}
          >
            <span
              aria-hidden="true"
              className="sd-chip grid size-11 place-items-center rounded-xl text-2xl"
            >
              {item.icon || "✦"}
            </span>
            <h3 className="text-text-dark mt-5 text-lg font-semibold">
              {item.title}
            </h3>
            <p className="text-text mt-2 flex-1 text-sm leading-relaxed">
              {item.summary}
            </p>
            <span className="sd-accent-text mt-5 flex items-center justify-between text-xs font-semibold tracking-wider uppercase">
              View service
              <span
                aria-hidden="true"
                className="text-base transition group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ───────────── the page ───────────── */

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const services = await getServices();
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  const [{ config }, pageSeo, seoSettings] = await Promise.all([
    getSiteSettings(),
    getPageSeo(`/services/${slug}`),
    getSeoSettings(),
  ]);
  const phone = config.params.footer_phone;
  const phoneLink = phone.replace(/[^+\d]/g, "");
  const phoneDigits = (config.params.footer_phone_secondary || phone).replace(
    /\D/g,
    "",
  );
  const emails = [
    config.params.footer_email,
    config.params.footer_email_secondary,
  ].filter(Boolean);
  const whatsappHref = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
    `Hi, I’m interested in ${service.title}. Please share more details.`,
  )}`;

  // Imported copy when it exists, hand-written copy for the services that were
  // imported empty, so every service page has something real to show.
  const fallback = service.content ? null : getServiceFallback(slug);
  const parsed = service.content
    ? splitServiceContent(service.content)
    : { sections: [], cta: null, images: [] };

  const sections = fallback ? fallback.sections : parsed.sections;
  const cta = fallback ? fallback.cta : parsed.cta;
  const images = fallback ? [] : parsed.images;
  const hasBody = sections.length > 0;

  const capabilities = Array.isArray(service.capabilities)
    ? service.capabilities
    : [];
  const faqs = fallback?.faqs?.length
    ? fallback.faqs
    : Array.isArray(service.faqs) && service.faqs.length
      ? service.faqs
      : defaultFaqs;

  const theme = serviceTheme(service.slug, service.category);
  const voices = pickVoices(theme.voiceOffset, 6);
  const cover = images[0]?.src || null;

  const navItems = [
    ...(images.length ? [{ id: "service-gallery", label: "Gallery" }] : []),
    ...sections
      .filter((section) => section.title)
      .map((section) => ({ id: section.id, label: shortLabel(section.title) })),
    { id: "service-results", label: "Track record" },
    { id: "service-voices", label: "Client voices" },
    { id: "service-faq", label: "FAQs" },
  ];

  const sameCategory = services.filter(
    (item) =>
      item.category &&
      item.category === service.category &&
      item.slug !== service.slug &&
      !item.isCategoryOverview,
  );
  const relatedServices = service.isCategoryOverview
    ? sameCategory
    : sameCategory.slice(0, 3);
  const categoryName = service.category || "related";

  const baseUrl = (seoSettings.siteUrl || config.site.base_url || "").replace(
    /\/+$/,
    "",
  );
  const pageSchemas = parseSchemaJson(pageSeo?.schemaJson);
  const serviceSchemas = pageSchemas.length
    ? []
    : [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.summary,
          serviceType: service.category || service.title,
          url: `${baseUrl}/services/${service.slug}`,
          provider: {
            "@type": "Organization",
            name: seoSettings.siteName || "DS Solution",
            url: baseUrl,
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
            {
              "@type": "ListItem",
              position: 2,
              name: "Services",
              item: `${baseUrl}/services`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: service.title,
              item: `${baseUrl}/services/${service.slug}`,
            },
          ],
        },
      ];

  return (
    <>
      {!!serviceSchemas.length && <JsonLd schemas={serviceSchemas} />}
      <div
        className="sd-scope text-text min-h-[70vh] pt-28 pb-20"
        style={{ "--accent": theme.accent, "--accent-2": theme.accent2 }}
      >
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Breadcrumb title={service.title} />
            <Link
              href="/services"
              className={`border-border text-text-dark hover:border-primary hover:text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${focusClass}`}
            >
              <span aria-hidden="true">←</span> Close &amp; Go Back
            </Link>
          </div>

          <Hero
            service={service}
            theme={theme}
            cover={cover}
            capabilities={capabilities}
            whatsappHref={whatsappHref}
            phoneLink={phoneLink}
            emails={emails}
          />

          <div className="mt-10 lg:mt-16 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
            <ServiceRail items={navItems} />

            <div className="min-w-0">
              {images.length > 0 && (
                <section
                  id="service-gallery"
                  className="scroll-mt-28 pt-10 sm:pt-14 lg:pt-0"
                  aria-labelledby="service-gallery-heading"
                >
                  <SectionHeading
                    id="service-gallery-heading"
                    eyebrow="Gallery"
                    title="See the work"
                  />
                  <ServiceGallery images={images} />
                </section>
              )}

              {hasBody ? (
                sections.map((section, index) => (
                  <ContentSection
                    key={section.id}
                    section={section}
                    index={index}
                    theme={theme}
                    first={index === 0 && images.length === 0}
                  />
                ))
              ) : (
                <>
                  <Capabilities capabilities={capabilities} />
                  <Process />
                </>
              )}

              <section
                id="service-results"
                className="scroll-mt-28 pt-16 sm:pt-20"
                aria-labelledby="service-results-heading"
              >
                <SectionHeading
                  id="service-results-heading"
                  eyebrow="Track record"
                  title="Numbers we are proud of"
                />
                <StatsRow />
              </section>

              <section
                id="service-voices"
                className="scroll-mt-28 pt-16 sm:pt-20"
                aria-labelledby="service-voices-heading"
              >
                <SectionHeading
                  id="service-voices-heading"
                  eyebrow="Client voices"
                  title="What working with us feels like"
                />
                <VoicesSlider voices={voices} />
              </section>

              <Faq faqs={faqs} />

              <CallToAction
                title={
                  cta?.title || `Ready to get started with ${service.title}?`
                }
                text={
                  cta?.text ||
                  "Tell us about your goals and we will suggest the right plan, timeline and next steps."
                }
                whatsappHref={whatsappHref}
                phoneLink={phoneLink}
                emails={emails}
              />

              {relatedServices.length > 0 && (
                <RelatedServices
                  eyebrow={`Explore ${categoryName} services`}
                  title={
                    service.isCategoryOverview
                      ? `Find the right ${categoryName} support`
                      : `More ${categoryName} services`
                  }
                  items={relatedServices}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
