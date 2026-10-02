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
const allSql = files.map(file => readFileSync(join(dir, file), "utf8")).join("\n");
const requiredUniqueIndexes = [
  ["idx_orders_request_id_unique", "orders(request_id)"],
  ["idx_inquiries_request_id_unique", "inquiries(request_id)"],
  ["idx_accounting_ledger_request_id_unique", "accounting_ledger(request_id)"],
  ["idx_journal_request_id_unique", "journal_transactions(request_id)"]
];

const baselineContracts = {
  products: ["unit_cost_minor", "warehouse"],
  orders: ["request_id"],
  order_items: ["unit_cost_minor"],
  inventory_ledger: ["request_id", "warehouse"],
  accounting_ledger: ["request_id"],
  accounts: ["request_id"],
  financial_entries: ["request_id"],
  supply_costs: ["request_id"],
  documents: ["request_id"],
  supply_cases: ["request_id"],
  supply_milestones: ["request_id"]
};

console.log("SEC PACK migration audit");
console.log(`Files: ${files.length}`);
console.log(`Highest version: ${Math.max(0, ...versions.keys())}`);

for (const [indexName, target] of requiredUniqueIndexes) {
  const pattern = new RegExp("CREATE\\s+UNIQUE\\s+INDEX(?:\\s+IF\\s+NOT\\s+EXISTS)?\\s+" + indexName + "\\s+ON\\s+" + target.replace(/[()]/g, "\\for (const indexName of requiredIndexes) {
  if (!new RegExp("\\b" + indexName + "\\b", "i").test(allSql)) {
    console.error(`ERROR: required idempotency index missing ${indexName}`);
    process.exit(1);
  }
}
"), "i");
  if (!pattern.test(allSql)) {
    console.error(`ERROR: required UNIQUE idempotency index missing ${indexName} on ${target}`);
    process.exit(1);
  }
}

for (const [table, columns] of Object.entries(baselineContracts)) {
  for (const column of columns) {
    const pattern = new RegExp(`\\b${column}\\b`, "i");
    if (!pattern.test(allSql)) {
      console.error(`ERROR: baseline schema contract missing ${table}.${column}`);
      process.exit(1);
    }
  }
}

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
const knownMarkers = new Set([
  "0004_commerce.sql",
  "0005_money_minor_units.sql",
  "0013_mutation_idempotency.sql",
  "0014_order_cost_basis.sql"
]);
if (markers.length) {
  console.warn("WARNING: compatibility/marker migrations detected:");
  for (const file of markers) console.warn(`  ${file}`);
  const unexpectedMarkers = markers.filter(file => !knownMarkers.has(file));
  if (unexpectedMarkers.length) {
    console.error("ERROR: new compatibility/marker migrations detected.");
    process.exit(1);
  }
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
