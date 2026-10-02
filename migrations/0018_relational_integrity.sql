-- SEC PACK relational integrity hardening for legacy baseline tables.
-- Some early commerce tables predate foreign-key declarations; triggers enforce
-- the same critical relationships without rebuilding production tables.

CREATE TRIGGER IF NOT EXISTS prevent_orphan_order_item_insert
BEFORE INSERT ON order_items
WHEN NOT EXISTS (SELECT 1 FROM orders WHERE id=NEW.order_id)
  OR NOT EXISTS (SELECT 1 FROM products WHERE id=NEW.product_id)
BEGIN
  SELECT RAISE(ABORT,'ORPHAN_ORDER_ITEM');
END;

CREATE TRIGGER IF NOT EXISTS prevent_orphan_inventory_movement_insert
BEFORE INSERT ON inventory_ledger
WHEN NOT EXISTS (SELECT 1 FROM products WHERE id=NEW.product_id)
BEGIN
  SELECT RAISE(ABORT,'ORPHAN_INVENTORY_MOVEMENT');
END;

CREATE TRIGGER IF NOT EXISTS prevent_product_delete_with_history
BEFORE DELETE ON products
WHEN OLD.stock_qty<>0
  OR OLD.reserved_qty<>0
  OR OLD.sold_qty<>0
  OR EXISTS (SELECT 1 FROM order_items WHERE product_id=OLD.id)
  OR EXISTS (SELECT 1 FROM inventory_ledger WHERE product_id=OLD.id)
BEGIN
  SELECT RAISE(ABORT,'PRODUCT_HAS_HISTORY');
END;

CREATE INDEX IF NOT EXISTS idx_inventory_product_reference
ON inventory_ledger(product_id,reference_id,created_at);

CREATE INDEX IF NOT EXISTS idx_orders_email_created
ON orders(email,created_at);
