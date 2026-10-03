-- SEC PACK cross-domain correction.
-- Paid orders may be cancelled only by the explicit refund workflow.
-- The refund command changes status and payment_status atomically to cancelled/refunded.
DROP TRIGGER IF EXISTS prevent_invalid_order_status_transition;

CREATE TRIGGER prevent_invalid_order_status_transition
BEFORE UPDATE OF status ON orders
WHEN NEW.status IS NOT OLD.status
 AND NOT (
   (OLD.status='pending' AND NEW.status IN ('processing','paid','cancelled'))
   OR (OLD.status='processing' AND NEW.status IN ('paid','ready','cancelled'))
   OR (OLD.status='paid' AND NEW.status='ready')
   OR (OLD.status='paid' AND NEW.status='cancelled' AND NEW.payment_status='refunded')
   OR (OLD.status='ready' AND NEW.status='fulfilled')
 )
BEGIN
  SELECT RAISE(ABORT,'INVALID_ORDER_STATUS_TRANSITION');
END;

CREATE INDEX IF NOT EXISTS idx_orders_payment_status_updated
ON orders(payment_status,updated_at);
