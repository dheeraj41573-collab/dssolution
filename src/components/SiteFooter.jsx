import Link from "next/link";
import { marked } from "marked";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import defaultSocial from "@/config/social.json";
import { getFooterSettings } from "@/lib/siteSettings";

const socialIcons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  x: FaXTwitter,
  pinterest: FaPinterestP,
};

const headingClass =
  "text-text-dark mb-5 text-sm font-bold tracking-wider uppercase";
const linkClass =
  "text-text hover:text-primary text-[15px] transition-colors duration-200";
const pillClass =
  "border-border bg-body text-text hover:border-primary hover:bg-primary inline-block rounded-full border px-2 py-1 text-[11px] transition-colors duration-200 footer-location-pill sm:px-3 sm:text-[13px]";
const removedPagePaths = new Set([
  "/careers",
  "/elements",
  "/features",
  "/integrations",
  "/payment",
  "/term-and-condition",
]);

function visibleFooterLinks(links = []) {
  const visible = [];
  const seen = new Set();
  for (const link of Array.isArray(links) ? links : []) {
    let url = String(link?.url ?? "").replace(/\/+$/, "") || "/";
    const isPortfolioLink = ["/case-study", "/our-portfolio", "/portfolio"].includes(
      url,
    );
    if (url === "/case-study" || url === "/our-portfolio") url = "/portfolio";
    if (
      removedPagePaths.has(url) ||
      url.startsWith("/case-study/") ||
      seen.has(url)
    )
      continue;
    seen.add(url);
    visible.push({
      ...link,
      name: isPortfolioLink ? "Portfolio" : link.name,
      url,
    });
  }
  return visible;
}

function LinkList({ links }) {
  return (
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={`${link.name}-${link.url}`}>
          <Link href={link.url} className={linkClass}>
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function LocationPills({ items, prefix = "" }) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {items.map((location) => (
        <Link
          key={location.slug}
          href={`/digital-marketing/${location.slug}`}
          className={pillClass}
        >
          {prefix}
          {location.name}
        </Link>
      ))}
    </div>
  );
}

