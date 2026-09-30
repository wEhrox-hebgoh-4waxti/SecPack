ALTER TABLE inquiries ADD COLUMN order_status TEXT NOT NULL DEFAULT 'submitted';
ALTER TABLE inquiries ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'unpaid';
ALTER TABLE inquiries ADD COLUMN amount INTEGER;
ALTER TABLE inquiries ADD COLUMN currency TEXT;
ALTER TABLE inquiries ADD COLUMN payment_authority TEXT;
ALTER TABLE inquiries ADD COLUMN payment_ref_id TEXT;

CREATE INDEX IF NOT EXISTS idx_inquiries_order_status_created_at ON inquiries(order_status, created_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_payment_status_created_at ON inquiries(payment_status, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_inquiries_payment_authority ON inquiries(payment_authority) WHERE payment_authority IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_inquiries_payment_ref_id ON inquiries(payment_ref_id) WHERE payment_ref_id IS NOT NULL;
