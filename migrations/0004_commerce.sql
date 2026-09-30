CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_fa TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'ream',
  currency TEXT NOT NULL DEFAULT 'USD',
  unit_price REAL NOT NULL DEFAULT 0,
  unit_price_minor INTEGER NOT NULL DEFAULT 0,
  stock_qty INTEGER NOT NULL DEFAULT 0,
  reserved_qty INTEGER NOT NULL DEFAULT 0,
  sold_qty INTEGER NOT NULL DEFAULT 0,
  warehouse TEXT NOT NULL DEFAULT 'Gorgan',
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_no TEXT UNIQUE NOT NULL,
  request_id TEXT UNIQUE,
  customer_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  destination TEXT,
  payment_method TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  currency TEXT NOT NULL,
  subtotal REAL NOT NULL DEFAULT 0,
  total REAL NOT NULL DEFAULT 0,
  subtotal_minor INTEGER NOT NULL DEFAULT 0,
  total_minor INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  unit TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  line_total REAL NOT NULL,
  unit_price_minor INTEGER NOT NULL,
  line_total_minor INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory_ledger (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  movement_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  reference_id TEXT,
  note TEXT,
  warehouse TEXT NOT NULL DEFAULT 'Gorgan',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS accounting_ledger (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  entry_type TEXT NOT NULL,
  amount REAL NOT NULL,
  amount_minor INTEGER NOT NULL,
  currency TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  reference_id TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status,payment_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory_ledger(product_id,created_at);
CREATE INDEX IF NOT EXISTS idx_accounting_created ON accounting_ledger(created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_unread ON alerts(is_read,created_at);

INSERT OR IGNORE INTO products(id,name_en,name_fa,name_ar,unit,currency,unit_price,unit_price_minor,stock_qty,reserved_qty,sold_qty,warehouse,active,updated_at)
VALUES('paper','A4 Copy Paper','کاغذ کپی A4','ورق نسخ A4','ream','USD',0,0,0,0,0,'Gorgan',1,datetime('now'));
INSERT OR IGNORE INTO products(id,name_en,name_fa,name_ar,unit,currency,unit_price,unit_price_minor,stock_qty,reserved_qty,sold_qty,active,updated_at)
VALUES('film','Lamination Films','فیلم لمینیشن','أفلام التغليف','kg','USD',0,0,0,0,0,'Gorgan',0,datetime('now'));
INSERT OR IGNORE INTO products(id,name_en,name_fa,name_ar,unit,currency,unit_price,unit_price_minor,stock_qty,reserved_qty,sold_qty,active,updated_at)
VALUES('adhesive','Water-Based Adhesives','چسب‌های پایه آب','لاصقات مائية','kg','USD',0,0,0,0,0,'Gorgan',0,datetime('now'));
INSERT OR IGNORE INTO products(id,name_en,name_fa,name_ar,unit,currency,unit_price,unit_price_minor,stock_qty,reserved_qty,sold_qty,active,updated_at)
VALUES('packaging','Packaging Materials','مواد بسته‌بندی','مواد التغليف','unit','USD',0,0,0,0,0,'Gorgan',0,datetime('now'));
CREATE TRIGGER IF NOT EXISTS trg_products_no_negative_stock
BEFORE UPDATE OF stock_qty ON products
WHEN NEW.stock_qty < 0
BEGIN
  SELECT RAISE(ABORT, 'INSUFFICIENT_STOCK');
END;
