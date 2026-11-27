import Link from "next/link";
import { getContent } from "@/lib/nextContent";
import { getPageMetadata } from "@/lib/pageMetadata";
import { PageHeader, RichText } from "@/components/Content";

export async function generateMetadata() {
  const { data } = await getContent("about", "-index");
  return getPageMetadata("/about", {
    title: data.meta_title ?? data.title,
    description: data.description,
  });
}

export default async function AboutUsPage() {
  const { data } = await getContent("about", "-index");
  const profile = data.agency_profile;
  const stats = data.stats;
  const values = data.core_values;
  const mission = data.mission;

  return (
    <>
      <PageHeader
        title={data.page_header.title}
        subtitle={data.page_header.subtitle}
      />

      {profile && (
        <section className="section about-reveal pt-0">
          <div className="container">
            <div className="border-border bg-light relative overflow-hidden rounded-[2rem] border p-5 sm:p-8 lg:p-12">
              <div className="bg-primary/10 pointer-events-none absolute -top-32 -right-20 size-96 rounded-full blur-3xl" />
              <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
                <div className="about-reveal about-reveal-delay-1 order-2 lg:order-1">
                  <p className="text-primary mb-4 text-xs font-bold tracking-[0.18em] uppercase">
                    {profile.label}
                  </p>
                  <h2 className="text-text-dark text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                    {profile.title}
                  </h2>
                  <p className="text-text mt-5 text-base leading-8">
                    {profile.content}
                  </p>
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {profile.values?.map((value, index) => (
                      <li
                        key={value}
                        className="border-border bg-body text-text-dark flex items-start gap-3 rounded-2xl border p-4 text-sm leading-6"
                      >
                        <span className="bg-primary/10 text-primary grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold">
                          0{index + 1}
                        </span>
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>
                {profile.image && (
                  <div className="about-reveal relative order-1 min-w-0 lg:order-2">
                    <div className="border-border bg-body rounded-[1.75rem] border p-2 shadow-[0_28px_75px_-42px_rgba(23,105,245,0.55)] sm:p-3">
                      <img
                        className="aspect-[4/3] w-full rounded-[1.25rem] object-cover"
                        src={profile.image}
                        alt={profile.image_alt ?? profile.title}
                        fetchPriority="high"
                      />
                    </div>
                    <div className="border-border bg-body absolute right-3 -bottom-5 max-w-[calc(100%-1.5rem)] rounded-2xl border px-5 py-4 shadow-xl sm:right-0 sm:translate-x-1/5">
                      <span className="text-text-light block text-xs">
                        Our approach
                      </span>
                      <strong className="text-text-dark mt-1 block text-sm sm:text-base">
                        Strategy. Creativity. Growth.
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {stats?.enable && (
        <section className="section-sm about-reveal">
          <div className="container grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.items.map((item) => (
              <div
                key={item.label}
                className="about-reveal-item border-border bg-light rounded-2xl border p-5 text-center sm:p-6"
              >
                <strong className="text-primary block text-2xl font-bold sm:text-3xl">
                  {item.value}
                </strong>
                <span className="text-text-light text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {mission && (
        <section className="section about-reveal">
          <div className="container">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="relative">
                <div className="bg-primary/10 absolute -inset-3 -z-10 rounded-[2rem] blur-xl" />
                <img
                  className="aspect-[16/10] w-full rounded-[2rem] object-cover shadow-xl"
                  src={mission.image}
                  alt={mission.image_alt}
                  loading="lazy"
                />
                <span className="bg-body/90 text-text-dark absolute right-4 bottom-4 rounded-full px-4 py-2 text-xs font-semibold shadow-lg backdrop-blur sm:right-6 sm:bottom-6">
                  Built around your business
                </span>
              </div>
              <div className="about-reveal about-reveal-delay-1">
                <p className="text-primary mb-4 text-xs font-bold tracking-[0.18em] uppercase">
                  {mission.eyebrow}
                </p>
                <h2 className="text-text-dark text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                  {mission.title}
                </h2>
                <p className="text-text mt-5 text-lg leading-8">
                  {mission.content}
                </p>
                <p className="text-text-light leading-7">
                  {mission.supporting_content}
                </p>
                <Link
                  className="text-primary mt-4 inline-flex items-center gap-2 font-semibold"
                  href="/services"
                >
                  Explore how we can help <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {values?.enable && (
        <section className="section">
          <div className="container">
            <div className="about-reveal mx-auto mb-12 max-w-3xl text-center">
              <p className="text-primary mb-3 text-sm font-semibold tracking-wider uppercase">
                {values.badge}
              </p>
              <h2 className="text-h3 text-text-dark hasHighlight mb-3">
                <RichText>{values.title}</RichText>
              </h2>
              <p className="text-text-light">{values.subtitle}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {values.items.map((item, index) => (
                <article
                  key={item.title}
                  className="about-reveal-item border-border bg-light flex items-center gap-4 rounded-2xl border p-6 transition-transform duration-300 hover:-translate-y-1"
                  style={{ "--about-delay": `${index * 70}ms` }}
                >
                  <span className="bg-primary/10 grid size-12 shrink-0 place-items-center rounded-2xl">
                    <img
                      src={item.logo}
                      alt={`${item.title} logo`}
                      width={28}
                      height={28}
                    />
                  </span>
                  <h3 className="text-h6 mb-0">{item.title}</h3>
                </article>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link className="btn btn-primary" href="/contact">
                Talk to our team
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="section pt-0">
        <div className="container">
          <div className="about-reveal border-border bg-light relative overflow-hidden rounded-[2rem] border px-6 py-12 text-center sm:px-10 sm:py-16">
            <div className="bg-primary/10 pointer-events-none absolute -top-32 left-1/2 size-80 -translate-x-1/2 rounded-full blur-3xl" />
            <div className="relative mx-auto max-w-3xl">
              <p className="text-primary mb-3 text-xs font-bold tracking-[0.18em] uppercase">
                Your next chapter
              </p>
              <h2 className="text-text-dark text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                Ready to grow your brand with a proactive partner?
              </h2>
              <p className="text-text-light mx-auto mt-4 max-w-2xl">
                Let’s talk about your goals and build a digital plan around what
                your business needs next.
              </p>
              <Link className="btn btn-primary mt-7" href="/contact">
                Book a conversation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
