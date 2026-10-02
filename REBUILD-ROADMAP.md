# SEC PACK — Whole-System Rebuild Contract

This is the canonical rebuild map for SEC PACK. Work is performed as one connected system, not as isolated patches.

## 0. Non-negotiable architecture

`Public Website → Worker API → D1 Source of Truth`

`Admin UI → Worker API → D1 Source of Truth`

Every business mutation follows:

`Business command → validation → authorization → idempotency → one D1 transaction → inventory/accounting effects → audit → minimal response`

D1 is the system of record. Journal transactions/lines are the accounting source of truth. Legacy accounting tables are compatibility only.

## 1. Current repository baseline

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

Do not rename/delete them before remote reconciliation.

Current integrity sequence:
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

### Still required
1. Resolve Cloudflare D1 7403.
2. Verify remote migration state.
3. Verify remote schema/index/trigger state.
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
