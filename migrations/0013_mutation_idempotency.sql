ALTER TABLE documents ADD COLUMN request_id TEXT;
ALTER TABLE supply_cases ADD COLUMN request_id TEXT;
ALTER TABLE supply_milestones ADD COLUMN request_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_documents_request_id_unique ON documents(request_id) WHERE request_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_supply_cases_request_id_unique ON supply_cases(request_id) WHERE request_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_supply_milestones_request_id_unique ON supply_milestones(request_id) WHERE request_id IS NOT NULL;
