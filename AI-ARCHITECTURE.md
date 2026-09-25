# SEC PACK Professional Advisor — production architecture

Status: production architecture prepared; deployment is gated only by the real Cloudflare D1 database binding and required Cloudflare secrets.

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

Stored fields are business-contact data only: name, company, email, phone, product, destination, payment preference, notes/message, order items and timestamps.

## Abuse controls

The API applies:
- exact origin allowlisting;
- mandatory browser Origin validation;
- request-size limits;
- honeypot handling;
- email validation;
- duplicate request protection;
- per-client hourly rate limits;
- hashed client identifiers using a Cloudflare secret salt;
- prepared SQL statements;
- generic error responses.

## AI controls

The OpenAI API key is server-side only. Advisor prompts explicitly prohibit disclosure of SEC PACK confidential supplier, pricing, route, margin, credential and customer information.

Web search is opt-in from the public advisor UI. The model is configured server-side.

## Deployment

The root `wrangler.toml` is the single canonical Worker configuration. The obsolete `worker/wrangler.toml` must not be used.

D1 uses versioned migrations under `migrations/`. The production database ID must be supplied from the actual Cloudflare D1 database; it must never be invented.

## Administrative access

There is no public customer-data administration endpoint. Customer records are accessed through the protected Cloudflare/D1 administrative surface until a separately authenticated private SEC PACK admin application is introduced.
