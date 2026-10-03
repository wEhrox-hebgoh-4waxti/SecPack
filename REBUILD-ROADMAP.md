# SEC PACK — Whole-System Rebuild Contract

## Latest reconstruction pass — 2026-10-03

This pass treats inventory, order state, refund accounting, public DTOs, migration authority and CI gates as one dependency graph.

### Cross-domain corrections now committed
- business-event uniqueness is now enforced in D1 for order sale/payment/COGS, manual sale/COGS, stock receipt, supply cost/payment, opening balances and refund events; retries with a different request key cannot create a second canonical financial event;
- inventory ledger business events are uniquely constrained by movement/product/reference, preventing duplicate physical movements under concurrent retries;
- account current balances are now protected by a database reconciliation trigger against the Journal history;
- Inventory mutations no longer depend on conditional UPDATE predicates that can silently affect zero rows while a later ledger INSERT succeeds; DB invariant triggers are now the transaction boundary.
- Paid-order refund is explicitly represented as the only legal database transition from `paid` to `cancelled`, and it must simultaneously set `payment_status='refunded'`.
- Refund reservation release and fulfilled-order return use DB invariant triggers rather than silent zero-row guards.
- Public order replay responses are restricted to the same minimal DTO as first submission; commercial total/currency are never returned by the public replay path.
- Local integrity tests now cover reservation overflow and paid-order cancellation/refund boundaries.
- System audit now fails if legacy inventory zero-row guard patterns or the refund boundary migration disappear.
- Local secret/development artifacts are explicitly excluded from Git via `.dev.vars*`, Wrangler state and local build/test outputs.

### Current release blockers
- Latest CI verification: syntax, system contract, migration audit, local D1 migrations/integrity, Cloudflare authentication and Worker dry-run all pass; the release gate stops only because `CLOUDFLARE_D1_API_TOKEN` is empty.
1. Remote D1 control-plane authorization must be restored with the GitHub secret `CLOUDFLARE_D1_API_TOKEN`; the latest CI run proves this secret is currently empty, while the existing Worker deployment token is valid for Worker deployment but is not sufficient for D1 control-plane access.
2. After D1 access is restored, remote `d1_migrations` must be reconciled before any historical migration rename/delete.
3. CI must pass system audit, migration audit, local integrity, remote migration verification, deployment and live smoke before production is considered operational.
4. End-to-end production-safe validation remains required for receipt → order → reserve → payment confirmation → fulfillment → COGS → return/refund.
5. MFA/TOTP remains a post-core security hardening step and is not claimed as implemented.


This is the canonical rebuild map for SEC PACK. Work is performed as one connected system, not as isolated patches.

## 0. Non-negotiable architecture

`Public Website → Worker API → D1 Source of Truth`

`Admin UI → Worker API → D1 Source of Truth`

Every business mutation follows:

`Business command → validation → authorization → idempotency → one D1 transaction → inventory/accounting effects → audit → minimal response`

D1 is the system of record. Journal transactions/lines are the accounting source of truth. Legacy accounting tables are compatibility only.

#

## 0A. Whole-system reconstruction gate

The repository is treated as one coupled system. No feature is considered complete because its local route works.

### Dependency graph

`Public UI → Public API contract → domain command → authorization → idempotency → D1 transaction → inventory → Journal → audit → projection/report → Admin UI → CI/CD → live smoke`

### Canonical write rules

- Products: master data only; physical stock changes only through stock-receipt/controlled adjustment commands.
- Orders: order state is changed only through the order state machine.
- Inventory: every physical movement creates exactly one immutable inventory-ledger record inside the same transaction.
- Accounting: every financial event enters the canonical Journal; legacy accounting tables are never written by business commands.
- Accounts: structural fields become immutable after financial use; balances change only through Journal commands.
- Supply costs: status changes and payment are one business transaction with one Journal event.
- Documents: metadata and authorization stay in D1; binary storage is bounded and isolated from public data.
- Audit: every meaningful mutation records before/after business state without secrets or share tokens.
- Public responses: explicit DTOs only; internal rows are never serialized directly.

### Required test matrix

Every mutation must be covered for:

1. valid first execution;
2. duplicate execution with the same idempotency key;
3. concurrent/retry execution;
4. invalid state transition;
5. insufficient inventory;
6. accounting-account mismatch;
7. transaction rollback;
8. audit creation;
9. public-response minimization;
10. authorization failure.

### Rebuild phases and hard gates

**Phase 1 — Repository truth**
- inventory every route, table, migration, trigger, index, frontend caller and CI gate;
- eliminate contradictory contracts;
- make the system audit fail closed.

