import Link from "next/link";
<<<<<<< HEAD
import { marked } from "marked";
import { getContent } from "@/lib/nextContent";
import { CallToAction, RichText, SmartLink } from "@/components/Content";
import { getBlogPosts } from "@/lib/blog";
import {
  BusinessNeeds,
  CampaignShowcase,
  ClientVoices,
  Comparison,
  FAQ,
  Story,
  TrustedBrands,
} from "@/components/Sections";
import LeadGenerationForm from "@/components/LeadGenerationForm";
import PricingPlans from "@/components/PricingPlans";
import VideoShowcase from "@/components/VideoShowcase";
import RotatingHeroHeading from "@/components/RotatingHeroHeading";
import BlogCardMeta from "@/components/BlogCardMeta";
import AboutIntro from "@/components/AboutIntro";
import StatsShowcase from "@/components/StatsShowcase";
import MeetDigitalSolution from "@/components/MeetDigitalSolution";
import { getAdsCampaignShowcase } from "@/lib/portfolio";
import { getSiteSettings } from "@/lib/siteSettings";
import { clientVoices } from "@/lib/clientVoices";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata() {
  return getPageMetadata("/", {
    title: "Digital Marketing, Websites & SEO",
    description:
      "DS Solution helps ambitious businesses grow with digital marketing, website development, branding, SEO and performance campaigns.",
  });
}

function Heading({ children }) {
  return (
    <h2 className="text-h3 lg:text-h2 [&_strong]:text-primary mx-auto mb-2 lg:w-10/12">
      {children}
    </h2>
  );
}

const meetTeams = [
  {
    title: "Experienced Web Development Team",
    content:
      "Our web specialists bring around a decade of IT experience and build websites around your needs, from Shopify and WordPress to React and Node.js.",
    link: "/website-and-ui-ux-design",
    linkLabel: "Explore web development",
  },
  {
    title: "Experienced Digital Marketing Team",
    content:
      "Improve search visibility and website traffic with on-page and off-page SEO, Local SEO and website optimisation. We also plan Google, Meta and LinkedIn ads, email marketing and business review support to reach your target audience.",
    link: "/digital-marketing",
    linkLabel: "Explore digital marketing",
  },
  {
    title: "Creative Design & Video Team",
    content:
      "Bring your brand to life with social and website banners, logos, ad creatives and Figma design, plus video editing, reels and motion graphics for YouTube, Facebook, Instagram, LinkedIn and Threads.",
    link: "/creatives",
    linkLabel: "Explore creative services",
  },
];

