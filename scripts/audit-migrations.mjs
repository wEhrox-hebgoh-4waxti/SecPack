import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = "migrations";
const workerSource = readFileSync("worker/advisor.js", "utf8");
const files = readdirSync(dir).filter(x => x.endsWith(".sql")).sort((a,b) => a.localeCompare(b));
const versions = new Map();
const markers = [];
const invalid = [];

for (const file of files) {
  const m = /^(\d+)_([^/]+)\.sql$/.exec(file);
  if (!m) { invalid.push(file); continue; }
  const version = Number(m[1]);
  const list = versions.get(version) || [];
  list.push(file);
  versions.set(version, list);
  const content = readFileSync(join(dir, file), "utf8");
  if (/compatibility marker|compatibility migration|runtime schema reconciler|intentionally contains no ALTER TABLE/i.test(content)) markers.push(file);
}

const allSql = files.map(file => readFileSync(join(dir, file), "utf8")).join("\n");
const requiredUniqueIndexes = [
  ["idx_orders_request_id", /CREATE\s+UNIQUE\s+INDEX(?:\s+IF\s+NOT\s+EXISTS)?\s+idx_orders_request_id\b[\s\S]*?ON\s+orders\s*\(\s*request_id\s*\)/i],
  ["idx_inquiries_request_id_unique", /CREATE\s+UNIQUE\s+INDEX(?:\s+IF\s+NOT\s+EXISTS)?\s+idx_inquiries_request_id_unique\b[\s\S]*?ON\s+inquiries\s*\(\s*request_id\s*\)/i],
  ["idx_accounting_ledger_request_id_unique", /CREATE\s+UNIQUE\s+INDEX(?:\s+IF\s+NOT\s+EXISTS)?\s+idx_accounting_ledger_request_id_unique\b[\s\S]*?ON\s+accounting_ledger\s*\(\s*request_id\s*\)/i],
  ["idx_journal_request_id_unique", /CREATE\s+UNIQUE\s+INDEX(?:\s+IF\s+NOT\s+EXISTS)?\s+idx_journal_request_id_unique\b[\s\S]*?ON\s+journal_transactions\s*\(\s*request_id\s*\)/i]
];
const uniqueRequestColumns = ["accounts","supply_costs","documents","supply_cases","supply_milestones"];
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
  supply_milestones: ["request_id"],
  journal_transactions: ["status"],
  admin_sessions: ["session_id","expires_at","revoked_at"]
};

console.log("SEC PACK migration audit");
console.log(`Files: ${files.length}`);
console.log(`Highest version: ${Math.max(0, ...versions.keys())}`);

for (const [name, pattern] of requiredUniqueIndexes) {
  if (!pattern.test(allSql)) {
    console.error(`ERROR: required UNIQUE idempotency index missing ${name}`);
    process.exit(1);
  }
}
for (const table of uniqueRequestColumns) {
  const pattern = new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\s*\\([\\s\\S]*?request_id\\s+TEXT\\s+UNIQUE`, "i");
  if (!pattern.test(allSql)) {
    console.error(`ERROR: ${table}.request_id must be UNIQUE in its canonical table definition.`);
    process.exit(1);
  }
}
for (const [table, columns] of Object.entries(baselineContracts)) {
  for (const column of columns) {
    if (!new RegExp(`\\b${column}\\b`, "i").test(allSql)) {
      console.error(`ERROR: baseline schema contract missing ${table}.${column}`);
      process.exit(1);
    }
  }
}
if (invalid.length) {
  console.error("Invalid migration filenames:", invalid.join(", "));
  process.exit(1);
}
const duplicates = [...versions.entries()].filter(([, list]) => list.length > 1);
const knownDuplicateVersions = new Set([3,4,5,6,7]);
if (duplicates.length) {
  console.warn("WARNING: duplicate migration version prefixes:");
  for (const [version,list] of duplicates) console.warn(`  ${String(version).padStart(4,"0")}: ${list.join(", ")}`);
  if (duplicates.some(([version]) => !knownDuplicateVersions.has(version))) {
    console.error("ERROR: new duplicate migration version prefixes detected.");
    process.exit(1);
  }
}
const knownMarkers = new Set(["0004_commerce.sql","0005_money_minor_units.sql","0013_mutation_idempotency.sql","0014_order_cost_basis.sql"]);
const unexpectedMarkers = markers.filter(file => !knownMarkers.has(file));
if (unexpectedMarkers.length) {
  console.error("ERROR: new compatibility/marker migrations detected:", unexpectedMarkers.join(", "));
  process.exit(1);
}
if (/\b(?:ALTER TABLE|CREATE TABLE|CREATE TRIGGER|DROP TRIGGER)\b/i.test(workerSource)) {
  console.error("ERROR: runtime schema DDL detected in Worker source.");
  process.exit(1);
}
console.log("Runtime schema authority: migrations only.");
console.log("Audit complete.");
