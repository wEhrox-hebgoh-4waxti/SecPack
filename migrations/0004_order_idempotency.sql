-- request_id is part of the commerce baseline; keep this migration for its indexes.
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_request_id ON orders(request_id) WHERE request_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_inventory_reference ON inventory_ledger(reference_id);
CREATE INDEX IF NOT EXISTS idx_accounting_entry_created ON accounting_ledger(entry_type,created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_reference ON alerts(reference_id);
