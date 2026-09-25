PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_fa TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT NOT NULL DEFAULT '',
  description_fa TEXT NOT NULL DEFAULT '',
  description_ar TEXT NOT NULL DEFAULT '',
  specs_json TEXT NOT NULL DEFAULT '{}',
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  unit TEXT NOT NULL DEFAULT 'unit',
  currency TEXT NOT NULL DEFAULT 'USD',
  price_minor INTEGER,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','active','archived')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS warehouses (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)),
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory (
  product_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  on_hand INTEGER NOT NULL DEFAULT 0 CHECK(on_hand >= 0),
  reserved INTEGER NOT NULL DEFAULT 0 CHECK(reserved >= 0 AND reserved <= on_hand),
  reorder_point INTEGER NOT NULL DEFAULT 0 CHECK(reorder_point >= 0),
  updated_at TEXT NOT NULL,
  PRIMARY KEY(product_id, warehouse_id),
  FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE RESTRICT,
  FOREIGN KEY(warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  default_destination TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_no TEXT NOT NULL UNIQUE,
  request_id TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received' CHECK(status IN ('received','confirmed','awaiting_payment','paid','preparing','dispatched','in_transit','delivered','cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK(payment_status IN ('pending','partial','paid','failed','refunded')),
  fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled' CHECK(fulfillment_status IN ('unfulfilled','reserved','preparing','dispatched','in_transit','delivered','cancelled')),
  currency TEXT NOT NULL DEFAULT 'USD',
  subtotal_minor INTEGER NOT NULL DEFAULT 0 CHECK(subtotal_minor >= 0),
  shipping_minor INTEGER NOT NULL DEFAULT 0 CHECK(shipping_minor >= 0),
  tax_minor INTEGER NOT NULL DEFAULT 0 CHECK(tax_minor >= 0),
  total_minor INTEGER NOT NULL DEFAULT 0 CHECK(total_minor >= 0),
  destination TEXT NOT NULL DEFAULT '',
  payment_method TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  sku_snapshot TEXT NOT NULL,
  name_snapshot TEXT NOT NULL,
  specs_snapshot TEXT NOT NULL DEFAULT '{}',
  qty INTEGER NOT NULL CHECK(qty > 0),
  unit_price_minor INTEGER,
  line_total_minor INTEGER,
  created_at TEXT NOT NULL,
  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('pending','authorized','paid','failed','refunded')),
  method TEXT NOT NULL DEFAULT '',
  amount_minor INTEGER NOT NULL CHECK(amount_minor >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  provider_ref TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS shipments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','preparing','dispatched','in_transit','delivered','cancelled')),
  carrier TEXT NOT NULL DEFAULT '',
  tracking_no TEXT NOT NULL DEFAULT '',
  vehicle TEXT NOT NULL DEFAULT '',
  driver TEXT NOT NULL DEFAULT '',
  origin TEXT NOT NULL DEFAULT '',
  destination TEXT NOT NULL DEFAULT '',
  shipped_at TEXT,
  delivered_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  order_id TEXT,
  movement_type TEXT NOT NULL CHECK(movement_type IN ('receipt','reservation','release','sale','adjustment','return','transfer_in','transfer_out')),
  qty INTEGER NOT NULL CHECK(qty > 0),
  reference TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE RESTRICT,
  FOREIGN KEY(warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT,
  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id TEXT PRIMARY KEY,
  po_no TEXT NOT NULL UNIQUE,
  supplier_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','sent','confirmed','partially_received','received','cancelled')),
  currency TEXT NOT NULL DEFAULT 'USD',
  subtotal_minor INTEGER NOT NULL DEFAULT 0 CHECK(subtotal_minor >= 0),
  freight_minor INTEGER NOT NULL DEFAULT 0 CHECK(freight_minor >= 0),
  customs_minor INTEGER NOT NULL DEFAULT 0 CHECK(customs_minor >= 0),
  local_transport_minor INTEGER NOT NULL DEFAULT 0 CHECK(local_transport_minor >= 0),
  other_cost_minor INTEGER NOT NULL DEFAULT 0 CHECK(other_cost_minor >= 0),
  landed_cost_minor INTEGER NOT NULL DEFAULT 0 CHECK(landed_cost_minor >= 0),
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
  id TEXT PRIMARY KEY,
  purchase_order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  qty INTEGER NOT NULL CHECK(qty > 0),
  unit_cost_minor INTEGER NOT NULL CHECK(unit_cost_minor >= 0),
  received_qty INTEGER NOT NULL DEFAULT 0 CHECK(received_qty >= 0 AND received_qty <= qty),
  created_at TEXT NOT NULL,
  FOREIGN KEY(purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS accounting_accounts (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK(account_type IN ('asset','liability','equity','revenue','expense')),
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1))
);

CREATE TABLE IF NOT EXISTS accounting_entries (
  id TEXT PRIMARY KEY,
  entry_no TEXT NOT NULL UNIQUE,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  entry_date TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS accounting_lines (
  id TEXT PRIMARY KEY,
  entry_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  debit_minor INTEGER NOT NULL DEFAULT 0 CHECK(debit_minor >= 0),
  credit_minor INTEGER NOT NULL DEFAULT 0 CHECK(credit_minor >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  FOREIGN KEY(entry_id) REFERENCES accounting_entries(id) ON DELETE CASCADE,
  FOREIGN KEY(account_id) REFERENCES accounting_accounts(id) ON DELETE RESTRICT,
  CHECK((debit_minor = 0 AND credit_minor > 0) OR (credit_minor = 0 AND debit_minor > 0))
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL DEFAULT '',
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notification_outbox (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','sent','failed')),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts >= 0),
  last_error TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_created ON orders(customer_id,created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(status,created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_order ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_created ON stock_movements(product_id,created_at);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier_created ON purchase_orders(supplier_id,created_at);
CREATE INDEX IF NOT EXISTS idx_audit_entity_created ON audit_log(entity_type,entity_id,created_at);
CREATE INDEX IF NOT EXISTS idx_notification_status_created ON notification_outbox(status,created_at);

INSERT OR IGNORE INTO warehouses (id,code,name,address,active,created_at)
VALUES ('wh-main','MAIN','Main Warehouse','',1,datetime('now'));

INSERT OR IGNORE INTO products (
  id,sku,slug,name_en,name_fa,name_ar,description_en,description_fa,description_ar,
  specs_json,seo_title,seo_description,unit,currency,price_minor,status,created_at,updated_at
) VALUES (
  'paper','SEC-A4-80','a4-copy-paper','A4 Copy Paper','کاغذ کپی A4','ورق نسخ A4',
  'Professional A4 copy paper for B2B supply programs.',
  'کاغذ کپی A4 برای تأمین حرفه‌ای B2B.',
  'ورق نسخ A4 للتوريد الاحترافي للشركات.',
  '{"size":"210 × 297 mm","gsm":"80","sheets_per_ream":500,"reams_per_carton":5}',
  'A4 Copy Paper | 80 GSM | SEC PACK',
  'A4 copy paper, 80 GSM, 500 sheets per ream, for professional B2B supply.',
  'ream','USD',NULL,'active',datetime('now'),datetime('now')
);

INSERT OR IGNORE INTO inventory (product_id,warehouse_id,on_hand,reserved,reorder_point,updated_at)
VALUES ('paper','wh-main',0,0,0,datetime('now'));

INSERT OR IGNORE INTO accounting_accounts (id,code,name,account_type) VALUES
('acct-cash','1000','Cash','asset'),
('acct-bank','1010','Bank','asset'),
('acct-receivable','1100','Accounts Receivable','asset'),
('acct-inventory','1200','Inventory','asset'),
('acct-payable','2000','Accounts Payable','liability'),
('acct-equity','3000','Owner Equity','equity'),
('acct-sales','4000','Sales Revenue','revenue'),
('acct-cogs','5000','Cost of Goods Sold','expense'),
('acct-freight','5100','Freight & Logistics Expense','expense'),
('acct-customs','5200','Customs & Clearance Expense','expense'),
('acct-other-expense','5900','Other Operating Expense','expense');

PRAGMA optimize;
