-- SEC PACK supply-chain lifecycle integrity.
-- Milestones are operational history: terminal states cannot be silently reopened.
CREATE TRIGGER IF NOT EXISTS prevent_invalid_supply_milestone_transition
BEFORE UPDATE OF status ON supply_milestones
WHEN (OLD.status='done' AND NEW.status<>'done')
  OR (OLD.status='blocked' AND NEW.status NOT IN ('blocked','pending'))
  OR (OLD.status='pending' AND NEW.status NOT IN ('pending','in_progress','done','blocked'))
  OR (OLD.status='in_progress' AND NEW.status NOT IN ('in_progress','done','blocked'))
BEGIN
  SELECT RAISE(ABORT,'INVALID_SUPPLY_MILESTONE_STATUS');
END;

CREATE INDEX IF NOT EXISTS idx_supply_milestones_case_status
ON supply_milestones(case_id,status,updated_at);
