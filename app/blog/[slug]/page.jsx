import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { getContent } from "@/lib/nextContent";
import { RichText } from "@/components/Content";
import { getPageMetadata } from "@/lib/pageMetadata";
import MarkdownBody from "@/components/MarkdownBody";
import BlogCardMeta from "@/components/BlogCardMeta";
import { getSiteSettings } from "@/lib/siteSettings";
import JsonLd from "@/components/seo/JsonLd";
import { getPageSeo, getSeoSettings, parseSchemaJson } from "@/lib/seo";

export const dynamicParams = true;

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    value instanceof Date ? value : new Date(value),
  );
}

function getArticleHeadings(body) {
  const usedIds = new Set();
  const markdownHeadings = [...body.matchAll(/^##\s+(.+)$/gm)].map(
    ([, title]) => title,
  );
  const rawHeadings =
    markdownHeadings.length > 0
      ? markdownHeadings
      : [...body.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map(([, title]) =>
          title
            .replace(/<[^>]*>/g, "")
            .replace(/&amp;/gi, "&")
            .trim(),
        );

  return rawHeadings.map((rawTitle) => {
    const title = rawTitle.replace(/[*_`~]/g, "").trim();
    const baseId =
      title
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "article-section";
    let id = baseId;
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);
    return { id, title };
  });
}

function findClosingDiv(html, openingTagEnd) {
  const divTags = /<\/?div\b[^>]*>/gi;
  divTags.lastIndex = openingTagEnd;
  let depth = 1;
  let match;
  while ((match = divTags.exec(html))) {
    if (/^<\/div/i.test(match[0])) {
      depth -= 1;
      if (depth === 0) return match.index;
    } else {
      depth += 1;
    }
  }
  return -1;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatImportedFaqs(html) {
  let formatted = html.replace(
    /(<div\b[^>]*\bclass=(["'])[^"']*\bpxl-accordion\b[^"']*)\2/gi,
    "$1 blog-faq-list$2",
  );
  const itemPattern =
    /<div\b(?=[^>]*\bclass=(["'])[^"']*\bpxl--item\b[^"']*\1)[^>]*>/gi;
  const items = [];
  let itemMatch;
  while ((itemMatch = itemPattern.exec(formatted))) {
    const itemEnd = findClosingDiv(
      formatted,
      itemMatch.index + itemMatch[0].length,
    );
    if (itemEnd < 0) continue;

    const itemHtml = formatted.slice(itemMatch.index, itemEnd + 6);
    const titleMatch = itemHtml.match(
      /<span\b(?=[^>]*\bclass=(["'])[^"']*\bpxl-title--text\b[^"']*\1)[^>]*>([\s\S]*?)<\/span>/i,
    );
    const answerMatch =
      /<div\b(?=[^>]*\bclass=(["'])[^"']*\bpxl-accordion--content\b[^"']*\1)[^>]*>/i.exec(
        itemHtml,
      );
    if (!titleMatch || !answerMatch) continue;

    const answerStart = answerMatch.index + answerMatch[0].length;
    const answerEnd = findClosingDiv(itemHtml, answerStart);
    if (answerEnd < 0) continue;

    const question = titleMatch[2]
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const answer = itemHtml.slice(answerStart, answerEnd).trim();
    if (!question || !answer) continue;

    items.push({
      start: itemMatch.index,
      end: itemEnd + 6,
      html: `<details class="blog-faq-item"><summary>${escapeHtml(question)}</summary><div class="blog-faq-answer">${answer}</div></details>`,
    });
  }

  for (const item of items.reverse()) {
    formatted =
      formatted.slice(0, item.start) + item.html + formatted.slice(item.end);
  }
  return formatted;
}

export async function generateStaticParams() {
  return (await getBlogPosts()).map(({ id }) => ({ slug: id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data } = await getBlogPost(slug);
  return getPageMetadata(`/blog/${slug}`, {
    title: data.meta_title ?? data.title,
    description: data.description,
  });
}

export default async function BlogArticle({ params }) {
  const { slug } = await params;
  let post;
  try {
    post = await getBlogPost(slug);
  } catch (error) {
    if (error?.code === "ENOENT") notFound();
    throw error;
  }
  const [{ config, social }, allPosts, pageSeo, seoSettings] =
    await Promise.all([
      getSiteSettings(),
      getBlogPosts(),
      getPageSeo(`/blog/${slug}`),
      getSeoSettings(),
    ]);
  const related = allPosts.filter((entry) => entry.id !== slug).slice(0, 3);
  const headings = getArticleHeadings(post.body);
  let headingIndex = 0;
  const articleBody = post.body.trimStart();
  const parsedBody = articleBody.startsWith("<")
    ? articleBody
    : String(marked.parse(articleBody));
  const articleHtml = formatImportedFaqs(parsedBody).replace(
    /<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi,
    (_headingHtml, attributes, contents) => {
      const heading = headings[headingIndex];
      headingIndex += 1;
      if (!heading) return `<h2${attributes}>${contents}</h2>`;
      const cleanAttributes = attributes.replace(
        /\s+id\s*=\s*(["']).*?\1/i,
        "",
      );
      return `<h2${cleanAttributes} id="${heading.id}">${contents}</h2>`;
    },
  );
  const articleTags = [
    ...(post.data.tags ?? []),
    ...(post.data.categories ?? []),
  ].filter((tag, index, tags) => tags.indexOf(tag) === index);
  const pageSchemas = parseSchemaJson(pageSeo?.schemaJson);
  const publishedAt = post.data.date || post.createdAt || post.updatedAt;
  const modifiedAt = post.updatedAt || publishedAt;
  const publishedDate = publishedAt ? new Date(publishedAt) : null;
  const modifiedDate = modifiedAt ? new Date(modifiedAt) : null;
  const publishedIso =
    publishedDate && !Number.isNaN(publishedDate.getTime())
      ? publishedDate.toISOString()
      : undefined;
  const modifiedIso =
    modifiedDate && !Number.isNaN(modifiedDate.getTime())
      ? modifiedDate.toISOString()
      : undefined;
  const canonicalUrl =
    pageSeo?.canonicalUrl ||
    `${(seoSettings.siteUrl || config.site.base_url || "").replace(/\/+$/, "")}/blog/${slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.data.title,
    description: post.data.description,
    ...(post.data.image ? { image: [post.data.image] } : {}),
    ...(publishedIso ? { datePublished: publishedIso } : {}),
    ...(modifiedIso ? { dateModified: modifiedIso } : {}),
    author: { "@type": "Person", name: post.data.author || "Admin" },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  return (
    <>
      {!pageSchemas.length && <JsonLd schemas={[articleSchema]} />}
      <main className="blog-article-page">
        <section className="blog-article-header">
          <div className="container">
            <div className="blog-article-header-inner">
              <div className="blog-article-topline">
                <Link className="blog-back-link" href="/blog">
                  <span aria-hidden="true">←</span> Back to blog
                </Link>
                {(post.data.tag ?? post.data.categories?.[0]) && (
                  <span className="blog-article-category">
                    {post.data.tag ?? post.data.categories[0]}
                  </span>
                )}
                {post.data.read_time && (
                  <span className="blog-article-reading-time">
                    <span aria-hidden="true">◷</span> {post.data.read_time}
                  </span>
                )}
              </div>
              {articleTags.length > 0 && (
                <div className="blog-article-tags" aria-label="Article topics">
                  {articleTags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              )}
              <div className="blog-article-heading">
                <h1>
                  <RichText>{post.data.title}</RichText>
                </h1>
                {post.data.description && (
                  <p className="blog-article-description">
                    {post.data.description}
                  </p>
                )}
                <div className="blog-article-meta">
                  {post.data.author_image && (
                    <img
                      className="blog-author-avatar"
                      src={post.data.author_image}
                      alt={`${post.data.author} profile photo`}
                    />
                  )}
                  <span className="blog-author-name">
                    Posted by {post.data.author}
                  </span>
                  {post.data.date && (
                    <>
                      <span className="blog-meta-separator" aria-hidden="true">
                        ·
                      </span>
                      <time dateTime={new Date(post.data.date).toISOString()}>
                        {formatDate(post.data.date)}
                      </time>
                    </>
                  )}
                  {post.data.read_time && (
                    <>
                      <span className="blog-meta-separator" aria-hidden="true">
                        ·
                      </span>
                      <span>{post.data.read_time}</span>
                    </>
                  )}
                </div>
                <BlogCardMeta
                  className="blog-article-author-social"
                  socialLinks={social.floating}
                />
              </div>
              <figure
                className={`blog-featured-image ${post.data.image_fit === "contain" ? "blog-featured-image--contain" : ""}`}
              >
                <img
                  src={post.data.image ?? "/images/blog/featured-cover.png"}
                  alt={post.data.image_alt ?? post.data.title}
                />
                {post.data.image_caption && (
                  <figcaption>{post.data.image_caption}</figcaption>
                )}
              </figure>
            </div>
          </div>
        </section>
        <section className="blog-article-content-section">
          <div className="container">
            <div
              className={`blog-article-layout ${headings.length > 1 ? "has-toc" : ""}`}
            >
              {headings.length > 1 && (
                <nav className="blog-article-toc" aria-label="In this article">
                  <h2>In this article</h2>
                  <ol>
                    {headings.map((heading) => (
                      <li key={heading.id}>
                        <a href={`#${heading.id}`}>{heading.title}</a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              <article className="blog-article-body">
                <MarkdownBody
                  html={articleHtml}
                  className="blog-article-content"
                />
              </article>
            </div>
            <div className="blog-article-bottom-nav">
              <Link className="blog-back-link" href="/blog">
                <span aria-hidden="true">←</span> Back to all articles
              </Link>
            </div>
          </div>
        </section>
        {related.length > 0 && (
          <section className="blog-related-section">
            <div className="container">
              <div className="blog-related-heading">
                <span>KEEP READING</span>
                <h2>Read more articles</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {related.map((entry) => (
                  <article className="blog-related-card" key={entry.id}>
                    <div className="blog-related-image" aria-hidden="true">
                      <img
                        src={
                          entry.data.image ?? "/images/blog/featured-cover.png"
                        }
                        alt={`${entry.data.title} cover`}
                      />
                    </div>
                    <div className="blog-related-copy">
                      <h3>{entry.data.title}</h3>
                      <p>{entry.data.description}</p>
                      <Link href={`/blog/${entry.id}`}>
                        Read article <span aria-hidden="true">→</span>
                      </Link>
                      <BlogCardMeta
                        className="border-border mt-4 border-t pt-4"
                        author={entry.data.author}
                        socialLinks={social.floating}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
