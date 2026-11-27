import { getContent } from "@/lib/nextContent";
import { CallToAction, PageHeader } from "@/components/Content";
import { FAQ } from "@/components/Sections";
import ContactForm from "./ContactForm";
import { getPageMetadata } from "@/lib/pageMetadata";

function ContactIcon({ type }) {
  const paths = {
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    phone: (
      <path d="M7.2 3.8 9.5 8l-1.6 1.7a15 15 0 0 0 6.4 6.4l1.7-1.6 4.2 2.3-.7 3.3a2 2 0 0 1-2.2 1.5A18.5 18.5 0 0 1 2.4 6a2 2 0 0 1 1.5-2.2z" />
    ),
    address: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 shrink-0"
    >
      {paths[type] ?? paths.email}
    </svg>
  );
}

export async function generateMetadata() {
  const { data } = await getContent("contact", "-index");
  return getPageMetadata("/contact", {
    title: data.meta_title ?? data.title,
    description: data.description,
  });
}

export default async function ContactPage() {
  const [contact, faq] = await Promise.all([
    getContent("contact", "-index"),
    getContent("sections", "faq"),
  ]);
  const { data } = contact;

  return (
    <>
      <PageHeader
        title={data.page_header.title}
        subtitle={data.page_header.subtitle}
      />
      <section className="relative pt-0 pb-16 xl:pb-28">
        <div className="mx-auto w-full max-w-[1322px] px-4 sm:px-8">
          <div className="border-border bg-light grid grid-cols-1 overflow-hidden rounded-[30px] border shadow-[0_24px_70px_rgba(20,36,70,0.09)] lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
            <aside className="relative isolate overflow-hidden bg-gradient-to-br from-[#101b33] via-[#111f3d] to-[#0d3547] px-6 py-8 text-[#fff] sm:px-10 sm:py-10 lg:px-14 lg:py-14">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -bottom-32 -z-10 size-72 rounded-full border border-white/10 shadow-[0_0_0_28px_rgba(255,255,255,0.03),0_0_0_58px_rgba(255,255,255,0.02)]"
              />
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-[#8bdced] uppercase before:h-0.5 before:w-[22px] before:bg-current before:content-['']">
                Talk to our team
              </span>
              <h2 className="mt-[18px] mb-3 text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.12] font-bold tracking-[-0.045em] text-[#fff]">
                Let’s talk about what’s next.
              </h2>
              <p className="m-0 max-w-[430px] text-base leading-[1.75] text-[#c4d0e3]">
                Share a little about your goals. We’ll help you find the right
                next step for your business.
              </p>
              <div className="mt-8 grid gap-[11px]">
                {data.contact_info?.enable &&
                  data.contact_info.items.map((item) => {
                    const href =
                      item.link ??
                      (item.type === "email"
                        ? `mailto:${item.detail}`
                        : item.type === "phone"
                          ? `tel:${item.detail}`
                          : undefined);
                    return (
                      <a
                        key={`${item.type}-${item.title}`}
                        href={href}
                        target={item.type === "address" ? "_blank" : undefined}
                        rel={item.type === "address" ? "noreferrer" : undefined}
                        className="group grid min-w-0 grid-cols-[42px_minmax(0,1fr)_20px] items-center gap-[13px] rounded-[15px] border border-white/10 bg-white/5 p-3.5 text-[#fff] no-underline transition-[background,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#8bdced]/45 hover:bg-white/10 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#8bdced] max-[480px]:grid-cols-[38px_minmax(0,1fr)_16px] max-[480px]:gap-2.5 max-[480px]:p-3"
                      >
                        <span className="grid size-[42px] place-items-center rounded-xl border border-[#8bdced]/25 bg-[#12b8d4]/10 text-[#8bdced] max-[480px]:size-[38px]">
                          <ContactIcon type={item.type} />
                        </span>
                        <span className="grid min-w-0 gap-1">
                          <span className="text-[0.79rem] font-semibold text-[#d7e2f2]">
                            {item.title}
                          </span>
                          <span className="text-[0.94rem] leading-[1.45] font-medium [overflow-wrap:anywhere] text-[#fff]">
                            {item.detail}
                          </span>
                        </span>
                        <span
                          className="self-start text-base text-[#8bdced]"
                          aria-hidden="true"
                        >
                          ↗
                        </span>
                      </a>
                    );
                  })}
              </div>
              <p className="mt-6 text-[0.87rem] text-[#c4d0e3]">
                Clear answers, thoughtful guidance, and no pressure.
              </p>
            </aside>
            <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-[clamp(2rem,4vw,3.75rem)] lg:py-[clamp(2rem,4vw,3.75rem)]">
              <div className="mb-[27px]">
                <span className="text-primary inline-flex items-center gap-2 text-xs font-bold tracking-[0.12em] uppercase">
                  Start a conversation
                </span>
                <h2 className="text-text-dark mt-2 mb-3 text-[clamp(1.7rem,2.5vw,2.25rem)] leading-[1.12] font-bold tracking-[-0.045em]">
                  Tell us about your project
                </h2>
                <p className="text-text-light m-0 text-[0.98rem] leading-[1.65]">
                  Fill in the form and our team will get back to you as soon as
                  possible.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      <FAQ data={faq.data} />
      <CallToAction />
    </>
  );
}