export default async function HomePage() {
  const [
    { data: home },
    businessNeeds,
    comparison,
    ourStory,
    testimonials,
    brands,
    faq,
    pricing,
    posts,
    showcase,
    siteSettings,
  ] = await Promise.all([
    getContent("homepage", "-index"),
    getContent("sections", "business-needs"),
    getContent("sections", "comparison-row"),
    getContent("sections", "our-story"),
    getContent("sections", "testimonial"),
    getContent("sections", "brands"),
    getContent("sections", "faq"),
    getContent("pricing", "-index"),
    getBlogPosts(),
    getAdsCampaignShowcase(3),
    getSiteSettings(),
  ]);
  const latestPosts = posts
    .sort((a, b) => new Date(b.data.date ?? 0) - new Date(a.data.date ?? 0))
    .slice(0, 3);

  return (
    <div className="home-page">
      <section className="relative overflow-hidden py-16 sm:py-16 md:py-30 lg:pt-40 lg:pb-37 xl:pt-50">
        <div className="relative mx-auto px-8 xl:max-w-330.5!">
          <div className="absolute top-0 left-0 w-full">
            <div className="h-100 w-full -translate-y-10 overflow-hidden">
              <canvas
                className="heroSporeCanvas w-full"
                width={800}
                height={800}
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center">
            <div className="relative mb-10 w-full text-center sm:mb-12 md:mb-20">
              <RotatingHeroHeading />
              <p className="mx-auto mb-6 text-sm sm:text-base md:mb-10 lg:w-6/12">
                {home.banner.content}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <SmartLink
                  className="home-primary-action inline-block cursor-pointer rounded-full bg-[linear-gradient(0deg,var(--color-primary-light)_0%,var(--color-primary)_100%)] px-8 py-3 font-normal !text-white capitalize transition select-none hover:shadow-[0_0_20px_var(--color-primary-light)] hover:brightness-125 hover:transition-all hover:duration-300 hover:ease-[ease]"
                  href={home.banner.button_primary.link}
                >
                  {home.banner.button_primary.label}
                </SmartLink>
                <SmartLink
                  className="home-secondary-action border-text text-text-light hover:border-primary hover:bg-primary hover:text-on-accent inline-block cursor-pointer rounded-full border-[1.5px] bg-transparent px-8 py-3 font-normal capitalize transition-all duration-300 select-none hover:shadow-[0_0_15px_var(--color-primary)]"
                  href={home.banner.button_secondary.link}
                >
                  {home.banner.button_secondary.label}
                </SmartLink>
              </div>
            </div>
            <div className="hidden w-full md:block">
              <div className="flex w-full justify-center perspective-near xl:perspective-dramatic">
                <VideoShowcase />
              </div>
            </div>
=======
import { getServices } from "@/lib/services";
import ServicesDirectory from "./services/ServicesDirectory";
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
>>>>>>> e450f7a (Update website)
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
<<<<<<< HEAD
      <hr className="h-px border-0 bg-linear-to-r from-transparent from-10% via-white/50 to-transparent to-90%" />

      {home.agency_services?.enable && (
        <section className="relative py-16 xl:py-19">
          <div className="mx-auto px-8 xl:max-w-330.5!">
            <div className="flex flex-col gap-10 lg:gap-16">
              <div className="flex flex-col items-center gap-y-5 text-center">
                <Heading>
                  <RichText>{home.agency_services.title}</RichText>
                </Heading>
                <p className="text-text mx-auto text-lg lg:w-7/12">
                  {home.agency_services.content}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {home.agency_services.items.map((service) => (
                  <article
                    className="border-border bg-light/60 rounded-2xl border p-6"
                    key={service.title}
                  >
                    <h3 className="text-h5 mb-3">{service.title}</h3>
                    <p className="mb-5">{service.content}</p>
                    <SmartLink
                      className="home-inline-action"
                      href={service.link}
                    >
                      Explore service <span aria-hidden="true">→</span>
                    </SmartLink>
                  </article>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {home.agency_services.platforms.map((platform) => (
                  <span
                    className="border-border bg-body text-text-dark rounded-full border px-4 py-2 text-sm"
                    key={platform}
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      <AboutIntro />
      {home.why_choose?.enable && (
        <section className="relative py-6 pt-0 xl:py-2">
          <div className="mx-auto px-2 xl:max-w-330.5!">
            <div className="flex flex-col gap-10 lg:gap-16">
              <div className="flex flex-col items-center gap-y-5 text-center">
                <Heading>
                  <RichText>{home.why_choose.title}</RichText>
                </Heading>
                <p className="text-text mx-auto text-lg lg:w-7/12">
                  {home.why_choose.content}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {home.why_choose.items.map((item) => (
                  <article
                    className="border-border bg-light/60 rounded-2xl border p-6"
                    key={item.title}
                  >
                    <h3 className="text-h5 mb-3">{item.title}</h3>
                    <p>{item.content}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="relative py-16 pt-30 xl:py-19 xl:pt-20">
        <div className="mx-auto px-8 xl:max-w-330.5!">
          <div className="flex flex-col gap-10 lg:gap-16">
            <div className="flex flex-col items-center gap-y-5 text-center">
              <Heading>
                <RichText>{home.main_features.title}</RichText>
              </Heading>
              <p className="text-text mx-auto text-lg lg:w-7/12">
                {home.main_features.content}
              </p>
            </div>
            <div className="mb-0 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {home.main_features.items.map((item) => (
                <div
                  className="border-border bg-body flex items-center justify-center gap-x-2 rounded-full border px-4 py-2.5 text-center"
                  key={item}
                >
                  <span className="text-secondary" aria-hidden="true">
                    ✦
                  </span>
                  <span className="text-text-dark font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {home.value_props.enable && (
        <section className="relative overflow-hidden py-16 xl:py-6">
          <div className="mx-auto px-8 xl:max-w-330.5!">
            <div className="flex flex-col gap-10 lg:gap-6">
              <div className="flex flex-col items-center gap-y-2 text-center">
                <Heading>
                  <RichText>{home.value_props.title}</RichText>
                </Heading>
                <p className="text-text mx-auto text-lg lg:w-7/12">
                  {home.value_props.content}
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {home.value_props.items.map((item) => (
                  <article
                    className="border-border bg-light/70 rounded-2xl border p-6"
                    key={item.title}
                  >
                    <span className="home-value-prop-icon-wrap mb-5 grid size-12 place-items-center rounded-xl">
                      <img
                        className="home-value-prop-icon size-8"
                        src={item.logo}
                        alt={`${item.title} icon`}
                      />
                    </span>
                    <h3 className="text-h5 mb-4">{item.title}</h3>
                    <ul className="text-text space-y-2">
                      {item.list?.map((entry) => (
                        <li key={entry}>{entry}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {home.our_features.enable && (
        <section className="relative py-16 xl:py-19">
          <div className="mx-auto px-8 xl:max-w-330.5!">
            <div className="flex flex-col gap-10 lg:gap-16">
              <div className="flex flex-col items-center gap-y-5 text-center">
                <Heading>
                  <RichText>{home.our_features.title}</RichText>
                </Heading>
                <p className="text-text mx-auto text-lg lg:w-7/12">
                  {home.our_features.content}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {home.our_features.items.map((item) => (
                  <div
                    className="border-border bg-light/60 flex items-center gap-4 rounded-2xl border p-5"
                    key={item.title}
                  >
                    <img
                      className="size-8"
                      src={item.logo}
                      alt={`${item.title} icon`}
                    />
                    <span className="text-text-dark font-semibold">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <BusinessNeeds data={businessNeeds.data} />
      <Comparison data={comparison.data} />
      <CampaignShowcase data={showcase} />
      <StatsShowcase />

      <section className="home-partner-section relative overflow-hidden py-20 sm:py-24 xl:py-10">
        <div className="bg-primary/10 pointer-events-none absolute top-0 right-0 -z-10 size-96 translate-x-1/3 -translate-y-1/4 rounded-full blur-3xl" />
        <div className="container">
          <div className="home-partner-card">
            <div className="home-partner-main">
              <div className="home-partner-copy">
                {/* <p className="home-partner-eyebrow">
                  <span aria-hidden="true" />
                  Meet Digital Solution
                </p> */}
                <h2 className="home-partner-title">
                  Make your online presence work <span>for your business.</span>
                </h2>
                <p className="home-partner-location">
                  Digital marketing and web development company in Mohali
                </p>
                <p className="home-partner-description">
                  Digital Solution, also known as The DS Solution, is a digital
                  marketing and web development company helping businesses build
                  a stronger online presence. We bring strategy, creative work
                  and technology together to help you reach your business goals.
                </p>
                <p className="home-partner-supporting">
                  Customers use Google, Microsoft Bing and Yahoo Search to find
                  products and services. A thoughtful digital presence helps
                  your business get discovered, build trust and connect with
                  more potential customers.
                </p>
                <SmartLink className="home-partner-cta" href="/about">
                  Why choose Digital Solution?
                  <span aria-hidden="true">→</span>
                </SmartLink>
              </div>

              <div className="home-partner-visual">
                <div className="home-partner-image-frame">
                  <img
                    src="/images/about/about-marketing.webp"
                    alt="Digital growth analytics and marketing strategy"
                    loading="lazy"
                  />
                  <div className="home-partner-image-shade" />
                  <div className="home-partner-image-caption">
                    <span
                      className="home-partner-caption-icon"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                    <span>
                      <strong>Built around your next move</strong>
                      <small>Strategy, creativity and technology in sync</small>
                    </span>
                  </div>
                </div>
                <div className="home-partner-visual-note">
                  <span aria-hidden="true">✦</span>
                  <p>
                    One connected team.
                    <br />
                    <strong>One clear direction.</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="home-partner-teams">
              {meetTeams.map((team, index) => (
                <article className="home-partner-team" key={team.title}>
                  <span className="home-partner-team-index">0{index + 1}</span>
                  <h3>{team.title}</h3>
                  <p>{team.content}</p>
                  <SmartLink className="home-inline-action" href={team.link}>
                    {team.linkLabel} <span aria-hidden="true">→</span>
                  </SmartLink>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {home.pricing.enable && (
        <section
          className="relative my-0 rounded-[36px] bg-transparent py-16 lg:rounded-[80px] xl:py-38"
          id="pricing"
        >
          <div className="mx-auto px-8 xl:max-w-330.5!">
            <div className="flex flex-col gap-10 lg:gap-16">
              <div className="flex flex-col items-center gap-y-5 text-center">
                <h2 className="text-h3 lg:text-h2 [&_strong]:text-primary mx-auto mb-2 lg:w-10/12">
                  <RichText>{home.pricing.title}</RichText>
                </h2>
                <p>{home.pricing.content}</p>
              </div>
              <div className="mb-0">
                <div>
                  <PricingPlans
                    plans={pricing.data.plans}
                    labels={pricing.data.toggler}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {latestPosts.length > 0 && (
        <section className="relative py-16 xl:py-19">
          <div className="mx-auto px-8 xl:max-w-330.5!">
            <div className="flex flex-col items-center gap-y-5 text-center">
              <Heading>Latest insights and updates</Heading>
              <p className="text-text mx-auto text-lg lg:w-7/12">
                Ideas and practical guidance from the Digital Solution team.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {latestPosts.map((post) => (
                <article
                  className="border-border bg-light/60 overflow-hidden rounded-2xl border"
                  key={post.id}
                >
                  <Link href={`/blog/${post.id}`}>
                    <img
                      className="aspect-video w-full object-cover"
                      src={post.data.image ?? "/images/blog/post-1.png"}
                      alt={post.data.title}
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>
                  <div className="p-6">
                    <h3 className="text-h5 mb-3">
                      <Link href={`/blog/${post.id}`}>
                        <RichText>{post.data.title}</RichText>
                      </Link>
                    </h3>
                    <p className="mb-5">{post.data.description}</p>
                    <BlogCardMeta
                      className="border-border mb-4 border-t pt-4"
                      author={post.data.author}
                      socialLinks={siteSettings.social.floating}
                    />
                    <Link
                      className="home-inline-action"
                      href={`/blog/${post.id}`}
                    >
                      Read article <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                className="home-secondary-action border-text text-text-light hover:border-primary hover:bg-primary hover:text-on-accent inline-block cursor-pointer rounded-full border-[1.5px] bg-transparent px-8 py-3 font-normal capitalize transition-all duration-300 select-none hover:shadow-[0_0_15px_var(--color-primary)]"
                href="/blog"
              >
                View all insights
              </Link>
            </div>
          </div>
        </section>
      )}

      <ClientVoices
        data={{
          enable: testimonials.data.enable,
          title: "Client Stories from India & the USA",
          description:
            "Illustrative sample feedback with client names kept private. Replace with verified reviews before publishing.",
          rows: [clientVoices.slice(0, 8), clientVoices.slice(8)],
        }}
      />
      <MeetDigitalSolution />
      <FAQ data={faq.data} />
      <CallToAction />
    </div>
=======
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
>>>>>>> e450f7a (Update website)
  );
}
