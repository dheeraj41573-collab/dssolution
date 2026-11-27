/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/about/:slug",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/our-portfolio",
        destination: "/portfolio",
        permanent: true,
      },
      {
        source: "/case-study",
        destination: "/portfolio",
        permanent: true,
      },
      {
        source: "/case-study/:slug",
        destination: "/portfolio",
        permanent: true,
      },
      {
        source: "/features",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/integrations",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/payment",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/term-and-condition",
        destination: "/legal",
        permanent: true,
      },
      {
        source: "/seo-services",
        destination: "/services/seo",
        permanent: true,
      },
      {
        source: "/seo-services/:slug",
        destination: "/services/:slug",
        permanent: true,
      },
      {
        source: "/social-media-management",
        destination: "/services/social-media-marketing",
        permanent: true,
      },
      {
        source: "/ppc-services",
        destination: "/services/google-ads",
        permanent: true,
      },
      {
        source: "/ppc-services/google-search-ads",
        destination: "/services/google-ads",
        permanent: true,
      },
      {
        source: "/paid-social-ads",
        destination: "/services/meta-ads",
        permanent: true,
      },
      {
        source: "/paid-social-ads/meta-ads",
        destination: "/services/meta-ads",
        permanent: true,
      },
      {
        source: "/creatives",
        destination: "/services/graphic-design",
        permanent: true,
      },
      {
        source: "/creatives/graphic-design-services",
        destination: "/services/graphic-design",
        permanent: true,
      },
      {
        source: "/creatives/graphic-design-servies",
        destination: "/services/graphic-design",
        permanent: true,
      },
      {
        source: "/creatives/branding-services",
        destination: "/services/brand-identity-design",
        permanent: true,
      },
      {
        source: "/website-and-ui-ux-design",
        destination: "/services/web-development",
        permanent: true,
      },
      {
        source: "/website-and-ui-ux-design/website-designing-services",
        destination: "/services/web-development",
        permanent: true,
      },
      {
        source: "/website-and-ui-ux-design/ui-ux-design",
        destination: "/services/web-development",
        permanent: true,
      },
      {
        source: "/app-development",
        destination: "/services/app-development",
        permanent: true,
      },
      {
        source: "/influencer-marketing",
        destination: "/services/influencer-marketing",
        permanent: true,
      },
      {
        source: "/graphic-design",
        destination: "/services/graphic-design",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
