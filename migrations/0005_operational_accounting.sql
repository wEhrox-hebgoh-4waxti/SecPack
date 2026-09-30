-- SEC PACK operational accounting layer
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

CREATE INDEX IF NOT EXISTS idx_financial_entries_account_date ON financial_entries(account_id,created_at);
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
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_supply_costs_status_date ON supply_costs(status,due_date);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  document_type TEXT NOT NULL,
  title TEXT NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  storage_key TEXT,
  data_url TEXT,
  share_token_hash TEXT UNIQUE,
  share_expires_at TEXT,
  mime_type TEXT,
  size_bytes INTEGER,
  sha256 TEXT,
  notes TEXT,
  captured_offline INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_documents_reference ON documents(reference_type,reference_id);

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
  created_at TEXT NOT NULL,
  resolved_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_flags_open ON audit_flags(is_resolved,severity,created_at);

CREATE TABLE IF NOT EXISTS operational_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT OR IGNORE INTO accounts
(id,name,account_type,currency,opening_balance_minor,current_balance_minor,active,created_at,updated_at)
VALUES
('cash','صندوق / نقدی','cash','USD',0,0,1,datetime('now'),datetime('now'));

INSERT OR IGNORE INTO accounts
(id,name,account_type,currency,opening_balance_minor,current_balance_minor,active,created_at,updated_at)
VALUES
('bank','حساب بانکی','bank','USD',0,0,1,datetime('now'),datetime('now'));

INSERT OR IGNORE INTO accounts
(id,name,account_type,currency,opening_balance_minor,current_balance_minor,active,created_at,updated_at)
VALUES
('receivables','دریافتنی از مشتریان','receivable','USD',0,0,1,datetime('now'),datetime('now'));

INSERT OR IGNORE INTO accounts
(id,name,account_type,currency,opening_balance_minor,current_balance_minor,active,created_at,updated_at)
VALUES
('payables','پرداختنی به تأمین‌کنندگان','payable','USD',0,0,1,datetime('now'),datetime('now'));

INSERT OR IGNORE INTO accounts
(id,name,account_type,currency,opening_balance_minor,current_balance_minor,active,created_at,updated_at)
VALUES
('inventory','ارزش موجودی کالا','inventory','USD',0,0,1,datetime('now'),datetime('now'));

INSERT OR IGNORE INTO operational_settings(key,value,updated_at)
VALUES('low_stock_threshold','100',datetime('now'));
