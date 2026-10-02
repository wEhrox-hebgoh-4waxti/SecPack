-- SEC PACK domain state-machine hardening.
-- Business state transitions are protected at the database boundary as well as in the Worker.

CREATE TRIGGER IF NOT EXISTS prevent_invalid_order_status_transition
BEFORE UPDATE OF status ON orders
WHEN NEW.status IS NOT OLD.status
 AND NOT (
   (OLD.status='pending' AND NEW.status IN ('processing','paid','cancelled'))
   OR (OLD.status='processing' AND NEW.status IN ('paid','ready','cancelled'))
   OR (OLD.status='paid' AND NEW.status='ready')
   OR (OLD.status='ready' AND NEW.status='fulfilled')
 )
BEGIN
  SELECT RAISE(ABORT,'INVALID_ORDER_STATUS_TRANSITION');
END;

CREATE TRIGGER IF NOT EXISTS prevent_invalid_payment_status_transition
BEFORE UPDATE OF payment_status ON orders
WHEN NEW.payment_status IS NOT OLD.payment_status
 AND NOT (
   (OLD.payment_status='unpaid' AND NEW.payment_status='paid' AND NEW.status IN ('paid','ready','fulfilled'))
   OR (OLD.payment_status='paid' AND NEW.payment_status='refunded' AND NEW.status='cancelled')
 )
BEGIN
  SELECT RAISE(ABORT,'INVALID_PAYMENT_STATUS_TRANSITION');
END;

CREATE TRIGGER IF NOT EXISTS prevent_invalid_inventory_movement_type
BEFORE INSERT ON inventory_ledger
WHEN NEW.movement_type NOT IN ('RESTOCK','RESERVE','RELEASE','SALE','FULFILL','RETURN','ADJUSTMENT')
BEGIN
  SELECT RAISE(ABORT,'INVALID_INVENTORY_MOVEMENT_TYPE');
END;

CREATE INDEX IF NOT EXISTS idx_orders_status_updated
ON orders(status,updated_at);

CREATE INDEX IF NOT EXISTS idx_inventory_product_created
ON inventory_ledger(product_id,created_at);
