import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = "migrations";
const files = readdirSync(dir).filter((x) => x.endsWith(".sql")).sort((a,b) => a.localeCompare(b));

const versions = new Map();
const markers = [];
const invalid = [];

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
if (duplicates.length) {
  console.warn("WARNING: duplicate migration version prefixes:");
  for (const [version, list] of duplicates) console.warn(`  ${String(version).padStart(4,"0")}: ${list.join(", ")}`);
}
if (markers.length) {
  console.warn("WARNING: compatibility/marker migrations detected:");
  for (const file of markers) console.warn(`  ${file}`);
}
console.log("Audit complete. Duplicate/marker findings are currently report-only until the remote D1 history is reconciled.");
