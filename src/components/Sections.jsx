import { marked } from "marked";
import { RichText, SmartLink } from "@/components/Content";
import { ShowcaseMarquee, VoicesMarquee } from "@/components/MarqueeRows";
import {
  FiChevronDown,
  FiEye,
  FiHeart,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import {
  SiAsana,
  SiCalendly,
  SiFacebook,
  SiGmail,
  SiGoogleads,
  SiGoogleanalytics,
  SiGooglecalendar,
  SiGooglepay,
  SiGooglesearchconsole,
  SiHubspot,
  SiInstagram,
  SiIntercom,
  SiJira,
  SiMailchimp,
  SiMake,
  SiMeta,
  SiN8N,
  SiPaytm,
  SiPhonepe,
  SiRazorpay,
  SiTrello,
  SiWhatsapp,
  SiZendesk,
  SiZoho,
  SiZapier,
  SiYoutube,
} from "react-icons/si";

const faqIcons = [FiTrendingUp, FiHeart, FiEye, FiUsers];

const comparisonPlatformIcons = {
  asana: { Icon: SiAsana, color: "#f06a6a" },
  calendly: { Icon: SiCalendly, color: "#006bff" },
  facebook: { Icon: SiFacebook, color: "#0866ff" },
  gmail: { Icon: SiGmail, color: "#ea4335" },
  googleads: { Icon: SiGoogleads, color: "#4285f4" },
  googleanalytics: { Icon: SiGoogleanalytics, color: "#e37400" },
  googlecalendar: { Icon: SiGooglecalendar, color: "#4285f4" },
  googlepay: { Icon: SiGooglepay, color: "#4285f4" },
  googlesearchconsole: { Icon: SiGooglesearchconsole, color: "#458cf5" },
  hubspot: { Icon: SiHubspot, color: "#ff7a59" },
  instagram: { Icon: SiInstagram, color: "#e4405f" },
  intercom: { Icon: SiIntercom, color: "#1f8ded" },
  jira: { Icon: SiJira, color: "#0052cc" },
  mailchimp: { Icon: SiMailchimp, color: "#241c15" },
  make: { Icon: SiMake, color: "#6d00cc" },
  meta: { Icon: SiMeta, color: "#0866ff" },
  n8n: { Icon: SiN8N, color: "#ea4b71" },
  paytm: { Icon: SiPaytm, color: "#00b9f1" },
  phonepe: { Icon: SiPhonepe, color: "#5f259f" },
  razorpay: { Icon: SiRazorpay, color: "#0c2451" },
  trello: { Icon: SiTrello, color: "#0052cc" },
  whatsapp: { Icon: SiWhatsapp, color: "#25d366" },
  zendesk: { Icon: SiZendesk, color: "#03363d" },
  youtube: { Icon: SiYoutube, color: "#ff0000" },
  zoho: { Icon: SiZoho, color: "#e42527" },
  zapier: { Icon: SiZapier, color: "#ff4a00" },
};

// Intrinsic pixel sizes of the funnel icons so the browser can reserve the
// right space before the image loads (avoids layout shift).
const funnelIconSizes = {
  "/images/brands-group-1.png": [378, 173],
  "/images/brands-group-2.png": [365, 176],
  "/images/brands-group-3.png": [303, 158],
  "/images/brands-group-4.png": [260, 163],
  "/images/brands-group-5.png": [207, 154],
};

export function BusinessNeeds({ data }) {
  if (!data.enable) return null;

  return (
    <section className="business-needs-section section bg-body relative isolate overflow-hidden dark:bg-[#0d0e1a]">
      <div className="container">
        <div className="section-container">
          <div className="section-intro centralize mb-2">
            <span className="badge">Success Strategy</span>
            <h2 className="title hasHighlight">
              <RichText>{data.title}</RichText>
            </h2>
            <p className="subtitle">
              The fundamental pillars of a successful digital presence.
            </p>
          </div>
          <div className="section-content">
            <div className="funnel-container">
              {data.items.map((item, index) => (
                <article
                  className={`funnel-item funnel-step-${index + 1}`}
                  key={item.number}
                >
                  <div className="funnel-item-bg-number">{item.number}</div>

                  {/* Icons Group - Left */}
                  <div className="funnel-icons-group">
                    <img
                      className="h-12 w-auto object-contain brightness-110 filter dark:invert-0"
                      src={item.image}
                      alt={`${item.title} icon`}
                      width={funnelIconSizes[item.image]?.[0]}
                      height={funnelIconSizes[item.image]?.[1]}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* Step Info - Center */}
                  <div className="funnel-center-group">
                    <span className="funnel-step-label mb-2 text-[10px] font-black tracking-[0.2em] uppercase">
                      Step {item.number}
                    </span>
                    <h3 className="funnel-title">{item.title}</h3>
                  </div>

                  {/* Content - Right */}
                  <div className="funnel-right-group">
                    <p className="funnel-desc">{item.content}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="from-primary/10 dark:from-primary/20 absolute top-1/2 left-1/2 size-300 -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial to-transparent opacity-50 blur-3xl" />
      </div>
    </section>
  );
}

export function Comparison({ data }) {
  if (!data.enable) return null;

  return (
    <section className="comparison-section section relative isolate overflow-x-hidden">
      <div className="container">
        <div className="section-container">
          <div className="section-intro centralize">
            <h2 className="title hasHighlight">
              <RichText>{data.title}</RichText>
            </h2>
          </div>
          <div className="section-content">
            <div className="flex flex-col gap-y-5 px-4">
              {data.items.map((item) => (
                <div
                  className="max-lg:border-border relative max-lg:rounded-4xl max-lg:border max-lg:py-8"
                  key={item.title}
                >
                  <div className="flex w-full flex-col items-center gap-y-8 lg:flex-row lg:justify-between">
                    <div className="border-border bg-body relative z-10 flex w-full max-w-70 items-center justify-center gap-x-2 rounded-full border px-4 py-2.5">
                      <span className="text-text-dark text-lg font-semibold">
                        {item.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-start gap-3 lg:min-w-90 xl:gap-5">
                      {item.images?.slice(0, 5).map((src) => {
                        const iconName = src
                          .split("/")
                          .pop()
                          .replace(/\.svg$/, "");
                        const platformIcon = comparisonPlatformIcons[iconName];

                        if (platformIcon) {
                          const PlatformIcon = platformIcon.Icon;
                          return (
                            <PlatformIcon
                              className="size-10 shrink-0"
                              style={{ color: platformIcon.color }}
                              aria-label={`${iconName} icon`}
                              role="img"
                              key={src}
                            />
                          );
                        }

                        return (
                          <img
                            className="max-h-12"
                            src={src}
                            alt={`${item.title} icon`}
                            width={50}
                            height={50}
                            loading="lazy"
                            decoding="async"
                            key={src}
                          />
                        );
                      })}
                    </div>
                    <SmartLink
                      href="/contact"
                      className="border-border bg-body text-text hover:border-primary hover:text-primary relative z-10 inline-flex w-full max-w-60 items-center justify-center gap-x-2 rounded-full border px-4 py-2.5 text-base font-semibold transition-colors"
                    >
                      Contact Us <span aria-hidden="true">→</span>
                    </SmartLink>
                  </div>
                  <div className="absolute inset-0 -z-10 hidden items-center xl:flex">
                    <div className="comparison-row-divider w-full border-t border-dashed" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 grid size-full place-items-center">
        <div className="from-primary-light/30 size-225 rounded-full bg-radial from-0% to-transparent to-70%" />
      </div>
    </section>
  );
}

export function Story({ data }) {
  if (!data.enable) return null;

  return (
    <section className="section relative overflow-hidden">
      <div className="container">
        <div className="section-container">
          <div className="section-intro centralize">
            <h2 className="title hasHighlight mx-auto lg:col-8">
              <RichText>{data.title}</RichText>
            </h2>
          </div>
          <div className="section-content">
            <hr className="h-px border-0 bg-linear-to-r from-transparent from-3% via-white/40 to-transparent to-97%" />
            <div className="relative mx-auto max-w-220">
              <div className="border-text/10 border-x p-6 py-20 xl:px-15">
                <div className="mx-auto flex flex-col items-center text-center lg:max-w-3xl">
                  {data.ceo && (
                    <>
                      {data.ceo.image && (
                        <img
                          className="mb-7 size-52 rounded-full"
                          src={data.ceo.image}
                          alt={data.ceo.name ?? ""}
                        />
                      )}
                      {data.ceo.name && (
                        <p className="text-text-dark font-semibold">
                          {data.ceo.name}
                        </p>
                      )}
                      {data.ceo.role && (
                        <p className="text-text-dark text-sm">
                          {data.ceo.role}
                        </p>
                      )}
                    </>
                  )}
                  <div
                    className="content text-h6 mx-auto mt-12 mb-17 text-left"
                    dangerouslySetInnerHTML={{ __html: data.letter }}
                  />
                  {data.letter_points?.length > 0 && (
                    <>
                      <div className="text-h6 text-text-dark mb-7 text-center font-semibold">
                        {data.letter_points_title ?? "Here's how we do it:"}
                      </div>
                      <div className="vertical-bg-line relative flex flex-col gap-y-7">
                        {data.letter_points.map((point) => (
                          <div
                            className="border-border from-border to-body text-text-dark relative z-10 flex w-full items-center justify-center gap-x-2 rounded-full border bg-linear-to-tl px-8 py-2.5 font-semibold"
                            key={point}
                          >
                            {point}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {data.closing_content && (
                    <p className="text-h6 mt-15">{data.closing_content}</p>
                  )}
                  {data.button?.enable && data.button.link && (
                    <SmartLink
                      href={data.button.link}
                      className="btn btn-primary mt-12 py-4"
                    >
                      {data.button.label}
                    </SmartLink>
                  )}
                </div>
              </div>
            </div>
            <hr className="h-px border-0 bg-linear-to-r from-transparent from-3% via-white/40 to-transparent to-97%" />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 grid size-full translate-y-10 place-items-center">
        <div className="from-primary/40 size-180 rounded-full bg-radial from-0% to-transparent to-70% xl:size-300" />
      </div>
    </section>
  );
}

export function TrustedBrands({ data }) {
  if (!data.enable) return null;

  return (
    <section className="section-sm pt-16 xl:pt-20">
      <div className="container">
        <p className="text-text-light mb-10 text-center">
          <RichText>{data.title}</RichText>
        </p>
        <div
          className="flex flex-wrap items-center justify-center gap-10 xl:gap-x-16 [&>img]:lg:h-8"
          data-trusted-brands-images={JSON.stringify(
            data.images.map((image) => image.src),
          )}
        ></div>
      </div>
    </section>
  );
}

export function Testimonials({ data }) {
  if (!data.enable) return null;

  return (
    <section className="section relative">
      <div className="container">
        <div className="section-container">
          <div className="section-intro centralize">
            <h2 className="title hasHighlight">
              <RichText>{data.title}</RichText>
            </h2>
          </div>
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {data.testimonials.map((item) => (
              <article
                className="border-border bg-light/60 overflow-hidden rounded-2xl border"
                key={item.name}
              >
                <img
                  className="aspect-video w-full object-cover"
                  src={item.poster}
                  alt={`${item.name} testimonial preview`}
                />
                <div className="p-6">
                  <p className="text-text-dark mb-5">“{item.content}”</p>
                  <h3 className="text-h5">{item.name}</h3>
                  <p>{item.designation}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 grid place-items-center">
        <div className="from-primary/25 size-180 rounded-full bg-radial to-transparent blur-2xl xl:size-225" />
      </div>
    </section>
  );
}

export function CampaignShowcase({ data }) {
  if (!data?.enable) return null;

  return (
    <section className="section bg-light/30 overflow-hidden">
      <div className="container">
        <div className="section-container">
          <div className="section-intro centralize mb-12">
            <span className="badge mb-4">Our Showcase</span>
            <h2 className="title hasHighlight">
              <RichText>{data.title ?? "Live Campaign Showcase"}</RichText>
            </h2>
            <p className="subtitle">{data.description}</p>
          </div>
        </div>
      </div>
      {/* full-bleed: 3 rows -> L to R, R to L, L to R */}
      <ShowcaseMarquee rows={data.rows} />
    </section>
  );
}

export function ClientVoices({ data }) {
  if (!data?.enable) return null;

  return (
    <section className="section bg-light/30 relative overflow-hidden">
      <div className="container">
        <div className="section-container">
          <div className="section-intro centralize mb-12">
            <span className="badge mb-4">Client Voices</span>
            <h2 className="title hasHighlight">
              <RichText>
                {data.title ?? "Loved by Businesses Across India"}
              </RichText>
            </h2>
            <p className="subtitle">{data.description}</p>
          </div>
        </div>
      </div>
      {/* full-bleed: 2 rows -> L to R, R to L */}
      <VoicesMarquee rows={data.rows} />

      <div className="pointer-events-none absolute inset-0 -z-10 grid place-items-center opacity-30">
        <div className="from-primary/20 size-225 rounded-full bg-radial to-transparent blur-3xl" />
      </div>
    </section>
  );
}

export function FAQ({ data }) {
  if (!data.enable) return null;

  return (
    <section className="faq-showcase section">
      <div className="container">
        <div className="faq-showcase-layout">
          <div className="faq-showcase-intro">
            <h2 className="faq-showcase-title">
              <RichText>{data.title}</RichText>
            </h2>
            <p className="faq-showcase-description">{data.description}</p>
            {data.button?.enable && data.button.link && (
              <SmartLink href={data.button.link} className="faq-showcase-cta">
                {data.button.label}
                <span aria-hidden="true">→</span>
              </SmartLink>
            )}
            <div className="faq-showcase-proof">
              <div className="faq-showcase-avatars" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
              <p>
                <strong>One team for every platform</strong>
                <span>
                  We handle your Instagram, LinkedIn, WhatsApp and more.
                </span>
              </p>
            </div>
          </div>
          <div className="faq-showcase-list">
            {data.items.map((item, index) => {
              const Icon = faqIcons[index % faqIcons.length];
              return (
                <details className="faq-showcase-item" key={item.question}>
                  <summary className="faq-showcase-summary">
                    <span className="faq-showcase-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="faq-showcase-question">
                      {item.question}
                    </span>
                    <FiChevronDown
                      className="faq-showcase-chevron"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="faq-showcase-answer">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: marked.parseInline(item.answer),
                      }}
                    />
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
