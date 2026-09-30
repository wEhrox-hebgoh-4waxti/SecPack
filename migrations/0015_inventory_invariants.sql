-- SEC PACK inventory invariant hardening
-- Prevent physical stock from falling below reservations and sold quantity from becoming negative.
CREATE TRIGGER IF NOT EXISTS prevent_reserved_over_available
BEFORE UPDATE OF reserved_qty,stock_qty ON products
WHEN NEW.reserved_qty < 0 OR NEW.reserved_qty > NEW.stock_qty
BEGIN
  SELECT RAISE(ABORT,'INVALID_RESERVATION');
END;

CREATE TRIGGER IF NOT EXISTS prevent_negative_sold
BEFORE UPDATE OF sold_qty ON products
WHEN NEW.sold_qty < 0
BEGIN
  SELECT RAISE(ABORT,'INVALID_SOLD_QTY');
END;
