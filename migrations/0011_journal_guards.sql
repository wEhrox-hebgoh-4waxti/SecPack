-- SEC PACK journal integrity guards
-- Prevent orphan, cross-currency and malformed journal lines.
CREATE TRIGGER IF NOT EXISTS prevent_invalid_journal_line_insert
BEFORE INSERT ON journal_lines
WHEN NEW.amount_minor <= 0
  OR NEW.side NOT IN ('debit','credit')
  OR NOT EXISTS (
    SELECT 1 FROM journal_transactions
    WHERE id = NEW.transaction_id
      AND currency = NEW.currency
  )
  OR NOT EXISTS (
    SELECT 1 FROM accounts
    WHERE id = NEW.account_id
      AND active = 1
      AND currency = NEW.currency
  )
BEGIN
  SELECT RAISE(ABORT,'INVALID_JOURNAL_LINE');
END;

CREATE INDEX IF NOT EXISTS idx_journal_transactions_reference
ON journal_transactions(reference_type,reference_id,created_at);

CREATE INDEX IF NOT EXISTS idx_journal_transactions_currency
ON journal_transactions(currency,created_at);
