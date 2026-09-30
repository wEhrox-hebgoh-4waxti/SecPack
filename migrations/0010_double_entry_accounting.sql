-- SEC PACK accounting core: immutable balanced double-entry journal.
CREATE TABLE IF NOT EXISTS journal_transactions (
  id TEXT PRIMARY KEY,
  reference_type TEXT,
  reference_id TEXT,
  description TEXT NOT NULL,
  currency TEXT NOT NULL,
  total_minor INTEGER NOT NULL,
  request_id TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS journal_lines (
  id TEXT PRIMARY KEY,
  transaction_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  side TEXT NOT NULL CHECK(side IN ('debit','credit')),
  amount_minor INTEGER NOT NULL CHECK(amount_minor > 0),
  currency TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_journal_lines_tx ON journal_lines(transaction_id);
CREATE INDEX IF NOT EXISTS idx_journal_lines_account ON journal_lines(account_id,created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_request_id_unique ON journal_transactions(request_id) WHERE request_id IS NOT NULL;
CREATE TRIGGER IF NOT EXISTS prevent_journal_tx_update BEFORE UPDATE ON journal_transactions BEGIN SELECT RAISE(ABORT,'JOURNAL_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS prevent_journal_tx_delete BEFORE DELETE ON journal_transactions BEGIN SELECT RAISE(ABORT,'JOURNAL_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS prevent_journal_line_update BEFORE UPDATE ON journal_lines BEGIN SELECT RAISE(ABORT,'JOURNAL_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS prevent_journal_line_delete BEFORE DELETE ON journal_lines BEGIN SELECT RAISE(ABORT,'JOURNAL_IMMUTABLE'); END;