export default async function SiteFooter({ config, menu, social, locations }) {
  const footer = await getFooterSettings();
  const footerNavigation = visibleFooterLinks(menu.footer_primary);
  const footerServices = visibleFooterLinks(menu.footer_resource);
  const footerBottomLinks = visibleFooterLinks(footer.legalLinks);
  const footerSocials = social.floating.filter((item) =>
    ["facebook", "instagram", "linkedin", "youtube", "x", "pinterest"].includes(
      item.name.toLowerCase(),
    ),
  );
  for (const item of defaultSocial.footerOnly) {
    if (
      !footerSocials.some(
        (socialItem) =>
          socialItem.name.toLowerCase() === item.name.toLowerCase(),
      )
    ) {
      footerSocials.push(item);
    }
  }
  const defaultYoutube = defaultSocial.floating.find(
    (item) => item.name.toLowerCase() === "youtube",
  );
  if (
    defaultYoutube &&
    !footerSocials.some((item) => item.name.toLowerCase() === "youtube")
  ) {
    footerSocials.push(defaultYoutube);
  }
  const phone = footer.phone || config.params.footer_phone;
  const email = footer.email || config.params.footer_email;
  const secondaryPhone =
    footer.secondaryPhone || config.params.footer_phone_secondary;
  const secondaryEmail =
    footer.secondaryEmail || config.params.footer_email_secondary;
  const tertiaryPhone =
    footer.tertiaryPhone || config.params.footer_phone_tertiary;
  const whatsappPhone = secondaryPhone || phone;
  return (
    <footer className="border-border bg-light relative overflow-hidden border-t">
      {/* soft brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-0 size-[560px] -translate-x-1/2 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 18%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 container pt-12 pb-8 sm:pt-16 sm:pb-10">
        {/* ── Top grid: brand / navigation / services / contact ── */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <Link
              className="inline-flex items-center gap-3 rounded-md bg-white px-2 py-1"
              href="/"
            >
              <img
                src={config.site.logo}
                alt={config.site.logo_text}
                width={190}
                height={56}
              />
            </Link>
            <p className="text-text mt-5 max-w-sm text-[15px] leading-relaxed">
              {footer.tagline || config.params.footer_tagline}{" "}
              {footer.description}
            </p>
            <ul className="social-icons mt-6">
              {footerSocials.map((item) => {
                const platform = item.name.toLowerCase();
                const Icon = socialIcons[platform];
                return (
                  <li key={item.name}>
                    <a
                      href={item.link}
                      aria-label={item.name}
                      data-social={platform}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      {Icon ? <Icon className="inline-block" /> : item.name}
                    </a>
                  </li>
                );
              })}
              <li>
                <a
                  href={`https://wa.me/${whatsappPhone.replace(/\D/g, "")}?text=Hi%2C%20I%20am%20interested%20in%20your%20services`}
                  aria-label="WhatsApp"
                  data-social="whatsapp"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <FaWhatsapp className="inline-block" />
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <p className={headingClass}>Navigation</p>
            <LinkList links={footerNavigation} />
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <p className={headingClass}>Services</p>
            <LinkList links={footerServices} />
          </div>

          {/* Direct contact */}
          <div className="col-span-2 lg:col-span-4">
            <p className={headingClass}>Direct Contact</p>
            <ul className="text-text space-y-3 text-[15px]">
              <li>
                📍 <strong className="text-text-dark">Primary Office:</strong>{" "}
                {footer.address}
              </li>
              <li>
                📞{" "}
                <a
                  className="hover:text-primary transition-colors"
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                >
                  {phone}
                </a>
              </li>
              {tertiaryPhone && (
                <li>
                  📞{" "}
                  <a
                    className="hover:text-primary transition-colors"
                    href={`tel:${tertiaryPhone.replace(/[^\d+]/g, "")}`}
                  >
                    {tertiaryPhone}
                  </a>
                </li>
              )}
              {secondaryPhone && (
                <li>
                  📞{" "}
                  <a
                    className="hover:text-primary transition-colors"
                    href={`tel:${secondaryPhone.replace(/[^\d+]/g, "")}`}
                  >
                    {secondaryPhone}
                  </a>
                </li>
              )}
              <li>
                ✉️{" "}
                <a
                  className="hover:text-primary break-all transition-colors"
                  href={`mailto:${email}`}
                >
                  {email}
                </a>
              </li>
              {secondaryEmail && (
                <li>
                  ✉️{" "}
                  <a
                    className="hover:text-primary break-all transition-colors"
                    href={`mailto:${secondaryEmail}`}
                  >
                    {secondaryEmail}
                  </a>
                </li>
              )}
              <li className="text-sm">{footer.hours}</li>
            </ul>
            <a
              href={`https://wa.me/${whatsappPhone.replace(/\D/g, "")}?text=Hi%2C%20I%20am%20interested%20in%20your%20services`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="social-brand-link mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:brightness-110"
            >
              <FaWhatsapp className="size-4" /> Chat on WhatsApp →
            </a>
          </div>
        </div>

        {/* ── Locations ── */}
        <div className="border-border mt-10 space-y-7 border-t pt-8 sm:mt-14 sm:space-y-10 sm:pt-10">
          <div>
            <p className={headingClass}>
              Our Services Are Available In Domestic Locations
            </p>
            <LocationPills items={locations.domestic} />
          </div>

          <div>
            <p className={headingClass}>
              Our Services Are Available In International Locations
            </p>
            <LocationPills items={locations.international} prefix="🌐 " />
          </div>

          <Link
            href="/locations"
            className="border-primary/30 bg-primary/5 text-primary hover:bg-primary inline-flex flex-wrap items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-colors hover:!text-white"
          >
            📍 View Complete 500+ Domestic &amp; International Locations
            Directory (Tier 2, Tier 3 &amp; Tier 4 Coverage) ➔
          </Link>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-border relative z-10 border-t">
        <div className="container flex flex-col items-center gap-5 py-6 text-center lg:flex-row lg:justify-between lg:text-left">
          <p
            className="text-text text-sm"
            dangerouslySetInnerHTML={{
              __html: marked.parseInline(config.params.copyright),
            }}
          />
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 lg:justify-end">
            {footerBottomLinks.map((link) => (
              <li key={`${link.name}-${link.url}`}>
                <Link
                  href={link.url}
                  className="text-text hover:text-primary text-sm transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
