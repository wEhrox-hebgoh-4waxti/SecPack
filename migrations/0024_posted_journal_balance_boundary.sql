-- SEC PACK accounting boundary hardening.
-- current_balance_minor is a projection of posted Journal history only.
-- Draft Journal rows are transient transaction state and must never be a balance source.
DROP TRIGGER IF EXISTS prevent_account_balance_tamper;

CREATE TRIGGER prevent_account_balance_tamper
BEFORE UPDATE OF current_balance_minor ON accounts
WHEN NEW.current_balance_minor <> (
  SELECT COALESCE(SUM(
    CASE
      WHEN jl.side='debit' AND a.account_type IN ('cash','bank','receivable','inventory','expense','cogs') THEN jl.amount_minor
      WHEN jl.side='credit' AND a.account_type IN ('cash','bank','receivable','inventory','expense','cogs') THEN -jl.amount_minor
      WHEN jl.side='credit' THEN jl.amount_minor
      WHEN jl.side='debit' THEN -jl.amount_minor
      ELSE 0
    END
  ),0)
  FROM journal_lines jl
  JOIN journal_transactions jt ON jt.id=jl.transaction_id
  JOIN accounts a ON a.id=jl.account_id
  WHERE jl.account_id=OLD.id
    AND jl.currency=OLD.currency
    AND jt.status='posted'
)
BEGIN
  SELECT RAISE(ABORT,'ACCOUNT_BALANCE_MUST_RECONCILE_TO_POSTED_JOURNAL');
END;
