CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  invoice_no TEXT NOT NULL UNIQUE,
  order_id TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'issued' CHECK(status IN ('draft','issued','paid','void')),
  currency TEXT NOT NULL,
  subtotal_minor INTEGER NOT NULL CHECK(subtotal_minor >= 0),
  shipping_minor INTEGER NOT NULL CHECK(shipping_minor >= 0),
  tax_minor INTEGER NOT NULL CHECK(tax_minor >= 0),
  total_minor INTEGER NOT NULL CHECK(total_minor >= 0),
  issued_at TEXT NOT NULL,
  paid_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE RESTRICT,
  FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL,
  order_item_id TEXT NOT NULL,
  description TEXT NOT NULL,
  qty INTEGER NOT NULL CHECK(qty > 0),
  unit_price_minor INTEGER,
  line_total_minor INTEGER,
  FOREIGN KEY(invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  FOREIGN KEY(order_item_id) REFERENCES order_items(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_invoices_customer_created ON invoices(customer_id,created_at);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);
