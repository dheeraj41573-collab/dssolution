import Link from "next/link";
import { getContent } from "@/lib/nextContent";
import { getBlogPosts } from "@/lib/blog";
import BlogCardMeta from "@/components/BlogCardMeta";
import { CallToAction, PageHeader, RichText } from "@/components/Content";
import { getSiteSettings } from "@/lib/siteSettings";
import BlogSearch from "./BlogSearch";
import { getPageMetadata } from "@/lib/pageMetadata";

function formatDate(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

function getPostTimestamp(post) {
  for (const value of [post.createdAt, post.updatedAt, post.data.date]) {
    const timestamp = Date.parse(value ?? "");
    if (Number.isFinite(timestamp)) return timestamp;
  }
  return 0;
}

export async function generateMetadata() {
  const { data } = await getContent("blog", "-index");
  return getPageMetadata("/blog", {
    title: data.meta_title ?? data.title,
    description: data.description,
  });
}

export default async function BlogPage({ searchParams }) {
  const params = await searchParams;
  const initialQuery = typeof params?.search === "string" ? params.search : "";
  const [{ data: page }, posts, { social }] = await Promise.all([
    getContent("blog", "-index"),
    getBlogPosts(),
    getSiteSettings(),
  ]);
  posts.sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));
  const featured = posts[0];

  return (
    <>
      <PageHeader title={page.page_header?.title ?? page.title} />
      {featured && (page.featured_post?.enable ?? true) && (
        <section className="section pt-0">
          <div className="container">
            <div className="grid gap-4 lg:grid-cols-[1fr_1.03fr]">
              <Link
                className="overflow-hidden rounded-2xl border border-white/10"
                href={`/blog/${featured.id}`}
              >
                <img
                  className="h-full w-full object-cover"
                  src={featured.data.image ?? "/images/blog/featured-cover.png"}
                  alt={featured.data.title}
                />
              </Link>
              <div className="border-border bg-light/60 flex flex-col justify-center rounded-2xl border p-8">
                <p className="text-primary mb-4">
                  {featured.data.tag ?? "Popular"}
                </p>
                <h2 className="text-h3 mb-4">
                  <Link href={`/blog/${featured.id}`}>
                    <RichText>{featured.data.title}</RichText>
                  </Link>
                </h2>
                <p className="mb-6">{featured.data.description}</p>
                <p className="text-text-light text-sm">
                  {formatDate(featured.data.date)} · {featured.data.read_time}
                </p>
                <BlogCardMeta
                  className="mt-5"
                  author={featured.data.author}
                  socialLinks={social.floating}
                />
              </div>
            </div>
            <hr className="mt-16 h-px border-0 bg-linear-to-r from-transparent via-white/15 to-transparent" />
          </div>
        </section>
      )}
      {page.latest_posts?.enable !== false && (
        <section className="section pt-10 lg:pt-14">
          <div className="container">
            <h2 className="text-h2 mb-8 text-center">
              {page.latest_posts?.title ?? "Latest Content From Us"}
            </h2>
            <BlogSearch
              posts={posts}
              featuredPostId={featured?.id}
              socialLinks={social.floating}
              initialQuery={initialQuery}
            />
          </div>
        </section>
      )}
      <CallToAction />
    </>
  );
}
