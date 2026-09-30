# SEC PACK Professional Advisor — production architecture

Status: production configuration is committed in the repository. Live activation and end-to-end verification remain dependent on the Cloudflare Worker deployment and the already configured production resources.

## Trust boundaries

Browser → HTTPS API Worker → D1 / OpenAI

The browser never receives:
- OpenAI credentials
- D1 credentials or database rows
- customer records
- supplier-private records
- internal procurement information

## Customer data

Public forms submit to `https://api.secpackco.com/forms`. The Worker validates and stores submissions in D1. There is intentionally no public GET endpoint for inquiries.

Stored fields are business-contact data only: name, company, email, phone, product, destination, payment preference, notes/message, order items and timestamps, plus visitor-profile details when that form is used.

## Abuse controls

The API applies:
- exact origin allowlisting;
- mandatory browser Origin validation;
- request-size limits;
- honeypot handling;
- email validation;
- duplicate request protection;
- per-client hourly rate limits;
- hashed client identifiers using a dedicated rate-limit secret when configured, with a safe fallback to the server-side OpenAI secret;
- prepared SQL statements;
- generic error responses.

## AI controls

The OpenAI API key is server-side only. Advisor prompts explicitly prohibit disclosure of SEC PACK confidential supplier, pricing, route, margin, credential and customer information.

Web search is opt-in from the public advisor UI. The model is configured server-side.

## Deployment

The root `wrangler.toml` is the single canonical Worker configuration. The obsolete `worker/wrangler.toml` must not be used.

D1 uses versioned migrations under `migrations/`. The production binding is `DB`, database name `secpack-prod`, and the repository contains migrations 0001 and 0002.

The deployment script applies unapplied remote D1 migrations before deploying the Worker. Cloudflare records applied migrations in D1 and rolls back a failed migration, so migrations remain versioned rather than being manually edited in production.

## Administrative access

There is no public customer-data administration endpoint. Customer records are accessed through the protected Cloudflare/D1 administrative surface until a separately authenticated private SEC PACK admin application is introduced.

## Verification boundary

Repository-level configuration and security controls can be audited here. Live Cloudflare deployment state, live D1 migration state, live Worker secrets and real browser/network execution cannot be truthfully marked verified unless the corresponding production control plane or runtime is accessible.


## Commerce operations
The same Worker and D1 database also provide the operational commerce layer:
- public catalog reads current active price and available stock;
- online orders reserve stock immediately and create order, inventory and accounting records in one D1 batch;
- operations can update price and physical stock counts from the private dashboard;
- in-person sales use the same inventory and accounting ledger;
- order status controls payment confirmation, preparation, fulfillment and cancellation;
- new orders create unread operational alerts for the management dashboard.
