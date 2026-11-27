"use client";

import Link from "next/link";

export default function PricingPlans({ plans, labels }) {
  return (
    <div className="relative z-10 grid items-stretch gap-7 md:grid-cols-2 xl:grid-cols-3">
      {plans.map((plan) => (
        <article
          className={`relative flex min-h-[560px] flex-col overflow-hidden rounded-3xl border px-7 py-9 text-left transition-all duration-300 ${
            plan.is_featured
              ? "border-primary/50 bg-light/80 ring-primary/10 shadow-[0_20px_60px_-32px_var(--color-primary)] ring-1"
              : "border-border bg-light/70 shadow-[0_12px_35px_-30px_var(--ds-strong)]"
          }`}
          key={plan.title}
        >
          {plan.is_featured && (
            <div className="bg-primary absolute top-6 right-6 rounded-full px-3 py-1.5 text-xs font-bold text-white">
              {plan.offer_text ?? "Most Popular"}
            </div>
          )}
          <div className="mb-8 pr-28">
            <span className="border-primary/20 bg-primary/8 text-primary inline-flex rounded-full border px-4 py-2 text-sm font-bold">
              Custom Price
            </span>
          </div>
          <h2 className="text-h5 text-text-dark mb-4">{plan.title}</h2>
          <p className="text-text-dark mb-7 min-h-[72px] leading-7">
            {plan.description}
          </p>
          <div className="mt-auto">
            {plan.button.enable && (
              <Link
                href="/contact"
                className="btn btn-primary mb-8 block w-full cursor-pointer text-center"
              >
                Contact Now
              </Link>
            )}
            <div className="text-text-dark mb-5 font-bold">
              Features Included
            </div>
            <ul className="space-y-3.5">
              {plan.features.map((feature) => (
                <li
                  className="flex items-start gap-x-3 text-sm leading-6"
                  key={feature.label}
                >
                  <span
                    className={
                      feature.included
                        ? "bg-primary/10 text-primary flex size-5 shrink-0 items-center justify-center rounded-full"
                        : "bg-border/60 text-text-light flex size-5 shrink-0 items-center justify-center rounded-full"
                    }
                    aria-hidden="true"
                  >
                    {feature.included ? "✓" : "—"}
                  </span>
                  <span>{feature.label}</span>
                  {feature.tooltip && (
                    <span
                      className="text-text-light mt-0.5 text-sm"
                      title={feature.tooltip}
                    >
                      ⓘ
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}
