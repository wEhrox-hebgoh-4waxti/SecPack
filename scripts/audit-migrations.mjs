import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = "migrations";
const workerSource = readFileSync("worker/advisor.js", "utf8");
const files = readdirSync(dir).filter((x) => x.endsWith(".sql")).sort((a,b) => a.localeCompare(b));

const versions = new Map();
const markers = [];
const invalid = [];
const runtimeDdl = [];

for (const file of files) {
  const m = /^(\d+)_([^/]+)\.sql$/.exec(file);
  if (!m) {
    invalid.push(file);
    continue;
  }
  const version = Number(m[1]);
  const list = versions.get(version) || [];
  list.push(file);
  versions.set(version, list);

  const content = readFileSync(join(dir, file), "utf8");
  if (/compatibility marker|compatibility migration|runtime schema reconciler|intentionally contains no ALTER TABLE/i.test(content)) {
    markers.push(file);
  }
}

const duplicates = [...versions.entries()].filter(([, list]) => list.length > 1);

console.log("SEC PACK migration audit");
console.log(`Files: ${files.length}`);
console.log(`Highest version: ${Math.max(0, ...versions.keys())}`);

if (invalid.length) {
  console.error("Invalid migration filenames:", invalid.join(", "));
  process.exit(1);
}
const knownDuplicateVersions = new Set([3,4,5,6,7]);
if (duplicates.length) {
  console.warn("WARNING: duplicate migration version prefixes:");
  for (const [version, list] of duplicates) {
    console.warn(`  ${String(version).padStart(4,"0")}: ${list.join(", ")}`);
  }
  const unexpected = duplicates.filter(([version]) => !knownDuplicateVersions.has(version));
  if (unexpected.length) {
    console.error("ERROR: new duplicate migration version prefixes detected.");
    process.exit(1);
  }
}
if (markers.length) {
  console.warn("WARNING: compatibility/marker migrations detected:");
  for (const file of markers) console.warn(`  ${file}`);
}
if (/\b(?:ALTER TABLE|CREATE TABLE|CREATE TRIGGER|DROP TRIGGER)\b/i.test(workerSource)) {
  runtimeDdl.push("worker/advisor.js");
}
if (runtimeDdl.length) {
  console.error("ERROR: runtime schema DDL detected in Worker source:", runtimeDdl.join(", "));
  process.exit(1);
}
console.log("Runtime schema authority: migrations only.");
console.log("Audit complete. Duplicate/marker findings are currently report-only until the remote D1 history is reconciled.");
