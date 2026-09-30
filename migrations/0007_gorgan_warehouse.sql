-- SEC PACK warehouse foundation
-- Current operating warehouse: Gorgan. The column keeps the design ready for future multi-warehouse expansion.
ALTER TABLE products ADD COLUMN warehouse TEXT NOT NULL DEFAULT 'Gorgan';
ALTER TABLE inventory_ledger ADD COLUMN warehouse TEXT NOT NULL DEFAULT 'Gorgan';

CREATE INDEX IF NOT EXISTS idx_products_warehouse_active ON products(warehouse,active);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse_created ON inventory_ledger(warehouse,created_at);
