-- SEC PACK journal posting boundary.
-- Journal rows are created as draft, populated with immutable lines, then atomically posted.
-- Existing historical rows default to posted and remain immutable.
ALTER TABLE journal_transactions ADD COLUMN status TEXT NOT NULL DEFAULT 'posted';

DROP TRIGGER IF EXISTS prevent_journal_tx_update;
CREATE TRIGGER prevent_journal_tx_update
BEFORE UPDATE ON journal_transactions
WHEN NOT (OLD.status='draft' AND NEW.status='posted'
  AND NEW.id=OLD.id
  AND NEW.reference_type IS OLD.reference_type
  AND NEW.reference_id IS OLD.reference_id
  AND NEW.description IS OLD.description
  AND NEW.currency IS OLD.currency
  AND NEW.total_minor IS OLD.total_minor
  AND NEW.request_id IS OLD.request_id
  AND NEW.created_at IS OLD.created_at
  AND (SELECT COALESCE(SUM(CASE WHEN side='debit' THEN amount_minor ELSE 0 END),0) FROM journal_lines WHERE transaction_id=OLD.id)
      = (SELECT COALESCE(SUM(CASE WHEN side='credit' THEN amount_minor ELSE 0 END),0) FROM journal_lines WHERE transaction_id=OLD.id)
  AND (SELECT COALESCE(SUM(amount_minor),0) FROM journal_lines WHERE transaction_id=OLD.id AND side='debit')=OLD.total_minor)
BEGIN
  SELECT RAISE(ABORT,'JOURNAL_IMMUTABLE_OR_UNBALANCED');
END;

CREATE TRIGGER prevent_journal_post_without_lines
BEFORE UPDATE OF status ON journal_transactions
WHEN OLD.status='draft' AND NEW.status='posted'
  AND NOT EXISTS (SELECT 1 FROM journal_lines WHERE transaction_id=OLD.id)
BEGIN
  SELECT RAISE(ABORT,'JOURNAL_EMPTY');
END;
