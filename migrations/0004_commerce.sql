-- Compatibility migration.
-- The canonical commerce schema is established by 0003_commerce.sql.
-- Later migrations own additive changes such as request_id and warehouse.
-- This file intentionally contains no ALTER TABLE statements so a fresh
-- database cannot receive a schema that conflicts with later migrations.
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_orders_status_payment ON orders(status,payment_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
