"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const categories = [
  "All",
  "Digital Marketing",
  "Social Growth",
  "Design & Branding",
  "Viral Content",
  "Data & Analytics",
  "Search Engine Rank",
  "Paid Search",
  "Social Acquisition",
  "Web Development",
  "App Development",
  "Direct Marketing",
  "Retention & CRM",
  "Influencer Growth",
  "B2B Acquisition",
  "Ecommerce Growth",
  "CRO & Funnels",
  "Local Search",
  "AI & Automation",
];

export default function ServicesDirectory({ services: initialServices }) {
  const [services, setServices] = useState(initialServices);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    let active = true;
    fetch("/api/services")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        const nextServices = Array.isArray(payload)
          ? payload
          : payload?.services || payload?.data;
        if (active && Array.isArray(nextServices)) setServices(nextServices);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const filteredServices = useMemo(
    () =>
      activeCategory === "All"
        ? services
        : services.filter(
            (service) =>
              service.category === activeCategory &&
              !service.isCategoryOverview,
          ),
    [activeCategory, services],
  );
  const availableCategories = useMemo(
    () => [
      ...new Set([
        ...categories,
        ...services.map((service) => service.category).filter(Boolean),
      ]),
    ],
    [services],
  );

  return (
    <>
      <div
        className="mb-8 flex gap-2 overflow-x-auto pb-3 lg:flex-wrap lg:justify-center"
        role="group"
        aria-label="Filter services by category"
      >
        {availableCategories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              aria-pressed={isActive}
              className={`services-category-filter shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${isActive ? "services-category-filter-active border-primary bg-primary text-white" : "border-border bg-light text-text hover:border-primary hover:text-white"}`}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          );
        })}
      </div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-text-light mb-0 text-sm" aria-live="polite">
          Showing {filteredServices.length}{" "}
          {filteredServices.length === 1 ? "service" : "services"}
        </p>
        <span className="text-text-light hidden text-xs sm:inline">
          Built around your goals
        </span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filteredServices.map((service) => (
          <Link
            className="service-card group relative flex min-h-[340px] flex-col overflow-hidden p-5 sm:p-6"
            href={`/services/${service.slug}`}
            key={service.slug}
          >
            <span className="service-card-top">
              <span className="service-card-category">
                <i aria-hidden="true" />
                {service.category}
              </span>
              <span className="service-card-orb" aria-hidden="true">
                <span>{service.icon}</span>
              </span>
            </span>
            <h2 className="service-card-title">{service.title}</h2>
            <p className="service-card-summary text-sm leading-6 text-white/80">
              {service.summary}
            </p>
            <span className="service-card-divider" aria-hidden="true" />
            <span className="service-card-price">
              {service.price || "Custom quote"}
            </span>
            <span className="service-card-footer">
              <span className="service-card-button" aria-hidden="true">
                FULL DETAILS <i aria-hidden="true">→</i>
              </span>
              <span className="service-card-plus" aria-hidden="true">
                +
              </span>
            </span>
          </Link>
        ))}
      </div>
      {filteredServices.length === 0 && (
        <p className="border-border bg-light text-text-light rounded-2xl border p-8 text-center">
          No services in this category yet.
        </p>
      )}
    </>
  );
}
