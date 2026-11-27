// Splits the flat, sanitised service HTML (h2 / h3 / h5 / p / img ...) that the
// WordPress importer stores in `Service.content` into sections the service page
// can lay out with Tailwind.
//
// It also cleans up leftovers from that import: placeholder testimonial blocks,
// foreign-agency copy, duplicate cards and review avatars. Real images are
// pulled out of the copy so the page can show them in a proper gallery instead
// of dropping them at random between paragraphs.

// Whole sections that belong to another company's theme and must never show.
// (Copy that merely mentions a stray name is fixed below instead.)
const BLOCKED_CONTENT = [/vintech/i];

// Sections that only exist because the old theme shipped placeholder reviews.
// They are dropped; real reviews come from `clientVoices`.
const TESTIMONIAL_HEADING =
  /\b(testimonial|testimonials|what our (customers|clients) say|customer reviews?|client reviews?|reviews?)\b/i;

// Section titles that clearly describe a process, used to validate numbered
// headings that carry their number inside the heading text ("1 Initial audit").
const PROCESS_HEADING =
  /\b(process|how (we|it) work|our approach|the steps|workflow|onboarding)\b/i;

const CTA_HEADING =
  /\b(ready (to|for)|let us guide|let[’']s (talk|work)|get started|start your project|start today)\b/i;

const BLOCK_RE =
  /<(h[1-6]|p|ul|ol|figure|table|blockquote)\b[^>]*>[\s\S]*?<\/\1>|<img\b[^>]*>|<hr\b[^>]*>/gi;

const IMG_RE = /<img\b[^>]*>/gi;
const INLINE_UPLOAD_IMAGE = /\/api\/pages\/media\/[a-f\d]{24}(?:[?#]|$)/i;

// Placeholder / decorative images from the old theme: review avatars, partner
// logos and icons. Never useful next to real copy.
const JUNK_IMG =
  /(testi|avartar|avatar|galery|gallery|parner|partner|logo|icon)/i;

// Copy fixes for typos and leftover names in the imported pages.
const TEXT_FIXES = [
  [/DS\s+Soluiton/gi, "DS Solution"],
  [/\bDS\s+solution\b/g, "DS Solution"],
  [/\bDSSolutions\b/gi, "DS Solution"],
  [/DS\s+Solutions[’']s/gi, "DS Solution's"],
  [/\bCretu\b/g, "DS Solution"],
  [/Rocket[’']s\s+SEO\s+specialists/gi, "our SEO specialists"],
];

function fixCopy(html) {
  let out = String(html ?? "");
  for (const [pattern, replacement] of TEXT_FIXES) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

export function stripTags(html = "") {
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(parseInt(code, 16)),
    )
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitize(html) {
  return fixCopy(
    String(html || "")
      .replace(/<(script|style|iframe|object|embed)\b[\s\S]*?<\/\1>/gi, "")
      .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(/javascript:/gi, "")
      // Off-site and dead links become plain text; on-site links are kept.
      .replace(
        /<a\b[^>]*href\s*=\s*["'](?!#|\/)[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi,
        "$1",
      )
      .replace(/<a\b(?:\s+href\s*=\s*["']#["'])?\s*>([\s\S]*?)<\/a>/gi, "$1"),
  );
}

// Pull every usable image out of a chunk and drop the <img> tags from it.
function pullImages(html, images) {
  return String(html).replace(IMG_RE, (tag) => {
    const src = (tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i) || [])[1];
    const alt = (tag.match(/\balt\s*=\s*["']([^"']*)["']/i) || [])[1] || "";
    if (src && INLINE_UPLOAD_IMAGE.test(src)) return tag;
    if (
      src &&
      alt.trim() &&
      /^(\/|https?:)/i.test(src) &&
      !JUNK_IMG.test(`${src} ${alt}`) &&
      !images.some((item) => item.src === src)
    ) {
      images.push({ src, alt });
    }
    return "";
  });
}

function tokenize(html, images) {
  const re = new RegExp(BLOCK_RE.source, "gi");
  const tokens = [];
  let last = 0;
  let match;

  const pushLoose = (chunk) => {
    const rest = pullImages(chunk, images);
    const text = stripTags(rest);
    if (text) tokens.push({ tag: "p", html: `<p>${rest.trim()}</p>`, text });
  };

  while ((match = re.exec(html))) {
    if (match.index > last) pushLoose(html.slice(last, match.index));
    const raw = match[0];
    const isImg = raw.toLowerCase().startsWith("<img");
    const tag = isImg ? "img" : (match[1] || "hr").toLowerCase();
    if (isImg) {
      const imageHtml = pullImages(raw, images);
      if (imageHtml) tokens.push({ tag, html: imageHtml, text: "" });
    } else {
      const rest = pullImages(raw, images);
      tokens.push({ tag, html: rest, text: stripTags(rest) });
    }
    last = re.lastIndex;
  }
  if (last < html.length) pushLoose(html.slice(last));
  return tokens.filter((token) => token.html || token.text);
}

const isHeading = (tag) => /^h[1-6]$/.test(tag);

// A short label paragraph right before an <h2>, for example "Our Service".
function isEyebrow(token) {
  if (!token || token.tag !== "p") return false;
  const words = token.text.split(" ").filter(Boolean);
  return (
    token.text.length > 0 &&
    token.text.length <= 32 &&
    words.length <= 4 &&
    !/[,.!?:;]/.test(token.text)
  );
}

const demote = (html) => html.replace(/<(\/?)h[4-6]\b/gi, "<$1h3");

function slugify(text, fallback) {
  const slug = String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

const normKey = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// Imported card bodies often repeat the heading as their first sentence.
// Remove that repeat so the card does not say everything twice.
function stripLeadingTitle(html, title) {
  if (!title || !html) return html;
  const index = html.indexOf(title);
  if (index === -1) return html;
  const before = html.slice(0, index);
  if (!/^(\s|<br\s*\/?>)*$/i.test(before)) return html;
  return html
    .slice(index + title.length)
    .replace(/^(\s|<br\s*\/?>)+/i, "")
    .trim();
}

// Tidy the <br> tags the old theme used around list and heading blocks.
function tidyBreaks(html) {
  let out = String(html);
  for (let i = 0; i < 3; i += 1) {
    out = out
      .replace(/(<(?:ul|ol|li|h[1-6]|p)\b[^>]*>)(?:\s|<br\s*\/?>)+/gi, "$1")
      .replace(/(?:\s|<br\s*\/?>)+(<\/(?:ul|ol|li|h[1-6]|p)>)/gi, "$1");
  }
  return out;
}

// A heading whose text is only a number, e.g. <h5>1</h5>.
const numberHeading = (block) =>
  isHeading(block.tag) && /^\d{1,2}$/.test(block.text);

// A heading that carries its own step number, e.g. "<h3>1 Initial audit</h3>".
function embeddedStep(block) {
  if (!isHeading(block.tag)) return null;
  const match = /^(\d{1,3})\s*[.)\-–—:]?\s+(\D.{2,})/.exec(block.text);
  return match ? { number: match[1], title: match[2].trim() } : null;
}

function buildSection(raw, index) {
  const { eyebrow, title, blocks } = raw;
  const allText = [title, ...blocks.map((block) => block.text)].join(" ");
  if (BLOCKED_CONTENT.some((pattern) => pattern.test(allText))) return null;
  if (title && TESTIMONIAL_HEADING.test(title)) return null;
  if (!blocks.length) return null;

  const base = {
    id: slugify(title, `section-${index + 1}`) + `-${index + 1}`,
    eyebrow,
    title,
  };

  // 1) Numbered steps, either as <h5>1</h5> headings or numbered headings.
  const separateCount = blocks.filter(numberHeading).length;
  const embeddedCount = blocks.filter(embeddedStep).length;
  const looksLikeProcess =
    separateCount >= 1
      ? blocks.filter((block) => numberHeading(block) || embeddedStep(block))
          .length >= 2
      : embeddedCount >= 2 &&
        (PROCESS_HEADING.test(title || "") || embeddedCount >= 3);

  if (looksLikeProcess) {
    const intro = [];
    const steps = [];
    let current = null;
    for (const block of blocks) {
      const embedded = embeddedStep(block);
      if (numberHeading(block)) {
        current = { number: block.text.padStart(2, "0"), title: "", html: [] };
        steps.push(current);
      } else if (embedded) {
        current = {
          number: embedded.number.padStart(2, "0"),
          title: embedded.title,
          html: [],
        };
        steps.push(current);
      } else if (current && isHeading(block.tag) && !current.title) {
        current.title = block.text;
      } else if (current) {
        current.html.push(block.html);
      } else {
        intro.push(block.html);
      }
    }
    const filled = steps.filter((step) => step.title);
    if (filled.length >= 2) {
      return {
        ...base,
        kind: "steps",
        intro: intro.join(""),
        steps: filled.map((step) => ({
          ...step,
          html: tidyBreaks(stripLeadingTitle(step.html.join(""), step.title)),
        })),
      };
    }
  }

  // 2) Cards: two or more <h3>/<h4> blocks, each with its own text.
  if (
    blocks.filter((block) => block.tag === "h3" || block.tag === "h4").length >=
    2
  ) {
    const intro = [];
    const cards = [];
    let current = null;
    for (const block of blocks) {
      if (block.tag === "h3" || block.tag === "h4") {
        // A heading that is really a call to action is not a card.
        if (CTA_HEADING.test(block.text)) {
          current = null;
          continue;
        }
        current = { title: block.text, html: [] };
        cards.push(current);
      } else if (current) {
        current.html.push(block.html);
      } else {
        intro.push(block.html);
      }
    }

    const built = cards.map((card) => ({
      title: card.title,
      html: tidyBreaks(stripLeadingTitle(card.html.join(""), card.title)),
    }));

    // Cards with the same heading are the same point written twice, so their
    // copy is merged into a single card instead of repeated.
    const merged = [];
    const byTitle = new Map();
    for (const card of built) {
      const key = normKey(card.title) || normKey(stripTags(card.html));
      if (!key) continue;
      if (byTitle.has(key)) {
        const target = merged[byTitle.get(key)];
        if (card.html) {
          target.html = target.html
            ? `${target.html}<br><br>${card.html}`
            : card.html;
        }
      } else {
        byTitle.set(key, merged.length);
        merged.push({ title: card.title, html: card.html });
      }
    }

    if (merged.length >= 2) {
      // A "process" written as plain headings still reads best as numbered steps.
      if (PROCESS_HEADING.test(title || "")) {
        return {
          ...base,
          kind: "steps",
          intro: intro.join(""),
          steps: merged.map((card, stepIndex) => ({
            number: String(stepIndex + 1).padStart(2, "0"),
            title: card.title,
            html: card.html,
          })),
        };
      }
      return {
        ...base,
        kind: "cards",
        intro: intro.join(""),
        cards: merged,
      };
    }
  }

  // 3) Everything else is readable prose.
  return {
    ...base,
    kind: "prose",
    html: demote(tidyBreaks(blocks.map((block) => block.html).join(""))),
  };
}

export function splitServiceContent(rawHtml) {
  const images = [];
  const tokens = tokenize(sanitize(rawHtml), images);
  if (!tokens.length) return { sections: [], cta: null, images };

  // Closing call to action: a late heading such as "Ready To Transform ...".
  let body = tokens;
  let cta = null;
  const ctaIndex = tokens.findIndex(
    (token, index) =>
      index >= Math.floor(tokens.length / 2) &&
      /^h[1-3]$/.test(token.tag) &&
      CTA_HEADING.test(token.text),
  );
  if (ctaIndex > -1) {
    const firstText = tokens
      .slice(ctaIndex + 1)
      .find((token) => token.tag === "p" && token.text);
    // The importer removes the WordPress contact form, so text that points to
    // "the form below" is dropped and the page falls back to its default copy.
    const ctaText = firstText?.text || "";
    cta = {
      title: tokens[ctaIndex].text,
      text: /\b(below|form)\b/i.test(ctaText) ? "" : ctaText,
    };
    body = tokens.slice(0, ctaIndex);
  }

  const rawSections = [];
  let current = { eyebrow: "", title: "", blocks: [] };
  const flush = () => {
    if (current.blocks.length) rawSections.push(current);
  };
  for (const token of body) {
    if (token.tag === "h1" || token.tag === "h2") {
      let eyebrow = "";
      const previous = current.blocks[current.blocks.length - 1];
      if (isEyebrow(previous)) {
        eyebrow = previous.text;
        current.blocks.pop();
      }
      flush();
      current = { eyebrow, title: token.text, blocks: [] };
    } else {
      current.blocks.push(token);
    }
  }
  flush();

  // Old theme pages repeat the same service grid under two headings. Drop a
  // cards section when every one of its cards was already shown above.
  const seenCardTitles = new Set();
  const sections = [];
  for (const section of rawSections
    .map((section, index) => buildSection(section, index))
    .filter(Boolean)) {
    if (section.kind === "cards") {
      const keys = section.cards.map((card) => normKey(card.title));
      if (keys.length && keys.every((key) => seenCardTitles.has(key))) continue;
      keys.forEach((key) => seenCardTitles.add(key));
    }
    sections.push(section);
  }

  return { sections, cta, images };
}
