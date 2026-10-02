-- SEC PACK production integrity: complete idempotency indexes and immutable operational references.
-- Safe additive migration. Existing rows with NULL request_id remain valid.
CREATE UNIQUE INDEX IF NOT EXISTS idx_inquiries_request_id_unique
ON inquiries(request_id) WHERE request_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_inventory_request_id_unique
ON inventory_ledger(request_id) WHERE request_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_financial_entries_request_id_unique
ON financial_entries(request_id) WHERE request_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_audit_log_request_id_unique
ON audit_log(request_id) WHERE request_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_accounting_ledger_request_id_unique
ON accounting_ledger(request_id) WHERE request_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_journal_transactions_request_reference
ON journal_transactions(request_id,reference_type,reference_id);

CREATE INDEX IF NOT EXISTS idx_inventory_ledger_reference_created
ON inventory_ledger(reference_id,created_at);

CREATE INDEX IF NOT EXISTS idx_orders_request_status
ON orders(request_id,status,payment_status);

CREATE INDEX IF NOT EXISTS idx_order_items_product_order
ON order_items(product_id,order_id);

-- A journal transaction must always represent a positive monetary event.
CREATE TRIGGER IF NOT EXISTS prevent_invalid_journal_transaction_insert
BEFORE INSERT ON journal_transactions
WHEN NEW.total_minor <= 0
BEGIN
  SELECT RAISE(ABORT,'INVALID_JOURNAL_TRANSACTION');
END;

-- Inventory ledger movements must never record a zero/negative physical quantity.
CREATE TRIGGER IF NOT EXISTS prevent_invalid_inventory_movement_insert
BEFORE INSERT ON inventory_ledger
WHEN NEW.quantity <= 0
BEGIN
  SELECT RAISE(ABORT,'INVALID_INVENTORY_MOVEMENT');
END;
