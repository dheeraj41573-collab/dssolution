"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import HeroBackdrop from "@/components/HeroBackdrop";

export default function LegalDirectory({ categories, topics, services }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All legal support");

  const filteredServices = useMemo(() => {
    const term = query.trim().toLowerCase();
    return services.filter((service) => {
      const categoryMatch =
        activeCategory === "All legal support" ||
        service.category === activeCategory;
      const haystack =
        `${service.title} ${service.category} ${service.summary} ${service.tags.join(" ")}`.toLowerCase();
      return categoryMatch && (!term || haystack.includes(term));
    });
  }, [activeCategory, query, services]);

  return (
    <>
      <section className="legal-hero">
        <HeroBackdrop />
        <div className="legal-hero-inner container">
          <div className="legal-hero-copy">
            <span className="legal-kicker">
              <i aria-hidden="true" /> BUSINESS LEGAL SUPPORT
            </span>
            <h1>
              Clearer legal steps
              <br />
              <em>for what you’re building.</em>
            </h1>
            <p>
              Find practical guidance for protecting ideas, structuring your
              business and navigating important agreements.
            </p>
            <form
              className="legal-search"
              role="search"
              onSubmit={(event) => event.preventDefault()}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 5 5" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search legal support..."
                aria-label="Search legal support"
              />
              {query && (
                <button
                  type="button"
                  className="legal-search-clear"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
              <button className="legal-search-submit" type="submit">
                Search <span aria-hidden="true">→</span>
              </button>
            </form>
            <div className="legal-popular">
              <span>POPULAR:</span>
              {topics.map((topic) => (
                <button
                  type="button"
                  key={topic}
                  onClick={() => {
                    setQuery(topic);
                    setActiveCategory("All legal support");
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
          <div className="legal-hero-art">
            <img
              src="/images/legal-hero-illustration.svg"
              alt="Abstract illustration of a balanced legal scale and protected documents"
            />
            <div className="legal-art-note">
              <span>✦</span>
              <div>
                <strong>Make the next step clearer</strong>
                <small>Guidance built around your business</small>
              </div>
            </div>
          </div>
          <div className="legal-hero-rail">
            <span>IP &amp; BRAND</span>
            <i />
            <span>BUSINESS &amp; CONTRACTS</span>
            <i />
            <span>ADVISORY</span>
          </div>
        </div>
      </section>

      <section className="legal-directory section" id="legal-support">
        <div className="container">
          <div className="legal-directory-heading">
            <div>
              <span className="legal-section-kicker">
                EXPLORE LEGAL SUPPORT
              </span>
              <h2>Find the right place to start.</h2>
              <p>
                Choose a focus area or search for the topic you have in mind.
              </p>
            </div>
            <span className="legal-results-count">
              {filteredServices.length} areas to explore
            </span>
          </div>
          <div
            className="legal-category-filters"
            role="group"
            aria-label="Filter legal services by category"
          >
            {["All legal support", ...categories].map((category) => (
              <button
                type="button"
                key={category}
                className={activeCategory === category ? "active" : ""}
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          {filteredServices.length ? (
            <div className="legal-service-grid">
              {filteredServices.map((service, index) => (
                <article className="legal-service-card" key={service.title}>
                  <div className="legal-service-card-top">
                    <span className="legal-service-icon" aria-hidden="true">
                      {service.icon}
                    </span>
                    <span className="legal-service-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="legal-service-category">
                    {service.category}
                  </span>
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.title)}`}
                    className="legal-service-link"
                  >
                    Discuss this need <span aria-hidden="true">↗</span>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="legal-no-results">
              <span aria-hidden="true">⌕</span>
              <h3>No matching topics</h3>
              <p>Try a different keyword or clear your search.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All legal support");
                }}
              >
                Show all legal support
              </button>
            </div>
          )}
          <p className="legal-notice">
            Information on this page is for general orientation and is not a
            substitute for advice from a qualified legal professional.
          </p>
        </div>
      </section>
    </>
  );
}
