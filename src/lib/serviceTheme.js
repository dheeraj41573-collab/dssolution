// Deterministic per-service identity: a colour family and a small set of layout
// variants, all derived from the slug. A service therefore looks the same on
// every visit, while different services fall into different visual rhythms
// instead of repeating one card grid down the page.

const PALETTES = [
  { accent: "#1769f5", accent2: "#6254d8" },
  { accent: "#0d9488", accent2: "#12b8d4" },
  { accent: "#db2777", accent2: "#8b5cf6" },
  { accent: "#ea580c", accent2: "#f59e0b" },
  { accent: "#2563eb", accent2: "#0ea5e9" },
  { accent: "#16a34a", accent2: "#0d9488" },
  { accent: "#7c3aed", accent2: "#c026d3" },
  { accent: "#0891b2", accent2: "#1769f5" },
];

// Services in the same category share a colour family, so the palette reads as
// a system rather than random; the layout variants below still differ per slug.
const CATEGORY_PALETTE = {
  "Search Engine Rank": 0,
  "Local Search": 1,
  "Paid Search": 3,
  "Social Acquisition": 2,
  "Social Growth": 6,
  "Design & Branding": 2,
  "Viral Content": 6,
  "Influencer Growth": 2,
  "Web Development": 4,
  "App Development": 4,
  "Digital Marketing": 0,
  "AI & Automation": 7,
  "Data & Analytics": 7,
  "Direct Marketing": 0,
  "Retention & CRM": 5,
  "B2B Acquisition": 4,
  "Ecommerce Growth": 3,
  "CRO & Funnels": 6,
};

export function hashText(text) {
  let value = 2166136261;
  const source = String(text || "");
  for (let index = 0; index < source.length; index += 1) {
    value ^= source.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

export function serviceTheme(slug, category) {
  const seed = hashText(slug);
  const paletteIndex = CATEGORY_PALETTE[category];
  const { accent, accent2 } =
    PALETTES[(paletteIndex ?? seed) % PALETTES.length];

  return {
    accent,
    accent2,
    // 0 => copy beside the artwork, 1 => copy over a full-bleed visual.
    heroVariant: seed % 2,
    // 0 => numbered grid, 1 => stacked rows, 2 => one feature card + grid.
    cardsVariant: (seed >>> 3) % 3,
    // 0 => numbered cards, 1 => vertical timeline.
    stepsVariant: (seed >>> 6) % 2,
    // 0 => prose in a panel, 1 => prose beside a sticky heading.
    proseVariant: (seed >>> 9) % 2,
    // Where to start reading the shared client testimonials.
    voiceOffset: seed % 16,
  };
}
