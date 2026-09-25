CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  request_id TEXT UNIQUE,
  form_type TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  product TEXT,
  destination TEXT,
  payment TEXT,
  notes TEXT,
  message TEXT,
  items TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_form_type_created_at ON inquiries(form_type, created_at);

CREATE TABLE IF NOT EXISTS rate_limits (
  bucket_key TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON rate_limits(window_start);
