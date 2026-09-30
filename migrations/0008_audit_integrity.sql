-- SEC PACK hardening: immutable operational audit trail and stronger invariants.
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  before_json TEXT,
  after_json TEXT,
  request_id TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type,entity_id,created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_request_id_unique ON orders(request_id) WHERE request_id IS NOT NULL;
CREATE TRIGGER IF NOT EXISTS prevent_reserved_over_available
BEFORE UPDATE OF reserved_qty ON products
WHEN NEW.reserved_qty < 0 OR NEW.reserved_qty > NEW.stock_qty
BEGIN
  SELECT RAISE(ABORT,'INVALID_RESERVATION');
END;
CREATE TRIGGER IF NOT EXISTS prevent_audit_update
BEFORE UPDATE ON audit_log
BEGIN
  SELECT RAISE(ABORT,'AUDIT_IMMUTABLE');
END;
CREATE TRIGGER IF NOT EXISTS prevent_audit_delete
BEFORE DELETE ON audit_log
BEGIN
  SELECT RAISE(ABORT,'AUDIT_IMMUTABLE');
END;
