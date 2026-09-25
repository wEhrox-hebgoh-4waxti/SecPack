import { describe, it, expect, beforeEach } from "vitest";
import { env, exports } from "cloudflare:workers";

const origin = "https://secpackco.com";
const request = (path, options = {}) => new Request(origin + path, {
  ...options,
  headers: {
    Origin: origin,
    ...(options.headers || {})
  }
});

async function json(response) {
  return await response.json();
}

async function createOrder(requestId = crypto.randomUUID()) {
  return exports.default.fetch(request("/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test Buyer",
      company: "SEC PACK Test",
      email: "buyer@example.com",
      phone: "+989000000000",
      destination: "Tehran",
      payment: "Bank transfer",
      notes: "integration test",
      items: [{ id: "paper", qty: 10 }],
      _request_id: requestId
    })
  }));
}

describe("SEC PACK commerce flow", () => {
  beforeEach(async () => {
    await env.DB.prepare("DELETE FROM stock_movements").run();
    await env.DB.prepare("DELETE FROM audit_log").run();
    await env.DB.prepare("DELETE FROM notification_outbox").run();
    await env.DB.prepare("DELETE FROM order_items").run();
    await env.DB.prepare("DELETE FROM orders").run();
    await env.DB.prepare("DELETE FROM customers").run();
    await env.DB.prepare("UPDATE inventory SET on_hand=0,reserved=0 WHERE product_id='paper' AND warehouse_id='wh-main'").run();
    await env.DB.prepare("DELETE FROM rate_limits").run();
  });

  it("rejects requests without an allowed Origin", async () => {
    const response = await exports.default.fetch(new Request(origin + "/catalog", { method: "GET" }));
    expect(response.status).toBe(403);
  });

  it("serves the database-backed active catalog", async () => {
    const response = await exports.default.fetch(request("/catalog", { method: "GET" }));
    expect(response.status).toBe(200);
    const body = await json(response);
    expect(body.products.some(p => p.id === "paper" && p.sku === "SEC-A4-80")).toBe(true);
  });

  it("protects admin order data", async () => {
    const response = await exports.default.fetch(request("/admin/orders", {
      method: "GET",
      headers: { Authorization: "Bearer wrong-key" }
    }));
    expect(response.status).toBe(401);
  });

  it("creates an order atomically and is idempotent", async () => {
    const requestId = crypto.randomUUID();
    const first = await createOrder(requestId);
    const firstBody = await json(first);
    expect(first.status).toBe(202);
    expect(firstBody.ok).toBe(true);
    expect(firstBody.orderNo).toMatch(/^SEC-\d{8}-[A-Z0-9]{6}$/);

    const second = await createOrder(requestId);
    const secondBody = await json(second);
    expect(second.status).toBe(202);
    expect(secondBody.duplicate).toBe(true);
    expect(secondBody.orderNo).toBe(firstBody.orderNo);

    expect((await env.DB.prepare("SELECT COUNT(*) AS n FROM orders").first()).n).toBe(1);
    expect((await env.DB.prepare("SELECT COUNT(*) AS n FROM order_items").first()).n).toBe(1);
    expect((await env.DB.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action='order.created'").first()).n).toBe(1);
    expect((await env.DB.prepare("SELECT COUNT(*) AS n FROM notification_outbox WHERE event_type='order.created'").first()).n).toBe(1);
  });

  it("does not reserve unavailable stock and reserves exactly once after stock is added", async () => {
    const response = await createOrder();
    const order = await json(response);

    const insufficient = await exports.default.fetch(request("/admin/orders/" + (await env.DB.prepare("SELECT id FROM orders LIMIT 1").first()).id + "/status", {
      method: "POST",
      headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" })
    }));
    expect(insufficient.status).toBe(409);

    await env.DB.prepare("UPDATE inventory SET on_hand=20 WHERE product_id='paper' AND warehouse_id='wh-main'").run();
    const orderId = (await env.DB.prepare("SELECT id FROM orders WHERE order_no=?1").bind(order.orderNo).first()).id;
    const confirmed = await exports.default.fetch(request("/admin/orders/" + orderId + "/status", {
      method: "POST",
      headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" })
    }));
    expect(confirmed.status).toBe(200);
    expect((await env.DB.prepare("SELECT reserved FROM inventory WHERE product_id='paper' AND warehouse_id='wh-main'").first()).reserved).toBe(10);
    expect((await env.DB.prepare("SELECT COUNT(*) AS n FROM invoices").first()).n).toBe(1);
    const invoiceEntry=await env.DB.prepare("SELECT id FROM accounting_entries WHERE source_type='order.invoice' LIMIT 1").first();
    expect(invoiceEntry).toBeTruthy();

    const duplicateConfirm = await exports.default.fetch(request("/admin/orders/" + orderId + "/status", {
      method: "POST",
      headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" })
    }));
    expect(duplicateConfirm.status).toBe(409);
  });

  it("posts a balanced ledger entry exactly when payment is confirmed", async () => {
    await createOrder();
    const orderId = (await env.DB.prepare("SELECT id,total_minor FROM orders LIMIT 1").first()).id;
    await env.DB.prepare("UPDATE orders SET status='awaiting_payment',total_minor=25000 WHERE id=?1").bind(orderId).run();

    const paid = await exports.default.fetch(request("/admin/orders/" + orderId + "/status", {
      method: "POST",
      headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid" })
    }));
    expect(paid.status).toBe(200);

    const payment = await env.DB.prepare("SELECT amount_minor FROM payments WHERE order_id=?1").bind(orderId).first();
    expect(payment.amount_minor).toBe(25000);

    const totals = await env.DB.prepare("SELECT COALESCE(SUM(debit_minor),0) AS debit,COALESCE(SUM(credit_minor),0) AS credit FROM accounting_lines WHERE entry_id=(SELECT id FROM accounting_entries WHERE source_id=?1 ORDER BY created_at DESC LIMIT 1)").bind(orderId).first();
    expect(totals.debit).toBe(25000);
    expect(totals.credit).toBe(25000);
  });

  it("does not allow invalid fulfillment transitions", async () => {
    const response = await createOrder();
    const order = await json(response);
    const orderId = (await env.DB.prepare("SELECT id FROM orders WHERE order_no=?1").bind(order.orderNo).first()).id;

    const delivered = await exports.default.fetch(request("/admin/orders/" + orderId + "/status", {
      method: "POST",
      headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
      body: JSON.stringify({ status: "delivered" })
    }));
    expect(delivered.status).toBe(409);
  });

  it("releases reserved stock when a confirmed order is cancelled", async () => {
    await createOrder();
    const orderId = (await env.DB.prepare("SELECT id FROM orders LIMIT 1").first()).id;
    await env.DB.prepare("UPDATE inventory SET on_hand=20 WHERE product_id='paper' AND warehouse_id='wh-main'").run();

    const confirmed = await exports.default.fetch(request("/admin/orders/" + orderId + "/status", {
      method: "POST",
      headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" })
    }));
    expect(confirmed.status).toBe(200);

    const cancelled = await exports.default.fetch(request("/admin/orders/" + orderId + "/status", {
      method: "POST",
      headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" })
    }));
    expect(cancelled.status).toBe(200);

    const stock = await env.DB.prepare("SELECT on_hand,reserved FROM inventory WHERE product_id='paper' AND warehouse_id='wh-main'").first();
    expect(stock.on_hand).toBe(20);
    expect(stock.reserved).toBe(0);
  });

  it("dispatches only after reservation and reduces on-hand stock exactly once", async () => {
    await createOrder();
    const orderId = (await env.DB.prepare("SELECT id FROM orders LIMIT 1").first()).id;
    await env.DB.prepare("UPDATE inventory SET on_hand=20 WHERE product_id='paper' AND warehouse_id='wh-main'").run();

    const confirmed = await exports.default.fetch(request("/admin/orders/" + orderId + "/status", {
      method: "POST",
      headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" })
    }));
    expect(confirmed.status).toBe(200);

    const dispatched = await exports.default.fetch(request("/admin/orders/" + orderId + "/status", {
      method: "POST",
      headers: { Authorization: "Bearer test-admin-key", "Content-Type": "application/json" },
      body: JSON.stringify({ status: "dispatched" })
    }));
    expect(dispatched.status).toBe(200);

    const stock = await env.DB.prepare("SELECT on_hand,reserved FROM inventory WHERE product_id='paper' AND warehouse_id='wh-main'").first();
    expect(stock.on_hand).toBe(10);
    expect(stock.reserved).toBe(0);
  });
});
