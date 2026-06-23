import { existsSync, readFileSync } from "node:fs";

const forbiddenFiles = ["package-lock.json", "pnpm-lock.yaml", "bun.lockb", "bun.lock"];
const forbiddenTokens = ["applied-caas", "openai.org", "artifactory", "packages.applied-caas"];
let ok = true;

for (const file of forbiddenFiles) {
  if (existsSync(file)) {
    console.error(`Forbidden lockfile found: ${file}`);
    ok = false;
  }
}

for (const file of ["yarn.lock", ".yarnrc", ".npmrc", "vercel.json", "package.json"]) {
  if (!existsSync(file)) continue;
  const content = readFileSync(file, "utf8");
  for (const token of forbiddenTokens) {
    if (content.includes(token)) {
      console.error(`Forbidden registry token '${token}' found in ${file}`);
      ok = false;
    }
  }
}

if (!existsSync("package.json")) {
  console.error("package.json is missing from project root.");
  ok = false;
}
if (!existsSync("yarn.lock")) {
  console.error("yarn.lock is missing from project root.");
  ok = false;
}

if (!ok) process.exit(1);
console.log("Deployment lockfile check passed: Yarn-only, public registry, clean root.");
