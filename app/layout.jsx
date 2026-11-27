import Script from "next/script";
import { headers } from "next/headers";
import { Suspense } from "react";
import { Inter, Inter_Tight, Space_Grotesk, Urbanist } from "next/font/google";
import AsyncFontStylesheet from "@/components/AsyncFontStylesheet";
import DesktopAnimations from "@/components/DesktopAnimations";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FloatingSocials from "@/components/FloatingSocials";
import ChatWidget from "@/components/ChatWidget";
import InstagramReels from "@/components/InstagramReels";
import JsonLd from "@/components/seo/JsonLd";
import SeoScripts from "@/components/seo/SeoScripts";
import PageContentBridge from "@/components/page-editor/PageContentBridge";
import {
  getPageContentOverrides,
  getPageSeo,
  getSeoRenderSettings,
  getSeoSettings,
  parseSchemaJson,
} from "@/lib/seo";
import {
  getDarkThemeCss,
  getLocations,
  getSiteSettings,
  getThemeVariables,
} from "@/lib/siteSettings";
import "@/styles/main.css";

// Brand fonts are self-hosted through next/font instead of the Google Fonts
// stylesheet. This removes a render-blocking third-party request from the
// critical path and gives Next.js metric-matched fallbacks so text does not
// shift while the web font loads.
const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-urbanist",
});

const portfolioInter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const portfolioSpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const selfHostedFonts = {
  "Inter Tight": { font: interTight, cssVar: "--font-inter-tight" },
  Urbanist: { font: urbanist, cssVar: "--font-urbanist" },
};

export async function generateMetadata() {
  const [{ config }, seo] = await Promise.all([
    getSiteSettings(),
    getSeoSettings(),
  ]);
  const siteUrl = seo.siteUrl || config.site.base_url;
  const siteName = seo.siteName || "Digital Marketing & Web Development Mohali";
  const ogImage = seo.defaultOgImage || config.metadata.meta_image;
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: config.metadata.meta_description,
    authors: [{ name: config.metadata.meta_author }],
    icons: { icon: "/Dssolution-logo.png" },
    openGraph: {
      type: "website",
      siteName,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
    },
    verification: {
      ...(seo.googleSiteVerification
        ? { google: seo.googleSiteVerification }
        : {}),
      ...(seo.bingSiteVerification
        ? { other: { "msvalidate.01": seo.bingSiteVerification } }
        : {}),
    },
  };
}

export default async function RootLayout({ children }) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-pathname") || "/";
  const isAdminPath = /^\/admin(?:\/|$)/i.test(pathname);
  const [siteSettings, seo, customScripts, pageSeo, pageContent] =
    await Promise.all([
      getSiteSettings(),
      getSeoSettings(),
      isAdminPath ? Promise.resolve(null) : getSeoRenderSettings(),
      getPageSeo(pathname),
      getPageContentOverrides(pathname),
    ]);
  const { config, theme, menu, social, locations } = siteSettings;
  const globalSchemas = parseSchemaJson(seo.globalSchemaJson);
  const pageSchemas = parseSchemaJson(pageSeo?.schemaJson);
  const siteUrl = seo.siteUrl || config.site.base_url;
  const siteName = seo.siteName || config.site.name || "DS Solution";
  const defaultSchemas = globalSchemas.length
    ? globalSchemas
    : seo.globalSchemaConfigured
      ? []
      : [
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteName,
            url: siteUrl,
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteName,
            url: siteUrl,
            potentialAction: {
              "@type": "SearchAction",
              target: `${siteUrl.replace(/\/+$/, "")}/blog?search={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
        ];
  const formattedLocations = getLocations(locations);

  const fontFamily = theme.fonts?.font_family ?? {};
  const fontVariables = {};
  const fontClassNames = new Set();
  const remainingGoogleFamilies = [];
  for (const [name, value] of Object.entries(fontFamily)) {
    if (name.endsWith("_type")) continue;
    const family = value
      .replace(/\+/g, " ")
      .replace(/:[^:]+/g, "")
      .trim();
    const local = selfHostedFonts[family];
    const fallback = fontFamily[`${name}_type`] || "sans-serif";
    if (local) {
      fontVariables[`--font-${name.replace(/_/g, "-")}`] =
        `var(${local.cssVar}), ${fallback}`;
      fontClassNames.add(local.font.variable);
    } else {
      remainingGoogleFamilies.push(value);
    }
  }
  const googleFontUrl = remainingGoogleFamilies.length
    ? `https://fonts.googleapis.com/css2?family=${remainingGoogleFamilies.join("&family=")}&display=swap`
    : null;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={[
        ...fontClassNames,
        portfolioInter.variable,
        portfolioSpaceGrotesk.variable,
      ].join(" ")}
      style={{ ...getThemeVariables(theme), ...fontVariables }}
    >
      <head>
        <style>{getDarkThemeCss(theme)}</style>
        <JsonLd schemas={[...defaultSchemas, ...pageSchemas]} />
        <SeoScripts
          settings={seo}
          customScripts={customScripts || {}}
          isAdminPath={isAdminPath}
          position="head"
        />
        {googleFontUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="anonymous"
            />
            <AsyncFontStylesheet href={googleFontUrl} />
          </>
        )}
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(() => { const saved = localStorage.getItem("ds-theme"); const theme = saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); document.documentElement.classList.toggle("dark", theme === "dark"); document.documentElement.dataset.theme = theme; })();',
          }}
        />
        <SeoScripts
          settings={seo}
          customScripts={customScripts || {}}
          isAdminPath={isAdminPath}
          position="body-start"
        />
        <SiteHeader config={config} menu={menu} />
        <PageContentBridge
          key={pathname}
          pathname={pathname}
          contentEdits={pageContent.contentEdits}
          imageAlts={pageContent.imageAlts}
        />
        <main
          id="main-content"
          className="overflow-x-hidden md:overflow-x-auto"
        >
          {children}
        </main>
        <Suspense fallback={null}>
          <InstagramReels />
        </Suspense>
        <SiteFooter
          config={config}
          menu={menu}
          social={social}
          locations={formattedLocations}
        />
        <FloatingSocials config={config} social={social} />
        <ChatWidget />
        <Script src="/scripts/main.js" strategy="afterInteractive" />
        <DesktopAnimations />
        <SeoScripts
          settings={seo}
          customScripts={customScripts || {}}
          isAdminPath={isAdminPath}
          position="footer"
        />
      </body>
    </html>
  );
}
