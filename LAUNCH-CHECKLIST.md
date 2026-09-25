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
- [x] Security headers
- [x] D1 migration file
- [x] Canonical root Wrangler configuration
- [x] Removed obsolete Worker Wrangler configuration

## Required Cloudflare production configuration
1. Bind the existing `secpack-prod` D1 database to Worker variable `DB`.
2. Put its real `database_id` in the canonical `wrangler.toml`.
3. Configure the OpenAI API credential as a Cloudflare Secret.
4. Configure a strong random `RATE_LIMIT_SALT` as a Cloudflare Secret.
5. Apply migration `migrations/0001_secure_inquiries.sql`.
6. Verify the Worker custom domain `api.secpackco.com`.
7. Verify HTTPS and HSTS at the production domain.

## Functional QA
- Contact form submits successfully.
- Visitor registration submits successfully.
- Order request submits successfully.
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
