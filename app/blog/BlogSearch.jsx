"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BlogCardMeta from "@/components/BlogCardMeta";

const PAGE_SIZE = 12;

function formatDate(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

export default function BlogSearch({
  posts,
  featuredPostId,
  socialLinks = [],
  initialQuery = "",
}) {
  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const filteredPosts = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    const archivePosts = searchTerm
      ? posts
      : posts.filter((post) => post.id !== featuredPostId);
    if (!searchTerm) return archivePosts;

    return archivePosts.filter((post) => {
      const searchableContent = [
        post.id,
        post.data.title,
        post.data.description,
        post.data.tag,
        post.data.author,
        ...(post.data.categories ?? []),
        ...(post.data.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(searchTerm);
    });
  }, [featuredPostId, posts, query]);
  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const visiblePosts = filteredPosts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const firstVisible = filteredPosts.length
    ? (currentPage - 1) * PAGE_SIZE + 1
    : 0;
  const lastVisible = Math.min(currentPage * PAGE_SIZE, filteredPosts.length);

  return (
    <>
      <label className="sr-only" htmlFor="blog-search">
        Search articles
      </label>
      <div className="border-border bg-light/60 mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3">
        <svg
          className="text-text-light size-5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m16 16 4 4" />
        </svg>
        <input
          className="text-text-dark placeholder:text-text-light min-w-0 flex-1 border-0 bg-transparent p-0 outline-none focus:ring-0"
          id="blog-search"
          onChange={(event) => {
            setQuery(event.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search articles, topics, or keywords..."
          type="search"
          value={query}
        />
        {query && (
          <button
            className="text-primary shrink-0 text-sm font-semibold"
            onClick={() => setQuery("")}
            type="button"
          >
            Clear
          </button>
        )}
      </div>
      <p className="text-text-light mb-5 text-sm" aria-live="polite">
        Showing {firstVisible}–{lastVisible} of {filteredPosts.length}{" "}
        {filteredPosts.length === 1 ? "article" : "articles"}
      </p>
      {filteredPosts.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visiblePosts.map((post) => (
              <article
                className="border-border bg-light/60 overflow-hidden rounded-2xl border transition hover:-translate-y-1 hover:shadow-lg"
                key={post.id}
              >
                <Link
                  className="block overflow-hidden"
                  href={`/blog/${post.id}`}
                  aria-label={`Read ${post.data.title}`}
                >
                  <img
                    className="aspect-video w-full object-cover transition duration-300 hover:scale-105"
                    src={post.data.image ?? "/images/blog/post-1.png"}
                    alt={`${post.data.title} cover`}
                    loading="lazy"
                    decoding="async"
                  />
                </Link>
                <div className="p-6">
                  <p className="text-primary mb-3 text-xs font-bold tracking-wide uppercase">
                    {post.data.tag ?? post.data.categories?.[0] ?? "Insights"}
                  </p>
                  <p className="text-text-light mb-3 text-sm">
                    {formatDate(post.data.date)}
                    {post.data.read_time && ` · ${post.data.read_time}`}
                  </p>
                  <h3 className="text-h5 mb-3">
                    <Link href={`/blog/${post.id}`}>{post.data.title}</Link>
                  </h3>
                  <p className="mb-5">{post.data.description}</p>
                  <Link
                    className="text-primary text-sm font-bold"
                    href={`/blog/${post.id}`}
                  >
                    Read article <span aria-hidden="true">→</span>
                  </Link>
                  <BlogCardMeta
                    className="border-border mt-5 border-t pt-4"
                    author={post.data.author}
                    socialLinks={socialLinks}
                  />
                </div>
              </article>
            ))}
          </div>
          {pageCount > 1 && (
            <nav
              className="mt-10 flex flex-wrap items-center justify-center gap-3"
              aria-label="Blog pages"
            >
              <button
                className="border-border text-text-dark hover:border-primary hover:text-primary rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                type="button"
              >
                Previous
              </button>
              <span className="text-text-light px-2 text-sm" aria-live="polite">
                Page {currentPage} of {pageCount}
              </span>
              <button
                className="border-border text-text-dark hover:border-primary hover:text-primary rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentPage === pageCount}
                onClick={() => setCurrentPage((page) => page + 1)}
                type="button"
              >
                Next
              </button>
            </nav>
          )}
        </>
      ) : (
        <p className="border-border bg-light/60 rounded-2xl border p-8 text-center">
          No articles match that search. Try another topic or keyword.
        </p>
      )}
    </>
  );
}
