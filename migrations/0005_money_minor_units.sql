-- Compatibility migration.
-- Minor-unit columns are already part of the canonical 0003 commerce schema.
-- Kept as a tracked migration for existing databases; no duplicate ALTERs.
CREATE INDEX IF NOT EXISTS idx_accounting_created_minor ON accounting_ledger(created_at,amount_minor);
