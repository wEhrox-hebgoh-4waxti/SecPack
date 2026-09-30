-- Store monetary values as integer minor units to avoid floating-point accounting errors
ALTER TABLE products ADD COLUMN unit_price_minor INTEGER NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN subtotal_minor INTEGER NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN total_minor INTEGER NOT NULL DEFAULT 0;
ALTER TABLE order_items ADD COLUMN unit_price_minor INTEGER NOT NULL DEFAULT 0;
ALTER TABLE order_items ADD COLUMN line_total_minor INTEGER NOT NULL DEFAULT 0;
ALTER TABLE accounting_ledger ADD COLUMN amount_minor INTEGER NOT NULL DEFAULT 0;
