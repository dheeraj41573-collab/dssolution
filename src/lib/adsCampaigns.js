const AD_CAMPAIGN_NAMES = [
  ["Automotive", "T"],
  ["Beauty & Salon", "W"],
  ["E-commerce", "F"],
  ["Education", "D"],
  ["Events & Entertainment", "E"],
  ["Fashion & Clothing", "A"],
  ["Finance & Consulting", "T"],
  ["Fitness & Gym", "W"],
  ["Healthcare", "W"],
  ["Home Services", "L"],
  ["Interior Design", "R"],
  ["Jewellery", "J"],
  ["Real Estate", "R"],
  ["Restaurant & Café", "F"],
  ["Technology & IT", "T"],
  ["Travel & Tourism", "T"],
];

export const adsCampaigns = AD_CAMPAIGN_NAMES.map(([name, category], index) => ({
  id: `ad-${String(index + 1).padStart(2, "0")}`,
  no: String(index + 1).padStart(2, "0"),
  name,
  summary: "Digital Ads & Campaigns",
  cat: category,
  type: "ads",
  image: `/portfolio/ads/${encodeURIComponent(`${name}.png`)}`,
}));
