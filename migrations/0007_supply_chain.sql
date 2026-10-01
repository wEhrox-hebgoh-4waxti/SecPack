-- SEC PACK supply-chain control: one case tracks purchase through payment, customs, transport and warehouse receipt.

CREATE TABLE IF NOT EXISTS supply_cases (
  id TEXT PRIMARY KEY,
  request_id TEXT UNIQUE,
  case_no TEXT NOT NULL UNIQUE,
  product_id TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  supplier TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  purchase_total_minor INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open',
  expected_date TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS supply_milestones (
  id TEXT PRIMARY KEY,
  request_id TEXT UNIQUE,
  case_id TEXT NOT NULL,
  milestone_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  due_date TEXT,
  completed_at TEXT,
  reference_id TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(case_id) REFERENCES supply_cases(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_supply_milestone_case_type ON supply_milestones(case_id,milestone_type);
CREATE INDEX IF NOT EXISTS idx_supply_cases_status_updated ON supply_cases(status,updated_at);
CREATE INDEX IF NOT EXISTS idx_supply_milestones_status_due ON supply_milestones(status,due_date);

-- Default lifecycle: factory order → factory payment → customs → transport → Gorgan warehouse → ready for delivery.
