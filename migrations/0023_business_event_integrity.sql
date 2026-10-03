-- SEC PACK business-event uniqueness and account-balance integrity.
-- A retry with a different idempotency key must never create a second financial
-- event for the same business event. Partial UNIQUE indexes enforce this at D1.
CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_order_sale_unique
ON journal_transactions(reference_type,reference_id)
WHERE reference_type='order_sale';

CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_order_payment_unique
ON journal_transactions(reference_type,reference_id)
WHERE reference_type='order_payment';

CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_order_cogs_unique
ON journal_transactions(reference_type,reference_id)
WHERE reference_type='order_cogs';

CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_manual_sale_unique
ON journal_transactions(reference_type,reference_id)
WHERE reference_type='manual_sale';

CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_manual_cogs_unique
ON journal_transactions(reference_type,reference_id)
WHERE reference_type='manual_cogs';

CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_order_refund_sale_unique
ON journal_transactions(reference_type,reference_id)
WHERE reference_type='order_refund_sale';

CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_order_refund_payment_unique
ON journal_transactions(reference_type,reference_id)
WHERE reference_type='order_refund_payment';

CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_order_refund_cogs_unique
ON journal_transactions(reference_type,reference_id)
WHERE reference_type='order_refund_cogs';

CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_stock_receipt_unique
ON journal_transactions(reference_type,reference_id)
WHERE reference_type='stock_receipt';

CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_supply_cost_unique
ON journal_transactions(reference_type,reference_id)
WHERE reference_type='supply_cost';

CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_supply_cost_payment_unique
ON journal_transactions(reference_type,reference_id)
WHERE reference_type='supply_cost_payment';

CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_opening_balance_unique
ON journal_transactions(reference_type,reference_id)
WHERE reference_type='opening_balance';

-- One physical event per product/reference pair.
CREATE UNIQUE INDEX IF NOT EXISTS idx_inventory_business_event_unique
ON inventory_ledger(movement_type,product_id,reference_id)
WHERE reference_id IS NOT NULL
  AND movement_type IN ('RESTOCK','RESERVE','RELEASE','SALE','FULFILL','RETURN');

-- current_balance_minor is a projection of immutable Journal lines.
-- Direct tampering is rejected unless the new balance exactly reconciles to
-- the account's complete Journal history.
CREATE TRIGGER IF NOT EXISTS prevent_account_balance_tamper
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
  JOIN journal_transactions jt ON jt.id=jl.transaction_id AND jt.status='posted'
  JOIN accounts a ON a.id=jl.account_id
  WHERE jl.account_id=OLD.id AND jl.currency=OLD.currency
)
BEGIN
  SELECT RAISE(ABORT,'ACCOUNT_BALANCE_MUST_RECONCILE_TO_JOURNAL');
END;

CREATE INDEX IF NOT EXISTS idx_journal_reference
ON journal_transactions(reference_type,reference_id);

CREATE INDEX IF NOT EXISTS idx_inventory_business_reference
ON inventory_ledger(movement_type,product_id,reference_id);
