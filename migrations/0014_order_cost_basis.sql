ALTER TABLE order_items ADD COLUMN unit_cost_minor INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_order_items_cost ON order_items(order_id,product_id);
