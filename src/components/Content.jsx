import Link from "next/link";
import { marked } from "marked";
import { getContent } from "@/lib/nextContent";
import MarkdownBody from "@/components/MarkdownBody";
import { linkifyEmails } from "@/lib/utils/linkifyEmails";

export function RichText({ children, className }) {
  const html = marked.parseInline(children ?? "");
  const safeHtml = linkifyEmails(html);
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}

export function SmartLink({ href, className, children }) {
  if (typeof href === "string" && href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export function Markdown({ children, className = "" }) {
  const html = marked.parse(children ?? "");
  return <MarkdownBody html={html} className={className} />;
}

export function PageHeader({ title, subtitle }) {
  return (
    <section className="section-ph relative mb-0 overflow-hidden pb-28">
      <div className="relative container">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="hasHighlight mb-6">
            <RichText>{title}</RichText>
          </h1>
          {subtitle && <p className="text-text-light">{subtitle}</p>}
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
  );
}

export async function CallToAction() {
  const { data } = await getContent("sections", "call-to-action");
  if (!data.enable) return null;

  return (
    <section className="section">
      <div className="bg-light relative isolate container overflow-hidden rounded-4xl py-20">
        <div className="section-container">
          <div className="section-intro centralize">
            {data.badge && <p className="badge">{data.badge}</p>}
            <h2 className="title hasHighlight lg:col-7">
              <RichText>{data.title}</RichText>
            </h2>
            <p className="subtitle text-h6-sm lg:col-6">{data.description}</p>
            {data.button?.enable && data.button.link && (
              <SmartLink
                href={data.button.link}
                className="btn btn-primary mt-9"
              >
                {data.button.label}
              </SmartLink>
            )}
          </div>
        </div>
        <div
          className="absolute right-0 bottom-0 -z-10 size-120 translate-x-2/5 translate-y-1/2 blur-2xl xl:size-280"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 60%, white) 0%, var(--color-primary) 10%, transparent 60%)",
          }}
        />
        <div className="absolute top-1/2 -z-10 h-1/2 w-full -translate-y-1/2 overflow-hidden">
          <canvas
            className="heroSporeCanvas w-full"
            width={2000}
            height={2000}
          />
        </div>
      </div>
    </section>
  );
}
