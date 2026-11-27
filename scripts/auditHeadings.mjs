import fs from "node:fs/promises";
import path from "node:path";

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

const baseUrl = process.env.BASE_URL || "https://www.thedssolution.com";

function getHeadingIssues(html) {
  const headingMatches = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)];
  const levels = headingMatches.map((match) => Number(match[1]));
  const issues = [];

  let previousLevel = 0;
  for (let index = 0; index < levels.length; index += 1) {
    const level = levels[index];
    if (previousLevel !== 0 && level > previousLevel + 1) {
      issues.push({
        index,
        from: previousLevel,
        to: level,
        text: headingMatches[index][2].replace(/<[^>]+>/g, "").trim(),
      });
    }
    previousLevel = level;
  }

  const h1Count = levels.filter((level) => level === 1).length;
  if (h1Count === 0) issues.push({ type: "missing-h1" });
  if (h1Count > 1) issues.push({ type: "multiple-h1", count: h1Count });

  return issues;
}

async function main() {
  const results = [];

  for (const route of routes) {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();
    const issues = getHeadingIssues(html);
    results.push({ route, issues });
  }

  let total = 0;
  for (const item of results) {
    const issues = item.issues.length;
    if (issues > 0) {
      total += issues;
      console.log(`\n${item.route}: ${issues} issue(s)`);
      for (const issue of item.issues) {
        if (issue.type) {
          console.log(` - ${issue.type}`);
        } else {
          console.log(
            ` - heading jump from h${issue.from} to h${issue.to}: ${issue.text || "unknown"}`,
          );
        }
      }
    } else {
      console.log(`\n${item.route}: OK`);
    }
  }

  console.log(`\nTotal heading issues: ${total}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
