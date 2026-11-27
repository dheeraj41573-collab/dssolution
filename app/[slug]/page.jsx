import { notFound } from "next/navigation";
import { getContent, getContentCollection } from "@/lib/nextContent";
import { Markdown, PageHeader } from "@/components/Content";
import { getPageMetadata } from "@/lib/pageMetadata";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getContentCollection("pages"))
    .filter(
      ({ id }) =>
        ![
          "-index",
          "careers",
          "case-study",
          "elements",
          "features",
          "integrations",
          "payment",
          "term-and-condition",
          "our-portfolio",
          "portfolio",
        ].includes(id),
    )
    .map(({ id }) => ({ slug: id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data } = await getContent("pages", slug);
  return getPageMetadata(`/${slug}`, {
    title: data.meta_title || data.title,
    description: data.description,
    robots: data.draft ? { index: false, follow: false } : undefined,
  });
}

export default async function ContentPage({ params }) {
  const { slug } = await params;
  let page;
  try {
    page = await getContent("pages", slug);
  } catch (error) {
    if (error?.code === "ENOENT") notFound();
    throw error;
  }

  return (
    <>
      <PageHeader title={page.data.title} subtitle={page.data.description} />
      <section className="section pt-0">
        <div className="container">
          <div className="row justify-center">
            <div className="lg:col-10">
              <Markdown>{page.body}</Markdown>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
