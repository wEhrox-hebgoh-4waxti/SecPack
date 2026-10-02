# SEC PACK — System Architecture Contract

Status: canonical rebuild blueprint. This document defines the system boundaries and invariants that every future feature or fix must preserve.

## 1. System boundary

Public Website
→ Cloudflare Worker API
→ Cloudflare D1
→ operational/accounting source of truth

Private Admin UI
→ same Worker API
→ same D1

AI services are downstream consumers of explicitly permitted data. They never become a source of truth.

Payment gateway is intentionally deferred.

## 2. Source-of-truth map

| Domain | Canonical source | Compatibility / projection |
|---|---|---|
| Products | products | none |
| Orders | orders + order_items | inquiries only for legacy public forms |
| Inventory | products quantities + immutable inventory_ledger | none |
| Accounting | journal_transactions + journal_lines + account balances | accounting_ledger / financial_entries are legacy compatibility surfaces |
| Supply chain | supply_cases + supply_milestones | none |
| Customer inquiries | inquiries | admin views |
| Audit | audit_log | audit_flags are derived operational findings |
| Documents | documents | share token is a controlled access mechanism |
| Configuration | operational_settings / Wrangler | none |

No new feature may create a second canonical ledger.

## 3. Business-event pipeline

Every financial or inventory mutation follows:

Business command
→ validate input and state transition
→ build one atomic D1 batch
→ inventory mutation
→ journal transaction/lines
→ audit record
→ commit
→ safe idempotent response

A failed batch must leave no partial business state.

## 4. Accounting invariants

- Every journal transaction is balanced: debit total = credit total = transaction total.
- Journal transactions and lines are immutable.
- Historical order-item cost is immutable.
- Account structural fields are immutable after financial history exists.
- Account balances are derived/updated only by the journal engine.
- Reports use journal data, not legacy ledgers.
- Currency never crosses journal lines inside one transaction.

## 5. Inventory invariants

- stock_qty >= 0
- reserved_qty >= 0
- reserved_qty <= stock_qty
- sold_qty >= 0
- Reservation never consumes physical stock.
- Fulfillment consumes stock and reservation and increases sold.
- Cancellation releases reservation.
- Return restores stock and reduces sold.
- Every movement has an immutable ledger record.
- Weighted-average cost is recalculated only from receipt history and current physical stock.

## 6. Order state machine

Allowed operational states:

pending → processing → paid → ready → fulfilled
pending → paid
pending → cancelled
processing → paid
processing → ready
processing → cancelled
paid → ready
paid → cancelled only through an explicit reversal/refund workflow
ready → fulfilled

Terminal states are immutable except through a dedicated compensating business operation.

## 7. Supply-cost state machine

planned → paid
planned → cancelled

paid and cancelled are terminal.

A payment operation creates exactly one accounting event.

## 8. Security boundary

Public endpoints may expose only public product identity and explicitly public workflow responses.

Never expose publicly:
- purchase cost
- sale price
- stock
- reserved/sold quantities
- warehouse
- margin
- accounting
- customers
- suppliers
- routes
- customs data
- internal documents

Admin authentication uses a server-side secret only to bootstrap a short-lived signed Secure/HttpOnly/SameSite session. Session IDs are server-revocable in D1; the secret is never stored in browser storage.

## 9. Schema authority

Migrations are the only schema authority.

Worker request handling must never execute:
- CREATE TABLE
- ALTER TABLE
- CREATE TRIGGER
- DROP TRIGGER

The duplicate historical migration prefixes are frozen until the real remote D1 migration history is inspected. They must not be renamed or deleted blindly.

## 10. Idempotency

Every externally retryable mutation receives an idempotency key.

The key must be persisted at the mutation boundary where replay safety is required.

A replay must return the original business result rather than perform the business event again.

## 11. API contract

Public API contracts are intentionally smaller than internal records.

Internal database rows must never be serialized directly into public responses.

## 12. Operational simplicity

The Admin UI operates in business terms:
- receive stock
- create sale
- confirm payment
- fulfill order
- cancel order
- refund order
- record supply cost
- pay supply cost
- review alerts

The accounting engine performs the complex double-entry work automatically.

## 13. Documents

Documents remain private. Share links use high-entropy random tokens, hashed storage and expiry. Large binary storage should move to R2 before document volume becomes material; D1 base64 is a transitional implementation. Sensitive accounting/document mutations are not queued in browser storage.

## 14. CI/CD gate

A production deployment must pass:

syntax
→ system contract audit
→ migration audit
→ local D1 migration
→ database integrity tests
→ Worker dry-run
→ remote D1 access/migration verification
→ migration apply
→ Worker deployment
→ live smoke

If a required database gate fails, deployment stops.

## 15. Rebuild rule

Do not patch an isolated symptom when the defect crosses domain boundaries.

For every change inspect:

domain model → schema → transaction → API → security → Admin UX → accounting → inventory → audit → tests → deployment.

This contract is the architectural gate for future work.
