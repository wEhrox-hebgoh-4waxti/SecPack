-- Atomic stock protection for orders and manual sales
CREATE TRIGGER IF NOT EXISTS prevent_negative_stock
BEFORE UPDATE OF stock_qty ON products
WHEN NEW.stock_qty < 0
BEGIN
  SELECT RAISE(ABORT, 'INSUFFICIENT_STOCK');
END;
