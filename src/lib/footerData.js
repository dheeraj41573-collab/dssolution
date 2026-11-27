// Footer + location data. Edit here to change the footer links/locations.

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const toLocations = (names) =>
  names.map((name) => ({ name, slug: slugify(name) }));

export const footerNavigation = [
  { name: "Home", url: "/" },
  { name: "About Us", url: "/about-us" },
  { name: "Portfolio", url: "/portfolio" },
  { name: "Industries", url: "/industries" },
  { name: "Blog Articles", url: "/blog" },
  { name: "Social Growth (SMM)", url: "/smm" },
  { name: "Contact Us", url: "/contact" },
];

export const footerServices = [
  { name: "SEO Services", url: "/services/seo" },
  { name: "Google Ads (PPC)", url: "/services/google-ads" },
  { name: "Meta Ads", url: "/services/meta-ads" },
  { name: "SMM Growth", url: "/smm" },
  { name: "Custom Web App", url: "/services/web-development" },
  { name: "Graphic Design", url: "/graphic-design" },
];

export const footerBottomLinks = [
  { name: "📄 HTML Sitemap", url: "/sitemap.xml" },
  { name: "Services", url: "/services" },
  { name: "Industries", url: "/industries" },
  { name: "Portfolio", url: "/portfolio" },
  { name: "Blog", url: "/blog" },
  { name: "Legal & Compliance", url: "/legal" },
];

export const domesticLocations = toLocations([
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Pune",
  "Noida",
  "Gurgaon",
  "Jaipur",
  "Dehradun",
  "Uttarakhand",
  "Chandigarh",
  "Lucknow",
  "Surat",
  "Indore",
  "Nagpur",
  "Kochi",
  "Coimbatore",
  "Ghaziabad",
  "Faridabad",
  "Thane",
  "Navi Mumbai",
  "Bhopal",
  "Visakhapatnam",
  "Patna",
  "Bhubaneswar",
  "Vadodara",
  "Rajkot",
  "Ludhiana",
  "Amritsar",
  "Kanpur",
  "Varanasi",
  "Agra",
  "Nashik",
  "Mysuru",
  "Mangalore",
  "Goa",
  "Guwahati",
  "Raipur",
  "Ranchi",
  "Jodhpur",
  "Udaipur",
  "Vijayawada",
  "Thiruvananthapuram",
  "Madurai",
  "Meerut",
  "Moradabad",
  "Prayagraj",
  "Jammu",
  "Gwalior",
  "Gorakhpur",
  "Ajmer",
  "Kota",
  "Jabalpur",
  "Solapur",
  "Kolhapur",
  "Mohali",
]);

export const internationalLocations = toLocations([
  "USA",
  "Australia",
  "UK",
  "Canada",
  "Dubai",
  "Singapore",
  "Malaysia",
]);

export const allLocations = [
  ...domesticLocations.map((l) => ({ ...l, type: "domestic" })),
  ...internationalLocations.map((l) => ({ ...l, type: "international" })),
];

export const findLocation = (slug) =>
  allLocations.find((location) => location.slug === slug);
