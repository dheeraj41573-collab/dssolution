import { getContent } from "@/lib/nextContent";
import { CallToAction, PageHeader, RichText } from "@/components/Content";
import { FAQ } from "@/components/Sections";
import PricingPlans from "@/components/PricingPlans";
import { getPageMetadata } from "@/lib/pageMetadata";

export async function generateMetadata() {
  const { data } = await getContent("pricing", "-index");
  return getPageMetadata("/pricing", {
    title: data.meta_title ?? data.title,
    description: data.description,
  });
}

export default async function PricingPage() {
  const [{ data }, faq] = await Promise.all([
    getContent("pricing", "-index"),
    getContent("sections", "faq"),
  ]);

  return (
    <>
      <PageHeader
        title={data.page_header.title}
        subtitle={data.page_header.content}
      />
      <section className="section pt-0">
        <div className="container">
          <div className="section-container">
            <div className="section-content">
              <div className="pricing-container">
                <PricingPlans plans={data.plans} labels={data.toggler} />
              </div>
            </div>
          </div>
        </div>
      </section>
      {data.comparison.enable && (
        <section className="section">
          <div className="container">
            <div className="section-intro centralize">
              <h2 className="title hasHighlight">
                <RichText>{data.comparison.title}</RichText>
              </h2>
            </div>
            <div className="border-border bg-light/70 overflow-x-auto rounded-3xl border">
              <table className="w-full min-w-180 text-left">
                <thead>
                  <tr>
                    {data.comparison.headers.map((header) => (
                      <th className="text-text-dark p-5" key={header.label}>
                        {header.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.comparison.rows.map((row) => (
                    <tr className="border-border border-t" key={row.feature}>
                      <th className="p-5 font-medium">{row.feature}</th>
                      {row.values.map((value, index) => (
                        <td
                          className="p-5 text-center"
                          key={`${row.feature}-${index}`}
                        >
                          {typeof value === "boolean"
                            ? value
                              ? "✓"
                              : "—"
                            : value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
      <FAQ data={faq.data} />
      <CallToAction />
    </>
  );
}
