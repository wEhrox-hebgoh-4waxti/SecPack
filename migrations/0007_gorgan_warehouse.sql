-- SEC PACK warehouse foundation
-- Current operating warehouse: Gorgan. The column keeps the design ready for future multi-warehouse expansion.
-- Warehouse columns are part of the commerce baseline; this migration keeps their indexes.
CREATE INDEX IF NOT EXISTS idx_products_warehouse_active ON products(warehouse,active);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse_created ON inventory_ledger(warehouse,created_at);
