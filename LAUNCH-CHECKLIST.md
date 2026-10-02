# SEC PACK — Production Launch Gate

## Architecture
- [x] Browser-to-API form transport
- [x] Server-side D1 storage design
- [x] No public customer-data read endpoint
- [x] OpenAI key server-side only
- [x] Exact-origin CORS
- [x] Request-size validation
- [x] Input validation
- [x] Honeypot
- [x] Duplicate request protection
- [x] Rate limiting with hashed client identifiers
- [x] Security headers\n- [x] Server-backed revocable admin sessions
- [x] Versioned D1 migration files with frozen historical history and additive production hardening
- [x] Canonical root Wrangler configuration
- [x] Removed obsolete Worker Wrangler configuration

## Required Cloudflare production configuration
1. Bind the existing `secpack-prod` D1 database to Worker variable `DB`.
2. Put its real `database_id` in the canonical `wrangler.toml`.
3. Configure the OpenAI API credential as a Cloudflare Secret.
4. Configure a strong random `RATE_LIMIT_SALT` as a Cloudflare Secret (recommended; Worker safely falls back to the OpenAI secret until then).
5. Configure a dedicated `CLOUDFLARE_D1_API_TOKEN` with account-scoped D1 Edit (D1 Write) permission; keep it separate from the Worker deployment token.\n6. Confirm the remote `d1_migrations` history, then apply only unapplied migrations through CI.
7. Verify the Worker custom domain `api.secpackco.com`.
8. Verify HTTPS and HSTS at the production domain.

## Functional QA
- Contact form submits successfully.
- Visitor registration submits successfully.
- Order request submits successfully and receives a server-generated order reference.
- Order/payment lifecycle fields are present for the future payment gateway; client-supplied prices are never trusted.
- A normal browser cannot read D1 records.
- Direct GET abuse does not expose records.
- Invalid origin is rejected.
- Oversized requests are rejected.
- Repeated requests are rate limited.
- Replayed request IDs do not create duplicate inquiry rows.
- Advisor works in EN / فارسی / العربية.
- Advisor web search is only enabled when requested.
- No API credential appears in browser source, network response or repository.

## Data governance
- Retain customer records only as long as operational/legal needs require.
- Periodically delete records no longer required.
- Never copy customer records into GitHub, static assets, browser storage or public logs.


## Commerce operations layer

- Product catalog is server-controlled in D1; public store exposes only active product identity/unit data.
- Controlled price editing, stock receipt, order status, accounting summary and in-person sales are available in the private Admin UI.
- Online orders reserve stock immediately; cancellation releases the reservation; fulfillment converts reserved stock to sold stock.
- In-person sales decrement stock and create canonical Journal + inventory + audit records in the same D1 transaction.
- New online orders create an unread operational alert in D1. The admin dashboard polls for new alerts and can use browser notifications.
- Monetary values are stored in integer minor units for accounting accuracy.
- Before using the admin screen, configure a strong random Cloudflare Secret named `ADMIN_TOKEN`. Do not put it in GitHub or public files.
- Actual automatic card/payment settlement still requires a payment provider/merchant account and its server-side credentials. The current order flow is production-safe for online order placement and stock reservation, but it deliberately does not pretend that payment has been completed.


## Operational accounting
- [x] User-editable server-side product prices
- [x] Online order reservation and fulfillment lifecycle
- [x] In-person sales linked to inventory and accounting
- [x] Expandable chart of accounts
- [x] Business-level financial entries and supplier/supply-chain costs routed through the canonical Journal
- [x] Factory purchase, customs, freight and warehouse cost categories
- [x] Stock receipt workflow
- [x] Operational audit flags for low stock, overdue orders, missing accounting records and negative cash/bank
- [x] AI accounting operations review using aggregate data only
- [x] Private document image capture with size-limited D1 storage
- [ ] Offline queue security and reconciliation hardening; browser-local operational data must not become a second source of truth
- [x] Installable/offline website shell
- [ ] Payment gateway and server-side settlement webhook — intentionally pending