**Phase 2 — Database truth**
- reconcile remote D1 migration history;
- verify tables/columns/indexes/triggers;
- run SQLite quick-check and foreign-key checks;
- freeze historical migration cleanup until reconciliation is proven.

**Phase 3 — Domain engines**
- Product master;
- Customer/inquiry;
- Order/reservation;
- Payment confirmation;
- Fulfillment/COGS;
- Return/refund;
- Stock receipt/weighted-average valuation;
- Supply cost/payment;
- Supply case/milestones;
- Documents;
- Accounting commands.

**Phase 4 — Cross-domain invariants**
- inventory/accounting atomicity;
- Journal balance;
- account-balance reconciliation;
- historical cost;
- idempotency;
- audit;
- state machines.

**Phase 5 — API/Admin**
- route-by-route authorization;
- GET read-only guarantees;
- explicit response DTOs;
- business-language Admin workflows;
- no direct mutation of historical quantities/costs/Journals.

**Phase 6 — Public site**
- privacy contract;
- multilingual consistency;
- form/order UX;
- no internal fields in source/API/browser state;
- CSP-compatible assets.

**Phase 7 — Production security**
- MFA/TOTP;
- session rotation/revocation via server-backed admin sessions;
- least-privilege Cloudflare credentials;
- rate-limit hardening;
- document/R2 decision;
- observability without sensitive logging.

**Phase 8 — Release**
- static audits;
- local D1;
- end-to-end deterministic fixtures;
- remote D1 reconciliation;
- migration apply;
- deploy;
- live smoke;
- post-deploy health/readiness.

### Stop conditions

The rebuild must stop rather than patch forward if any of these occur:
- remote D1 state is unknown while a historical migration change is proposed;
- a business command writes two competing canonical ledgers;
- a mutation can partially commit inventory without its accounting/audit effect;
- a public DTO contains internal commercial/operational fields;
- a GET endpoint mutates state;
- an idempotency replay can create a second business event;
- a terminal state can be reopened without a compensating business command.

### Current known defects found by whole-system audit

- legacy `accounting_ledger` was still being written by the Journal engine despite being declared compatibility-only — corrected;
- payment webhook authorization was invoked without awaiting its async verifier — corrected;
- system audit contained an outdated admin-secret assertion — corrected;
- migration audit referenced an incorrect historical index name — corrected;
- live smoke checked invalid-origin behavior after an early failure exit and could therefore skip that security test — corrected;
- historical migration prefixes remain unresolved until remote `d1_migrations` is readable;
- complete deterministic end-to-end accounting/inventory tests remain required;
- MFA/TOTP remains unimplemented.


# 1. Current repository baseline

- Repository: `wEhrox-hebgoh-4waxti/SecPack`
- Worker: `secpack`
- API: `api.secpackco.com`
- D1: `secpack-prod`
- Migration authority: `migrations/`
- Runtime schema DDL: prohibited.
- Public API: no price, cost, inventory, warehouse, margin, supplier route, customer records or accounting.
- Admin: authenticated session only.
- Payment gateway: deliberately disabled until a separate integration is approved.

## 2. Schema strategy

Historical duplicate migration prefixes remain frozen until the real remote `d1_migrations` state is known.

Known historical duplicate prefixes:
- 0003
- 0004
- 0005
- 0006
- 0007
- 0018

Do not rename/delete them before remote reconciliation.

Current integrity sequence:
- 0023 business-event uniqueness and account-balance reconciliation
- 0015 inventory invariants
- 0016 production/idempotency integrity
- 0017 domain immutability
- 0018 relational integrity
- 0019 supply-milestone lifecycle integrity

Future schema changes are additive migrations only unless a controlled reconstruction is explicitly planned and tested.

## 3. Database invariants

### Inventory
- stock_qty >= 0
- reserved_qty >= 0
- reserved_qty <= stock_qty
- sold_qty >= 0
- order-item historical unit cost is immutable
- product history prevents destructive deletion
- orphan order items and inventory movements are rejected

### Accounting
- every Journal transaction has positive total
- every Journal transaction balances: debit = credit = transaction total
- Journal transactions/lines are immutable
- account structure becomes immutable once used
- account balances are updated only through the Journal engine
- currency is isolated per account/journal
- historical order cost is preserved

### Supply chain
- supply case owns its milestones
- milestone state transitions are controlled by DB
- terminal milestone states cannot be silently reopened
- case status follows milestone progress
- creation/update operations are atomic and auditable

### Idempotency
Idempotency is required for business mutations and is represented by request IDs/unique constraints where the operation is replay-sensitive.

## 4. Domain engines

The application is organized around business commands, not raw table edits:

