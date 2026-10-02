import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const read = p => readFileSync(p, "utf8");
const fail = [];
const expect = (condition, message) => { if (!condition) fail.push(message); };

const worker = read("worker/advisor.js");
const smoke = read("scripts/smoke-live.mjs");
const pkg = JSON.parse(read("package.json"));
const architecture = read("SYSTEM-ARCHITECTURE.md");
const ai = read("AI-ARCHITECTURE.md");
const launch = read("LAUNCH-CHECKLIST.md");
const migrationFiles = readdirSync("migrations").filter(x => x.endsWith(".sql")).sort();
const sql = migrationFiles.map(x => read(join("migrations", x))).join("\n");
const publicForbidden = ["unit_price", "unit_price_minor", "unit_cost_minor", "stock_qty", "reserved_qty", "sold_qty", "warehouse"];

console.log("SEC PACK system contract audit");
console.log("Migration files:", migrationFiles.length);

expect(architecture.includes("Business command"), "SYSTEM-ARCHITECTURE.md is incomplete.");
expect(!/ensureOperationsSchema|ALTER TABLE|CREATE TABLE|CREATE TRIGGER|DROP TRIGGER/i.test(worker), "Runtime schema DDL/reconciler detected in Worker.");
expect(worker.includes("async function schemaReady"), "schemaReady() missing.");
expect(worker.includes('url.pathname==="/ready"'), "Dedicated readiness endpoint missing.");
expect(worker.includes('url.pathname==="/health"'), "Liveness endpoint missing.");
expect(!/url\.pathname==="\/health"[\s\S]{0,1000}schemaReady\(/.test(worker), "Health endpoint is coupled to schema mutation/readiness.");
expect(worker.includes('SELECT id,name_en,name_fa,name_ar,unit FROM products'), "Public catalog contract is not minimal.");
for (const field of publicForbidden) {
  const catalogBlock = worker.match(/async function catalog\(env\)\{[\s\S]*?\n\}/)?.[0] || "";
  expect(!new RegExp("\\b"+field+"\\b").test(catalogBlock), "Public catalog exposes internal field: "+field);
}
expect(!/INSERT INTO financial_entries|UPDATE financial_entries|DELETE FROM financial_entries/i.test(worker), "Worker writes legacy financial_entries; Journal must be canonical.");
expect(worker.includes("journal_transactions") && worker.includes("journal_lines"), "Journal engine missing.");
for (const trigger of ["prevent_order_item_cost_update","prevent_account_structure_update","prevent_orphan_order_item_insert","prevent_orphan_inventory_movement_insert","prevent_product_delete_with_history"]) expect(worker.includes(trigger), "Worker readiness contract missing trigger: "+trigger);
expect(worker.includes("await env.DB.batch"), "Business mutations are not using D1 batch transactions.");
expect(worker.includes("X-Idempotency-Key"), "Idempotency header support missing.");
expect(worker.includes("__Host-sp_admin"), "Secure admin session cookie missing.");
expect(worker.includes("SameSite=Strict"), "Strict admin session cookie missing.");
expect(worker.includes('if(!origin||!ORIGINS.has(origin))'), "Origin allowlist gate missing.");
expect(worker.includes('return response({ok:false,error:"Payment provider is not connected yet."},501'), "Payment webhook must remain disabled until payment integration is approved.");

const requiredIndexes = [
  "idx_orders_request_id_unique",
  "idx_inquiries_request_id_unique",
  "idx_journal_request_id_unique"
];
for (const name of requiredIndexes) expect(sql.includes(name), "Required idempotency index missing: "+name);

const uniqueColumnTables = ["accounts","supply_costs","documents","supply_cases","supply_milestones"];
for (const table of uniqueColumnTables) {
  const tableSql = sql.match(new RegExp("CREATE TABLE IF NOT EXISTS "+table+"[\\s\\S]*?(?=CREATE TABLE IF NOT EXISTS|$)","i"))?.[0] || "";
  expect(/request_id TEXT UNIQUE/i.test(tableSql), table+" must have UNIQUE request_id.");
}

expect(pkg.scripts["audit:system"], "package.json missing audit:system.");
expect(smoke.includes('["ready", "https://api.secpackco.com/ready"]'), "Live smoke must test readiness.");
expect(smoke.includes(`name === "health"`) && smoke.includes('"ok":true'), "Live smoke health check is missing.");
expect(smoke.includes(`name === "ready"`) && smoke.includes('commerceSchema'), "Live smoke readiness check is missing.");

expect(!ai.includes("public catalog reads current active price and available stock"), "AI architecture contains stale public-price/stock claim.");
expect(!launch.includes("public store reads only active products with a positive selling price"), "Launch checklist contains stale public-price claim.");
expect(launch.includes("Payment gateway and server-side settlement webhook"), "Launch gate must explicitly keep payment integration pending.");

const duplicates = new Map();
for (const file of migrationFiles) {
  const m = /^(\d+)_/.exec(file);
  if (!m) continue;
  const list = duplicates.get(m[1]) || [];
  list.push(file);
  duplicates.set(m[1], list);
}
const unexpectedDuplicates = [...duplicates.entries()].filter(([,v]) => v.length > 1 && !["0003","0004","0005","0006","0007"].includes(v[0].slice(0,4)));
expect(unexpectedDuplicates.length === 0, "Unexpected new duplicate migration prefixes detected.");

if (fail.length) {
  console.error("\nSYSTEM CONTRACT FAILED");
  for (const item of fail) console.error("-", item);
  process.exit(1);
}
console.log("System contract: PASS");
