import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const standaloneRoot = resolve(projectRoot, ".next/standalone");
const staticRoot = resolve(projectRoot, ".next/static");
const publicRoot = resolve(projectRoot, "public");

if (!existsSync(resolve(standaloneRoot, "server.js"))) {
  throw new Error("Next.js standalone server was not generated.");
}

if (!existsSync(staticRoot)) {
  throw new Error("Next.js static assets were not generated.");
}

if (!existsSync(publicRoot)) {
  throw new Error("The client public directory is missing.");
}

cpSync(staticRoot, resolve(standaloneRoot, ".next/static"), {
  recursive: true,
  force: true,
});
cpSync(publicRoot, resolve(standaloneRoot, "public"), {
  recursive: true,
  force: true,
});

console.log(`cPanel deployment bundle prepared at ${standaloneRoot}`);