1. Product master
2. Customer/inquiry intake
3. Order creation
4. Reservation
5. Payment confirmation
6. Fulfillment
7. COGS
8. Cancellation
9. Return/refund
10. Manual sale
11. Stock receipt / weighted-average valuation
12. Supply cost creation/payment
13. Supply case/milestone control
14. Document capture/share
15. Accounting entry
16. Audit/alerts

Each command must have:
- input contract
- authorization rule
- idempotency rule
- transaction boundary
- canonical accounting effect where applicable
- canonical inventory effect where applicable
- audit event
- minimal response
- regression test

## 5. Accounting model

Canonical:

`Business Event → journal_transactions → journal_lines → account balances/reports`

`accounting_ledger` is compatibility/projection only.

`financial_entries` is legacy compatibility data and must not be written by the Worker.

Required reconciliation before legacy removal:
- opening balances
- sales
- payments
- COGS
- refunds
- expenses
- supply costs
- supplier payments
- multi-currency balances
- trial balance

## 6. Inventory valuation

Weighted-average cost is the current valuation policy.

For every receipt:

`new average cost = (old stock × old cost + received qty × received cost) / new stock`

Order items snapshot the cost used for later COGS/refund calculations.

Required tests:
- first receipt
- second receipt at different cost
- reservation
- fulfillment
- cancellation
- return
- refund without return
- insufficient stock
- replayed mutation

## 7. Order state machine

Allowed business states are explicitly controlled:

`pending → processing → paid → ready → fulfilled`

and cancellation is allowed only where the payment/refund rules permit it.

Payment confirmation creates:
- sale recognition
- receivable settlement

Fulfillment creates:
- physical stock reduction
- reservation release
- sold quantity increase
- COGS

Refund creates:
- revenue reversal
- payment reversal
- optional physical return
- optional COGS reversal when goods are returned

No gateway settlement is assumed until the payment integration is enabled.

## 8. Supply-chain state machine

`factory_order → factory_payment → customs → transport → warehouse_receipt → ready_for_delivery`

Each case owns its milestones. Each transition is atomic and audited.

Supply costs use:
`planned → paid | cancelled`

Terminal states cannot be reopened.

## 9. Security architecture

Layers:

1. HTTPS/HSTS
2. strict CSP
3. security headers
4. exact Origin allowlist
5. rate limiting
6. payload limits
7. prepared SQL statements
8. authenticated admin session
9. Secure/HttpOnly/SameSite=Strict `__Host-` cookie
10. constant-time secret verification
11. idempotency
12. D1 transactional integrity
13. immutable audit log
14. response minimization
15. expiring document share tokens

Future hardening:
- MFA/TOTP
- session rotation/revocation
- least-privilege dedicated D1 CI token
- optional Cloudflare Access for Admin if operationally suitable

## 10. Document architecture

D1 stores metadata; document blobs currently use bounded image payloads.

The current upload is deliberately below D1's 2 MB row/string limit. When document volume grows, migrate blob storage to R2 while retaining metadata and authorization in D1.

Never expose document rows directly. Share links use random tokens, hashed server-side, with expiration.

## 11. Admin architecture

Admin UI operates in business language:

- Receive stock
- Sell
- Confirm payment
- Fulfill
- Cancel
- Refund
- Record supply cost
- Pay supply cost
- Manage supply case
- Review documents
- Review accounting
- Review audit/alerts

No direct editing of historical stock, cost basis, Journal history or used account structure.

Every meaningful mutation must be:
- authenticated
- idempotent
- transactional
- auditable

GET endpoints remain read-only.

## 12. Public architecture

Public pages may expose:
- product identity/specification
- public educational content
- contact/supply request forms

They must never expose:
- internal price
- purchase cost
- inventory
- reserved/sold quantities
- margins
- suppliers
- routes/customs
- customer records
- accounting
- internal documents

## 13. CI/CD release gate

Required order:

`syntax → system contract → migration audit → local D1 integrity → Cloudflare auth → Worker dry-run → D1 metadata/query/migration diagnostics → migration apply → deploy → live smoke`

A failed database-control-plane check blocks deployment.

## 14. Remote D1 reconciliation — current blocker

Cloudflare D1 control-plane access previously returned error 7403.

Until access is restored:
1. do not rename historical migrations
2. do not delete historical migrations
3. do not assume remote schema state
4. do not claim production deployment succeeded
5. do not perform destructive reconciliation

Once access works:

`D1 info → SELECT 1 → migrations list → schema/index/trigger inventory → compare → apply → quick_check → foreign_key_check → smoke`

Cloudflare documents D1 migration state and transactional migration behavior; use the real remote state as the authority before historical cleanup.

## 15. Test pyramid

