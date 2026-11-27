const baseUrl = process.env.BASE_URL || "https://www.thedssolution.com";
const emails = ["info@thedssolution.com", "inquiry@thedssolution.com"];

async function checkRoute(route) {
  const response = await fetch(`${baseUrl}${route}`);
  if (!response.ok) return [];

  const html = await response.text();
  const problems = [];

  for (const email of emails) {
    const emailPattern = new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    if (!emailPattern.test(html)) continue;

    const match = [...html.matchAll(new RegExp(`href=["']mailto:${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "gi"))];
    if (!match.length) {
      problems.push({ route, email, status: "not-mailto" });
    }
  }

  return problems;
}

const routes = [
  "/",
  "/about",
  "/services",
  "/blog",
  "/contact",
  "/pricing",
  "/portfolio",
  "/industries",
  "/legal",
];

async function main() {
  const results = [];
  for (const route of routes) {
    results.push(...(await checkRoute(route)));
  }

  if (results.length === 0) {
    console.log("All configured emails are linked using mailto on the checked routes.");
    return;
  }

  console.table(results);
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
