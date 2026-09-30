-- SEC PACK integrity guard: never allow negative stock
CREATE TRIGGER IF NOT EXISTS prevent_negative_stock
BEFORE UPDATE OF stock_qty ON products
WHEN NEW.stock_qty < 0
BEGIN
  SELECT RAISE(ABORT,'INSUFFICIENT_STOCK');
END;