### Static
- JavaScript syntax
- system contract
- migration contract
- public privacy contract

### Local D1
- quick_check
- foreign_key_check
- inventory guards
- order cost immutability
- account immutability
- relational integrity
- milestone state integrity
- Journal balance

### End-to-end
`receipt → order → reserve → payment → fulfill → COGS → return → refund`

Verify after every step:
- stock
- reserved
- sold
- average cost
- Journal
- balances
- audit
- idempotency

### Live
- health
- readiness
- public catalog privacy
- public order response privacy
- Admin authentication
- critical mutation smoke tests without destructive production data

## 16. Current work status

### Completed
- migration-only schema authority
- health/readiness separation
- public privacy contract
- Journal reporting foundation
- inventory guards
- historical cost immutability
- relational guards
- supply milestone DB guard
- audit-system contract
- stronger mutation auditing
- constant-time secret verification
- read-only accounting GET
- expanded local integrity suite
- production deployment gate

### Whole-system audit findings fixed in current rebuild pass
- authenticated supply-case and supply-milestone routes were implemented but not connected to the Admin router; routing is now connected and statically audited;
- product mutation audit events now persist their idempotency request_id;
- supply-cost creation now persists request_id on the canonical supply-cost row;
- payment confirmation and refund now resolve the same cash/bank account from the order payment method;
- fulfilled-order inventory returns now recalculate weighted-average unit cost using the returned historical cost basis;
- document uploads are restricted to JPEG/PNG/WebP so share links cannot serve active SVG content;
- Journal transactions now use a draft → posted boundary enforced by D1; direct posted inserts and unbalanced posting are rejected;
- readiness now requires the Journal posting status column;
- local integrity tests now exercise foreign-key enforcement and database-level Journal posting rejection.

### Still required
1. Resolve Cloudflare D1 7403.
2. Verify remote migration state.
3. Verify remote schema/index/trigger/session state.
4. Run complete local and remote end-to-end business flow.
5. Reconcile legacy accounting data.
6. Complete route-by-route Admin security audit.
7. Complete public/frontend compatibility audit.
8. Add MFA/TOTP.
9. Decide on R2 migration when document volume requires it.
10. Only then perform historical migration cleanup.

## Rebuild rule

Never fix a defect only where it appears.

Trace every change through:

`business rule → domain model → schema → transaction → API → security → Admin → accounting → inventory → audit → tests → deployment`

A change is not complete until its dependent layers remain coherent.


## Current system-wide invariants — 2026-10-03

### Accounting boundary
- `journal_transactions + journal_lines` are the canonical accounting source.
- Only `status='posted'` Journal transactions participate in account-balance reconciliation and accounting reports.
- `current_balance_minor` is a projection and must reconcile to posted Journal history.
- Draft Journal rows are transient transaction state and never a balance source.
- `accounting_ledger` and `financial_entries` are compatibility/legacy structures; application code must not write them as accounting truth.

### Inventory boundary
- Physical stock changes only through controlled business operations such as stock receipt, fulfillment, return, and controlled adjustment.
- Public orders are normalized by product ID before reservation.
- Product master data, not hard-coded frontend lists, defines active public products.
- Historical order-item cost basis is immutable.

### Admin API boundary
- Admin browser modules use one authenticated API client.
- Accounting UI uses explicit GET/POST wrappers; no browser-side mutation queue or offline replay exists for financial/document operations.
- Mutation requests carry idempotency keys where replay safety is required.

### Public API boundary
- Public DTOs are allowlists, not serialized internal records.
- Public catalog exposes only product identity/localized names/unit.
- Public order responses expose the commercial order reference and status, not internal database identifiers or financial totals.
- Internal pricing, cost, inventory, accounting, supplier, logistics and customer data remain server-side.

### Release boundary
- Schema changes are migration-only.
- Worker runtime never performs DDL.
- CI must pass system-contract, migration, local D1 integrity and syntax gates before production deployment.
- Production D1 migration access uses a dedicated Cloudflare token with D1 Edit/D1 Write permission; deployment remains fail-closed if that control-plane access is unavailable.
- Worker deployment contains the live smoke test; redundant production-smoke workflow was removed.

### Remaining operational gate
1. Resolve the dedicated D1 control-plane authorization failure (Cloudflare 7403).
2. Verify remote `d1_migrations`, schema, indexes, triggers, `PRAGMA quick_check`, and `PRAGMA foreign_key_check`.
3. Apply migrations only after remote state is known.
4. Run the full receipt → order → reserve → payment → fulfill → COGS → return → refund scenario.
5. Verify production public/API/Admin behavior.
6. Then perform migration canonicalization and final MFA/security hardening.
