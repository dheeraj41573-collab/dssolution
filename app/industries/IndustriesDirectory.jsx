"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function IndustriesDirectory({ industries, categories }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All industries");

  const filteredIndustries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return industries.filter((industry) => {
      const matchesCategory =
        activeCategory === "All industries" ||
        industry.category === activeCategory;
      const searchable =
        `${industry.title} ${industry.category} ${industry.summary}`.toLowerCase();
      return (
        matchesCategory &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });
  }, [activeCategory, industries, query]);

  return (
    <>
      <section
        className="industry-controls"
        aria-label="Search and filter industries"
      >
        <label className="industry-search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 5 5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search an industry..."
            aria-label="Search industries"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </label>
        <div className="industry-filter-heading">
          <span>FILTER BY SECTOR</span>
          <span>
            {filteredIndustries.length} of {industries.length} industries
          </span>
        </div>
        <div
          className="industry-filters"
          role="group"
          aria-label="Filter industries by category"
        >
          {["All industries", ...categories].map((category) => {
            const active = activeCategory === category;
            return (
              <button
                type="button"
                key={category}
                aria-pressed={active}
                className={`industry-filter ${active ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      <div className="industry-results" aria-live="polite">
        <span>
          Showing <strong>{filteredIndustries.length}</strong>{" "}
          {filteredIndustries.length === 1 ? "industry" : "industries"}
        </span>
        {(query || activeCategory !== "All industries") && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveCategory("All industries");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredIndustries.length ? (
        <div className="industry-card-grid">
          {filteredIndustries.map((industry) => (
            <Link
              className="industry-card"
              href={`/industries/${industry.slug}`}
              key={industry.slug}
            >
              <span className="industry-card-top">
                <span className="industry-card-icon" aria-hidden="true">
                  {industry.icon}
                </span>
                <span className="industry-card-number">{industry.number}</span>
              </span>
              <span className="industry-card-category">
                {industry.category}
              </span>
              <h2>{industry.title}</h2>
              <p>{industry.summary}</p>
              <span className="industry-card-link">
                Explore industry <i aria-hidden="true">↗</i>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="industry-empty">
          <span aria-hidden="true">⌕</span>
          <h2>No matching industries</h2>
          <p>Try another keyword or choose a different sector.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveCategory("All industries");
            }}
          >
            Show all industries
          </button>
        </div>
      )}
    </>
  );
}
