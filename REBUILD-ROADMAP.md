# SEC PACK — Whole-System Rebuild Roadmap

This roadmap is the operational continuation point for the project. It is intentionally cross-domain: no phase is complete until its dependent layers and regression gates pass.

## Phase 0 — Freeze and observe
- Freeze historical migrations through 0016.
- Do not rename/delete duplicate historical migration files.
- Read remote d1_migrations before any historical cleanup.
- Keep production deployment blocked when remote D1 control-plane access is unavailable.

## Phase 1 — System contract
Status: IN PROGRESS / core gate installed.

Completed:
- Canonical architecture contract.
- Repository-wide system audit.
- Migration-only schema authority.
- Health/readiness separation.
- Public API privacy contract.
- Journal as canonical accounting source.
- Cross-domain deployment gate.

Remaining:
- Expand audit to every admin mutation and every public route.

## Phase 2 — Database integrity
Status: IN PROGRESS.

Completed:
- Production integrity migration 0016.
- Domain immutability migration 0017.
- Relational integrity migration 0018.
- Inventory protection triggers.
- Journal protection triggers.
- Historical order cost protection.
- Account structural protection.
- Legacy commerce orphan guards.

Required verification:
- Local D1 integrity suite.
- PRAGMA quick_check.
- PRAGMA foreign_key_check.
- Journal balance invariants.
- Inventory invariants.
- Account balance reconciliation.
- Remote schema comparison.

## Phase 3 — Remote D1 reconciliation
Status: BLOCKED by Cloudflare control-plane authorization error 7403.

Sequence:
1. D1 metadata.
2. Remote SELECT 1.
3. d1_migrations list.
4. Schema/index/trigger inventory.
5. Compare with repository.
6. Apply only safe unapplied migrations.
7. Re-run integrity checks.

No migration renaming/deletion before this phase completes.

## Phase 4 — Domain engines
Required canonical engines:
- Product master data.
- Inventory receipt/reservation/fulfillment/return.
- Order state machine.
- Payment state machine (business confirmation only until gateway exists).
- Double-entry Journal.
- Weighted-average cost.
- Supply-cost state machine.
- Supplier/supply-case milestones.
- Refund/reversal engine.

Each engine must expose one business operation rather than raw table manipulation.

## Phase 5 — Accounting reconciliation
Remove remaining ambiguity between:
- journal_transactions/journal_lines
- accounting_ledger
- financial_entries

Journal remains canonical. Legacy tables are read-only compatibility/projection until proven unnecessary and reconciled.

Required tests:
- sale
- payment
- COGS
- refund
- expense
- supplier cost
- supplier payment
- return
- multi-currency separation
- trial balance

## Phase 6 — Inventory reconciliation
Required tests:
- multiple receipts
- weighted average cost
- reservation
- concurrent/replayed reservation
- fulfillment
- cancellation
- return
- refund without physical return
- insufficient stock
- negative stock prevention

## Phase 7 — API/security
Audit every route:
- authentication
- authorization
- method
- origin
- rate limit
- payload size
- input validation
- idempotency
- transaction boundary
- response minimization
- audit event
- error behavior

Future hardening:
- MFA/TOTP
- stronger admin session rotation/revocation
- dedicated D1 CI token with least privilege
- document storage migration from D1 base64 to R2 when volume warrants it

## Phase 8 — Admin UX
Admin must operate in business language:
- receive stock
- create sale
- confirm payment
- fulfill
- cancel
- refund
- record supply cost
- pay supply cost
- review alerts
- review accounting

The UI must not permit direct editing of immutable history.

## Phase 9 — Public UX
Public site:
- no internal price
- no inventory
- no margins
- no suppliers/routes/customs
- no customer reads
- no internal accounting

The public Supply Request Center submits requests without exposing commercial or stock data.

## Phase 10 — CI/CD and release
Required order:

system audit
→ migration audit
→ local database tests
→ credentials
→ Worker dry-run
→ remote D1 access
→ migration apply
→ deploy
→ live smoke

Production deployment is blocked by any failed gate.

## Current concrete blockers

1. Remote D1 control-plane error 7403.
2. Full end-to-end commerce/accounting test has not yet been proven against the real remote database.
3. Legacy accounting tables still exist and require reconciliation before removal.
4. Admin route-by-route authorization audit remains.
5. MFA/TOTP remains future hardening.

## Rebuild rule

Never solve a defect only at the layer where it appears. Trace it through:

domain → schema → transaction → API → security → Admin → accounting → inventory → audit → tests → deployment.
