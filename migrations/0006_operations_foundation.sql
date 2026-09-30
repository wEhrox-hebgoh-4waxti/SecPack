-- SEC PACK operations foundation: accounting, supply chain, documents and audit support
-- Depends on commerce core + money minor-unit migrations.

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  opening_balance_minor INTEGER NOT NULL DEFAULT 0,
  current_balance_minor INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_accounts_type_currency ON accounts(account_type,currency);

CREATE TABLE IF NOT EXISTS financial_entries (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  entry_type TEXT NOT NULL,
  amount_minor INTEGER NOT NULL,
  currency TEXT NOT NULL,
  direction TEXT NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  description TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY(account_id) REFERENCES accounts(id)
);

CREATE INDEX IF NOT EXISTS idx_financial_entries_account_created ON financial_entries(account_id,created_at);
CREATE INDEX IF NOT EXISTS idx_financial_entries_reference ON financial_entries(reference_type,reference_id);

CREATE TABLE IF NOT EXISTS supply_costs (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  supplier TEXT,
  description TEXT NOT NULL,
  amount_minor INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned',
  due_date TEXT,
  paid_at TEXT,
  account_id TEXT,
  reference_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(account_id) REFERENCES accounts(id)
);

CREATE INDEX IF NOT EXISTS idx_supply_costs_status_due ON supply_costs(status,due_date);
CREATE INDEX IF NOT EXISTS idx_supply_costs_category_created ON supply_costs(category,created_at);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  document_type TEXT NOT NULL,
  title TEXT NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  data_url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  captured_offline INTEGER NOT NULL DEFAULT 0,
  share_token_hash TEXT,
  share_expires_at TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_documents_reference ON documents(reference_type,reference_id);
CREATE INDEX IF NOT EXISTS idx_documents_created ON documents(created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_documents_share_token ON documents(share_token_hash);

CREATE TABLE IF NOT EXISTS audit_flags (
  id TEXT PRIMARY KEY,
  severity TEXT NOT NULL,
  category TEXT NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  suggested_action TEXT,
  is_resolved INTEGER NOT NULL DEFAULT 0,
  resolved_at TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_flags_open ON audit_flags(is_resolved,severity,created_at);

CREATE TABLE IF NOT EXISTS operational_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT OR IGNORE INTO operational_settings(key,value,updated_at)
VALUES ('low_stock_threshold','100',datetime('now'));

-- Standard operating accounts. Additional accounts can be created from the admin panel.
INSERT OR IGNORE INTO accounts(id,name,account_type,currency,created_at,updated_at) VALUES
 ('cash','صندوق','cash','USD',datetime('now'),datetime('now')),
 ('bank','بانک','bank','USD',datetime('now'),datetime('now')),
 ('receivables','حساب‌های دریافتنی','receivable','USD',datetime('now'),datetime('now')),
 ('payable','حساب‌های پرداختنی','payable','USD',datetime('now'),datetime('now')),
 ('inventory','موجودی کالا','inventory','USD',datetime('now'),datetime('now')),
 ('expense','هزینه‌ها','expense','USD',datetime('now'),datetime('now')),
 ('income','درآمد','income','USD',datetime('now'),datetime('now'));

-- Warehouse is an operational attribute of each stock movement.
ALTER TABLE inventory_ledger ADD COLUMN warehouse TEXT;
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse_created ON inventory_ledger(warehouse,created_at);
