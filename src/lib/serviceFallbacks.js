// Hand-written content for the services that have no imported WordPress page.
// The shape matches what `splitServiceContent` returns, so the service page can
// render these with exactly the same components as the imported pages.

const FALLBACKS = {
  "digital-marketing": {
    labels: {
      prose: "Overview",
      cards: "What we manage",
      steps: "How we work",
    },
    order: ["prose", "cards", "steps"],
    prose: {
      title: "One connected plan for your digital growth",
      html: `<p>Digital marketing works best when each channel supports the same business goal. We connect your website, search visibility, paid campaigns and social presence into a practical plan, with clear priorities and measures for each activity.</p><p>We start with your audience and current performance, then focus effort on the channels that fit your goals and resources. Results are reviewed regularly so the plan can improve as we learn.</p>`,
    },
    cards: {
      items: [
        {
          title: "Audience and channel strategy",
          text: "Choose the channels and messages that fit your customers, goals and budget.",
        },
        {
          title: "Search and content",
          text: "Improve discovery with useful content and practical search optimisation.",
        },
        {
          title: "Paid campaign planning",
          text: "Coordinate campaign goals, landing pages, audiences and budgets across platforms.",
        },
        {
          title: "Social media support",
          text: "Build a recognisable presence with a consistent content and community plan.",
        },
        {
          title: "Measurement and reporting",
          text: "Track meaningful activity, leads and outcomes in a clear reporting rhythm.",
        },
        {
          title: "Ongoing optimisation",
          text: "Use performance reviews to adjust priorities and improve the next round of work.",
        },
      ],
    },
    steps: {
      items: [
        {
          title: "Understand your goals",
          text: "We learn about your audience, offer, current channels and what success means to your team.",
        },
        {
          title: "Set a focused plan",
          text: "We agree on channel priorities, key activities, owners and useful measures.",
        },
        {
          title: "Launch coordinated work",
          text: "Campaigns and content are delivered with consistent messaging and clear next steps.",
        },
        {
          title: "Review and improve",
          text: "We share results, identify what is working and refine the plan together.",
        },
      ],
    },
    faqs: [
      {
        question: "Which digital marketing channels do you cover?",
        answer:
          "We can coordinate search, content, paid campaigns, social media and website improvements, based on the channels that fit your goals.",
      },
      {
        question: "Can you work with our existing team?",
        answer:
          "Yes. We can lead the plan, collaborate with your in-house team, or focus on specific channels and deliverables.",
      },
      {
        question: "How do you measure progress?",
        answer:
          "We agree on practical measures such as qualified enquiries, campaign outcomes and relevant visibility before work begins.",
      },
    ],
    cta: {
      title: "Ready for a more connected digital marketing plan?",
      text: "Tell us what you want to improve and we will help you decide where to focus first.",
    },
  },
  "app-development": {
    labels: {
      prose: "Overview",
      cards: "What we build",
      steps: "How we work",
    },
    order: ["prose", "cards", "steps"],
    prose: {
      title: "Build an app around the way people actually work",
      html: `<p>A useful app starts with a clear problem, not a long feature list. We help shape the product, user journeys and technical approach before building a reliable application for your customers or team.</p><p>From an early MVP to an established product, we keep the experience clear, the scope practical and the next steps measurable.</p>`,
    },
    cards: {
      items: [
        {
          title: "Product discovery",
          text: "Clarify user needs, core workflows and the smallest useful first release.",
        },
        {
          title: "User experience and interface",
          text: "Plan accessible screens and journeys for the people who will use the app.",
        },
        {
          title: "Web and mobile applications",
          text: "Build responsive applications suited to your product, audience and delivery goals.",
        },
        {
          title: "Integrations and data",
          text: "Connect the application to the systems and services your workflows depend on.",
        },
        {
          title: "Testing and quality",
          text: "Check key flows, performance and reliability before release.",
        },
        {
          title: "Launch and ongoing improvements",
          text: "Support rollout and use feedback to guide future releases.",
        },
      ],
    },
    steps: {
      items: [
        {
          title: "Discover the product",
          text: "We map users, needs, constraints and the outcomes the application should support.",
        },
        {
          title: "Agree on scope and design",
          text: "We prioritise features and review the key user journeys before development starts.",
        },
        {
          title: "Build and validate",
          text: "The application is developed in focused stages and tested against agreed requirements.",
        },
        {
          title: "Launch and iterate",
          text: "We support release, gather feedback and plan improvements based on real usage.",
        },
      ],
    },
    faqs: [
      {
        question: "Can you help plan the app before development?",
        answer:
          "Yes. Product discovery and feature prioritisation are part of the process, so the first release focuses on the most important user needs.",
      },
      {
        question: "Do you build web and mobile apps?",
        answer:
          "We help choose a web, mobile or responsive approach based on your users, features and budget.",
      },
      {
        question: "Can you improve an existing application?",
        answer:
          "Yes. We can review the current product, identify usability or reliability issues and plan focused improvements.",
      },
    ],
    cta: {
      title: "Have an app idea or an existing product to improve?",
      text: "Share the problem you want the application to solve and we will help outline a practical next step.",
    },
  },
  /* ─────────────────────────── WhatsApp marketing ─────────────────────────── */
  "whatsapp-marketing": {
    labels: {
      prose: "Overview",
      cards: "What's included",
      steps: "How we work",
    },
    order: ["prose", "cards", "steps"],
    prose: {
      title: "A direct line your customers already check every day",
      html: `<p>WhatsApp is where people read a message within minutes rather than days. We help you earn a place in that inbox with messaging people genuinely opted in for — order updates, appointment reminders, restock alerts, offers and quick support — so your brand stays present without feeling intrusive.</p><p>Every journey is built around consent and clear expectations: what someone signed up for, how often they will hear from you, and an obvious way to stop. That keeps delivery quality high and keeps your number trusted.</p>`,
    },
    cards: {
      items: [
        {
          title: "Opt-in journeys",
          text: "Sign-up points across your website, store and ads that collect consent properly and record where it came from.",
        },
        {
          title: "Message templates and tone",
          text: "Reusable, approved templates for updates, offers and reminders, written to sound like your brand rather than a broadcast.",
        },
        {
          title: "Campaign and drip flows",
          text: "One-off announcements plus automated sequences: welcome, abandoned cart, reorder reminders and win-back.",
        },
        {
          title: "Two-way support workflows",
          text: "Simple triage so quick questions are answered in the chat and complex ones reach your team with full context.",
        },
        {
          title: "Segmentation and personalisation",
          text: "Audience groups based on behaviour, location or purchase history, so the right message reaches the right people.",
        },
        {
          title: "Consent-conscious measurement",
          text: "Read rates, replies and opt-outs reviewed together, so growth never comes at the cost of trust.",
        },
      ],
    },
    steps: {
      items: [
        {
          title: "Consent and audience review",
          text: "We audit how you collect contacts today and design a clean, compliant opt-in path.",
        },
        {
          title: "Journey and template planning",
          text: "We map the moments worth messaging about and draft the templates for each one.",
        },
        {
          title: "Launch and warm-up",
          text: "We begin with a focused group and a steady sending pace, watching quality signals before scaling.",
        },
        {
          title: "Review and refine",
          text: "Monthly reviews of engagement and opt-outs, with adjustments to timing, copy and frequency.",
        },
      ],
    },
    faqs: [
      {
        question: "Is WhatsApp marketing compliant?",
        answer:
          "Yes. We only message people who have opted in, keep a clear record of consent, provide an obvious way to stop, and follow Meta's business messaging policies.",
      },
      {
        question: "How often should we message customers?",
        answer:
          "Less than you might expect. We agree a realistic frequency up front and monitor opt-outs closely; if people start leaving, we adjust before scaling further.",
      },
      {
        question: "Can we use it for support as well as promotions?",
        answer:
          "Yes. Many clients run support, updates and campaigns from the same number, with workflows that route each type of message to the right person.",
      },
      {
        question: "Do you write the message copy?",
        answer:
          "We draft the templates and tone of voice with you, then refine them using read and reply data.",
      },
    ],
    cta: {
      title: "Ready to make WhatsApp a channel customers welcome?",
      text: "Tell us how you currently keep in touch with customers and we will suggest the journeys worth starting with.",
    },
  },

  /* ──────────────────────────── Email marketing ───────────────────────────── */
  "email-marketing": {
    labels: {
      cards: "What's included",
      prose: "Overview",
      steps: "How we work",
    },
    order: ["cards", "prose", "steps"],
    cards: {
      items: [
        {
          title: "Audience segmentation",
          text: "Contacts grouped by lifecycle stage, purchase behaviour and engagement so campaigns stop being one-size-fits-all.",
        },
        {
          title: "Lifecycle automation",
          text: "Welcome, onboarding, abandonment, re-engagement and win-back flows that run quietly in the background.",
        },
        {
          title: "Campaign and newsletter design",
          text: "Templates that render correctly in every major inbox and stay readable on small screens.",
        },
        {
          title: "Copy and content support",
          text: "Subject lines, preview text and body copy planned around what each segment needs to hear next.",
        },
        {
          title: "Deliverability work",
          text: "Authentication, list hygiene and sending practices that keep your mail out of spam folders.",
        },
        {
          title: "Reporting and testing",
          text: "Structured A/B tests on subject lines, send times and offers, reported in plain language you can act on.",
        },
      ],
    },
    prose: {
      title: "Email is still the channel you own",
      html: `<p>Social platforms change the rules whenever they like. Your email list does not. It is the one audience you can reach directly, repeatedly, and without paying for every impression.</p><p>We treat it that way — as a long-term asset you build patiently. That means fewer, better emails, sent to people who genuinely want them, each with a clear reason to open.</p>`,
    },
    steps: {
      items: [
        {
          title: "List and data audit",
          text: "We review how contacts are collected, how clean the list is, and where consent is recorded.",
        },
        {
          title: "Segmentation and flow design",
          text: "We define the segments worth keeping and map the automated journeys built around them.",
        },
        {
          title: "Design, copy and launch",
          text: "We build the templates, write the first campaigns, and bring the flows live one at a time.",
        },
        {
          title: "Test, measure, improve",
          text: "Ongoing tests and monthly reporting that show which emails genuinely earn attention and revenue.",
        },
      ],
    },
    faqs: [
      {
        question: "Will this work with our existing email platform?",
        answer:
          "Yes. We work inside the platform you already use, or recommend a change only when there is a clear deliverability or automation reason.",
      },
      {
        question: "How do you protect deliverability?",
        answer:
          "Through domain authentication, consistent sending patterns, careful list hygiene, and by removing contacts who never engage.",
      },
      {
        question: "How many emails should we send each month?",
        answer:
          "It depends on your audience and what you genuinely have to say. We start conservatively, watch engagement and opt-outs, then adjust.",
      },
      {
        question: "Can you write the campaigns for us?",
        answer:
          "We can write them end to end, or work alongside your team as a second pair of eyes on strategy and copy.",
      },
    ],
    cta: {
      title: "Ready to turn your list into a reliable channel?",
      text: "Share your current platform and goals, and we will outline the flows and campaigns worth starting with.",
    },
  },

  /* ──────────────────────── B2B lead generation ───────────────────────────── */
  "b2b-lead-generation": {
    labels: {
      prose: "Overview",
      steps: "How we work",
      cards: "What we deliver",
    },
    order: ["prose", "steps", "cards"],
    prose: {
      title: "Pipeline built on fit, not volume",
      html: `<p>B2B growth rarely fails because of too few leads. It fails because the wrong ones arrive, or because a promising conversation has nowhere to go after the first call. We work on both ends: sharper targeting at the front, and clearer follow-through at the back.</p><p>Everything starts with a specific ideal customer profile and an offer worth a busy decision-maker's time. From there we build the channels, content and follow-up that move a qualified prospect toward a real conversation.</p>`,
    },
    steps: {
      items: [
        {
          title: "Define the ideal customer",
          text: "We agree the industries, company sizes, roles and buying triggers worth pursuing.",
        },
        {
          title: "Sharpen the offer and message",
          text: "We test how the value proposition lands with real buyers before spending on reach.",
        },
        {
          title: "Build channels and landing pages",
          text: "Search, social, email and outbound, each pointing at a page designed for one specific audience.",
        },
        {
          title: "Qualify, hand over, review",
          text: "Leads are scored against agreed criteria, routed to your team with context, and reviewed against closed-won.",
        },
      ],
    },
    cards: {
      items: [
        {
          title: "Ideal customer profiles",
          text: "A documented picture of who to target, who to avoid, and the triggers that create buying intent.",
        },
        {
          title: "Offer and messaging tests",
          text: "Fast experiments on positioning and proof points before budget is committed to a channel.",
        },
        {
          title: "Landing pages that qualify",
          text: "Focused pages with the right form length, proof and next step for each campaign.",
        },
        {
          title: "Channel mix and targeting",
          text: "Paid search, paid social, content and outbound planned together rather than in separate silos.",
        },
        {
          title: "Lead scoring and routing",
          text: "Clear criteria for what counts as sales-ready, with automated routing and follow-up reminders.",
        },
        {
          title: "Funnel reporting",
          text: "Cost per qualified lead, conversion by stage and channel performance gathered into a single view.",
        },
      ],
    },
    faqs: [
      {
        question: "How long before we see qualified leads?",
        answer:
          "Early signal usually appears within the first weeks of testing. A stable, cost-efficient pipeline takes longer and improves as we learn which segments convert.",
      },
      {
        question: "Do you run cold outreach?",
        answer:
          "We can, with tight targeting and honest, relevant messaging. We would rather earn a reply than chase volume.",
      },
      {
        question: "How do you define a qualified lead?",
        answer:
          "Together with your sales team. We agree the criteria, score against them, and revisit them as closed-won data comes in.",
      },
      {
        question: "Can this work alongside our sales team?",
        answer:
          "Yes. We build the pipeline and the context; your team closes it. Handovers include full history so no one starts from scratch.",
      },
    ],
    cta: {
      title: "Ready to build a pipeline that matches your sales team?",
      text: "Tell us who your best customers are and we will show you where the next ones are likely to come from.",
    },
  },

  /* ─────────────────────────── Ecommerce growth ───────────────────────────── */
  "ecommerce-scaling": {
    labels: {
      cards: "Where we focus",
      steps: "Our process",
      prose: "Overview",
    },
    order: ["cards", "steps", "prose"],
    cards: {
      items: [
        {
          title: "Store and journey review",
          text: "A full pass over discovery, product pages, cart and checkout to find the friction costing you orders.",
        },
        {
          title: "Merchandising and offers",
          text: "Category structure, bundles and promotions that lift average order value without cheapening the brand.",
        },
        {
          title: "Acquisition campaigns",
          text: "Paid and organic campaigns aimed at the products and audiences that actually make money.",
        },
        {
          title: "Retention and repeat purchase",
          text: "Email and messaging flows that bring buyers back and raise lifetime value over time.",
        },
        {
          title: "Conversion testing",
          text: "Structured A/B tests on the pages and steps that carry the most revenue.",
        },
        {
          title: "Sales and margin reporting",
          text: "Revenue, margin, returns and contribution reported together, not just top-line sales.",
        },
      ],
    },
    steps: {
      items: [
        {
          title: "Baseline and diagnosis",
          text: "We map current performance by channel, category and product to find where growth is leaking.",
        },
        {
          title: "Prioritised roadmap",
          text: "Quick conversion wins alongside longer merchandising and retention projects, ranked by expected impact.",
        },
        {
          title: "Build and launch",
          text: "Changes go live in testable stages so results are attributable rather than guessed at.",
        },
        {
          title: "Scale what works",
          text: "Budget and effort shift toward the channels, products and flows that prove profitable.",
        },
      ],
    },
    prose: {
      title: "Growth that keeps its margin",
      html: `<p>Scaling revenue is easy if you are willing to lose money on every order. Doing it while protecting margin is the harder, more valuable job. We look at the whole equation — acquisition cost, average order value, returns and repeat purchase — before recommending where to spend.</p><p>The result is steadier growth, built on products and audiences that genuinely perform rather than on one-off spikes that flatten the following month.</p>`,
    },
    faqs: [
      {
        question: "Which platforms do you work with?",
        answer:
          "Shopify, WooCommerce and other mainstream platforms, plus custom storefronts. Recommendations are based on your data, not on a preferred tool.",
      },
      {
        question: "Do you manage paid ads as well?",
        answer:
          "Yes — acquisition sits inside the growth plan, so ad spend is judged on margin and repeat purchase rather than attributed revenue alone.",
      },
      {
        question: "How soon can we expect results?",
        answer:
          "Conversion fixes can show within weeks. Merchandising and retention improvements compound over the following months.",
      },
      {
        question: "Can you work with our in-house team?",
        answer:
          "Yes. We often provide the strategy, roadmap and reporting while your team handles day-to-day execution.",
      },
    ],
    cta: {
      title: "Ready to grow revenue without giving away margin?",
      text: "Share your store and your goals, and we will map the fastest credible route to profitable growth.",
    },
  },

  /* ────────────────────────── Dashboard & KPIs ────────────────────────────── */
  "dashboard-kpi-systems": {
    labels: { prose: "Overview", cards: "What we build", steps: "How we work" },
    order: ["prose", "cards", "steps"],
    prose: {
      title: "One view everyone can trust",
      html: `<p>Most teams do not have a data problem so much as a reporting problem. Numbers live in six tools, each telling a slightly different story, so decisions wait while someone reconciles spreadsheets by hand.</p><p>We define the handful of measures that actually drive your business, agree exactly how each one is calculated, and pull them into a single dashboard that updates itself. Then we make sure someone reads it and acts on it.</p>`,
    },
    cards: {
      items: [
        {
          title: "KPI definition workshop",
          text: "We agree on the metrics that matter, how each is calculated, and who owns them.",
        },
        {
          title: "Data source mapping",
          text: "Every number traced back to its source, with gaps and conflicts documented before building begins.",
        },
        {
          title: "Dashboard design and build",
          text: "Clean, focused layouts for different audiences: executives, marketing, sales or operations.",
        },
        {
          title: "Automated reporting",
          text: "Scheduled refreshes and delivered summaries, so no one rebuilds the same report every Monday.",
        },
        {
          title: "Anomaly and target alerts",
          text: "Notifications when a measure moves sharply or misses a target, while there is still time to react.",
        },
        {
          title: "Insight and action reviews",
          text: "Regular sessions that turn the numbers into a short list of decisions and owners.",
        },
      ],
    },
    steps: {
      items: [
        {
          title: "Questions before charts",
          text: "We start with the decisions you need to make, not with the tools.",
        },
        {
          title: "Define and document",
          text: "Metrics, definitions and sources written down so the whole team reads the same numbers.",
        },
        {
          title: "Build and validate",
          text: "The dashboard is built, then checked against trusted sources before anyone relies on it.",
        },
        {
          title: "Embed and improve",
          text: "We hand it over, train the team, and keep refining as your questions change.",
        },
      ],
    },
    faqs: [
      {
        question: "Which tools can you build in?",
        answer:
          "Looker Studio, Power BI, Tableau and spreadsheet-based dashboards, connected to the platforms and databases you already use.",
      },
      {
        question: "Our data is messy. Is that a blocker?",
        answer:
          "No — it is usually the starting point. Mapping and cleaning sources is part of the work, not a prerequisite.",
      },
      {
        question: "Will the dashboard stay accurate?",
        answer:
          "We document every definition and set up automated refreshes, then review periodically as your systems change.",
      },
      {
        question: "Can non-technical team members use it?",
        answer:
          "Yes. Dashboards are designed for the people who will read them, with plain labels and, where useful, written summaries.",
      },
    ],
    cta: {
      title: "Ready to make reporting something your team trusts?",
      text: "Tell us which decisions feel hardest right now and we will suggest the measures worth tracking first.",
    },
  },
};

const KIND_EYEBROW = { cards: "Capabilities", steps: "Approach" };

const toSection = (slug, kind, label, data) => {
  const isProse = kind === "prose";
  const base = {
    id: `${slug}-${kind}`,
    eyebrow: isProse ? label : KIND_EYEBROW[kind],
    title: isProse ? data.title : label,
  };
  if (kind === "cards") {
    return {
      ...base,
      kind: "cards",
      intro: "",
      cards: data.items.map((item) => ({
        title: item.title,
        html: `<p>${item.text}</p>`,
      })),
    };
  }
  if (kind === "steps") {
    return {
      ...base,
      kind: "steps",
      intro: "",
      steps: data.items.map((item, index) => ({
        number: String(index + 1).padStart(2, "0"),
        title: item.title,
        html: `<p>${item.text}</p>`,
      })),
    };
  }
  return { ...base, kind: "prose", html: data.html };
};

export function getServiceFallback(slug) {
  const data = FALLBACKS[slug];
  if (!data) return null;
  return {
    sections: data.order.map((kind) =>
      toSection(slug, kind, data.labels[kind], data[kind]),
    ),
    faqs: data.faqs,
    cta: data.cta,
  };
}
