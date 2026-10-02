-- SEC PACK domain immutability hardening.
-- Historical order cost and chart-of-accounts structure are business history, not editable fields.

CREATE TRIGGER IF NOT EXISTS prevent_order_item_cost_update
BEFORE UPDATE OF unit_cost_minor ON order_items
WHEN NEW.unit_cost_minor IS NOT OLD.unit_cost_minor
BEGIN
  SELECT RAISE(ABORT,'ORDER_COST_BASIS_IMMUTABLE');
END;

CREATE TRIGGER IF NOT EXISTS prevent_account_structure_update
BEFORE UPDATE OF name,account_type,currency,opening_balance_minor ON accounts
WHEN EXISTS (
  SELECT 1 FROM journal_lines WHERE account_id=OLD.id
)
BEGIN
  SELECT RAISE(ABORT,'ACCOUNT_STRUCTURE_IMMUTABLE');
END;

CREATE INDEX IF NOT EXISTS idx_journal_lines_account_currency
ON journal_lines(account_id,currency,created_at);

CREATE INDEX IF NOT EXISTS idx_order_items_order_product
ON order_items(order_id,product_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_request_created
ON audit_log(request_id,created_at) WHERE request_id IS NOT NULL;
