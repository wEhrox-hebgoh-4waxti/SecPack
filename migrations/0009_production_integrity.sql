-- Production integrity hardening.
CREATE UNIQUE INDEX IF NOT EXISTS idx_inventory_request_id_unique ON inventory_ledger(request_id) WHERE request_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_financial_request_id_unique ON financial_entries(request_id) WHERE request_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_supply_cost_request_id_unique ON supply_costs(request_id) WHERE request_id IS NOT NULL;

CREATE TRIGGER IF NOT EXISTS prevent_financial_entry_update
BEFORE UPDATE ON financial_entries
BEGIN SELECT RAISE(ABORT,'FINANCIAL_LEDGER_IMMUTABLE'); END;

CREATE TRIGGER IF NOT EXISTS prevent_financial_entry_delete
BEFORE DELETE ON financial_entries
BEGIN SELECT RAISE(ABORT,'FINANCIAL_LEDGER_IMMUTABLE'); END;

CREATE TRIGGER IF NOT EXISTS prevent_inventory_ledger_update
BEFORE UPDATE ON inventory_ledger
BEGIN SELECT RAISE(ABORT,'INVENTORY_LEDGER_IMMUTABLE'); END;

CREATE TRIGGER IF NOT EXISTS prevent_inventory_ledger_delete
BEFORE DELETE ON inventory_ledger
BEGIN SELECT RAISE(ABORT,'INVENTORY_LEDGER_IMMUTABLE'); END;

CREATE TRIGGER IF NOT EXISTS prevent_accounting_ledger_update
BEFORE UPDATE ON accounting_ledger
BEGIN SELECT RAISE(ABORT,'ACCOUNTING_LEDGER_IMMUTABLE'); END;

CREATE TRIGGER IF NOT EXISTS prevent_accounting_ledger_delete
BEFORE DELETE ON accounting_ledger
BEGIN SELECT RAISE(ABORT,'ACCOUNTING_LEDGER_IMMUTABLE'); END;
