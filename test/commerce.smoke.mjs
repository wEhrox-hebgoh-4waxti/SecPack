import { spawn, execFileSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const port = "8787";
const base = "http://127.0.0.1:" + port;
const origin = "https://secpackco.com";
const wrangler = ["wrangler@4.141.0"];
const stage = process.argv[2] || "all";

function run(args) {
  return execFileSync("npx", ["--yes", ...wrangler, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}
function req(path, options = {}) {
  return fetch(base + path, {
    ...options,
    headers: { Origin: origin, ...(options.headers || {}) }
  });
}
async function expectStatus(response, expected, label) {
  if (response.status !== expected) throw new Error(label + ": expected " + expected + ", got " + response.status + " -> " + await response.text());
}
async function expectJson(response) {
  const text = await response.text();
  try { return JSON.parse(text); } catch { throw new Error("Invalid JSON response: " + text); }
}

run(["d1", "migrations", "apply", "DB", "--local", "--persist-to", ".wrangler/commerce-test-state"]);
run(["d1", "execute", "DB", "--local", "--persist-to", ".wrangler/commerce-test-state", "--command", "DELETE FROM stock_movements; DELETE FROM audit_log; DELETE FROM notification_outbox; DELETE FROM invoice_items; DELETE FROM invoices; DELETE FROM accounting_lines; DELETE FROM accounting_entries; DELETE FROM payments; DELETE FROM order_items; DELETE FROM orders; DELETE FROM customers; DELETE FROM rate_limits; UPDATE inventory SET on_hand=0,reserved=0 WHERE product_id='paper' AND warehouse_id='wh-main';"]);

const child = spawn("npx", ["--yes", ...wrangler, "dev", "--local", "--persist-to", ".wrangler/commerce-test-state", "--config", "wrangler.test.toml", "--port", port], { stdio: ["ignore", "pipe", "pipe"] });
let logs = "";
child.stdout.on("data", d => { logs += d.toString(); });
child.stderr.on("data", d => { logs += d.toString(); });

try {
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch(base + "/catalog", { headers: { Origin: origin } }); if (r.status) break; } catch {}
    await sleep(500);
  }

  await expectStatus(await fetch(base + "/catalog"), 403, "origin validation");
  const catalog = await expectJson(await req("/catalog"));
  if (!catalog.products?.some(p => p.id === "paper" && p.sku === "SEC-A4-80")) throw new Error("catalog missing A4");

  await expectStatus(await req("/admin/orders", { method: "GET", headers: { Authorization: "Bearer wrong-key" }}), 401, "admin protection");
  if(stage==="catalog"){ child.kill("SIGTERM"); console.log("COMMERCE_CATALOG_OK"); process.exit(0); }

  const requestId = crypto.randomUUID();
  const orderPayload = {
    name: "Test Buyer", company: "SEC PACK Test", email: "buyer@example.com",
    phone: "+989000000000", destination: "Tehran", payment: "Bank transfer",
    notes: "integration test", items: [{ id: "paper", qty: 10 }], _request_id: requestId
  };
  const first = await req("/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderPayload) });
  const firstBody = await expectJson(first);
  await expectStatus(first, 202, "order creation");
  if (!/^SEC-\d{8}-[A-Z0-9]{6}$/.test(firstBody.orderNo)) throw new Error("invalid order number");

  const duplicate = await req("/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderPayload) });
  const duplicateBody = await expectJson(duplicate);
  await expectStatus(duplicate, 202, "idempotent duplicate");
  if (!duplicateBody.duplicate || duplicateBody.orderNo !== firstBody.orderNo) throw new Error("idempotency failed");

  const admin = await expectJson(await req("/admin/orders", { method: "GET", headers: { Authorization: "Bearer test-admin-key" }}));
  const order = admin.orders.find(o => o.order_no === firstBody.orderNo);
  if (!order) throw new Error("created order not visible to admin");

  await expectStatus(await req("/admin/orders/" + order.id + "/status", {
    method: "POST", headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
    body: JSON.stringify({ status: "confirmed" })
  }), 409, "insufficient stock");

  run(["d1", "execute", "DB", "--local", "--persist-to", ".wrangler/commerce-test-state", "--command", "UPDATE inventory SET on_hand=20 WHERE product_id='paper' AND warehouse_id='wh-main'; UPDATE orders SET subtotal_minor=25000,total_minor=25000 WHERE order_no='" + firstBody.orderNo + "';"]);

  await expectStatus(await req("/admin/orders/" + order.id + "/status", {
    method: "POST", headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
    body: JSON.stringify({ status: "confirmed" })
  }), 200, "confirmation");

  await expectStatus(await req("/admin/orders/" + order.id + "/status", {
    method: "POST", headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
    body: JSON.stringify({ status: "confirmed" })
  }), 409, "duplicate confirmation");

  await expectStatus(await req("/admin/orders/" + order.id + "/status", {
    method: "POST", headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
    body: JSON.stringify({ status: "awaiting_payment" })
  }), 200, "awaiting payment");

  await expectStatus(await req("/admin/orders/" + order.id + "/status", {
    method: "POST", headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
    body: JSON.stringify({ status: "paid" })
  }), 200, "payment");

  const invoiceCheck = JSON.parse(run(["d1", "execute", "DB", "--local", "--persist-to", ".wrangler/commerce-test-state", "--json", "--command", "SELECT COUNT(*) AS n FROM invoices; SELECT COUNT(*) AS n FROM payments; SELECT COALESCE(SUM(debit_minor),0) AS debit, COALESCE(SUM(credit_minor),0) AS credit FROM accounting_lines;"]));
  const outputText = JSON.stringify(invoiceCheck);
  if (!outputText.includes('"n":1')) throw new Error("invoice/payment record missing");
  if (!outputText.includes('"debit":50000') || !outputText.includes('"credit":50000')) throw new Error("accounting ledger is not balanced");

  await expectStatus(await req("/admin/orders/" + order.id + "/status", {
    method: "POST", headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
    body: JSON.stringify({ status: "dispatched" })
  }), 200, "dispatch");

  await expectStatus(await req("/admin/orders/" + order.id + "/status", {
    method: "POST", headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
    body: JSON.stringify({ status: "in_transit" })
  }), 200, "in transit");

  await expectStatus(await req("/admin/orders/" + order.id + "/status", {
    method: "POST", headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
    body: JSON.stringify({ status: "delivered" })
  }), 200, "delivery");

  await expectStatus(await req("/admin/orders/" + order.id + "/status", {
    method: "POST", headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
    body: JSON.stringify({ status: "dispatched" })
  }), 409, "redispatch");

  child.kill("SIGTERM");
  console.log("COMMERCE_SMOKE_OK");
} catch (error) {
  child.kill("SIGTERM");
  console.error(logs.slice(-4000));
  throw error;
}
