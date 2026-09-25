# SEC PACK Security Policy

## Public repository rule

This repository contains only public website assets and deployment code. Never commit customer personal data, private supplier records, negotiated prices, margins, private logistics, credentials, API keys, payment credentials or confidential documents.

## Customer data architecture

Public pages never read customer records. Customer submissions are sent only to the SEC PACK API Worker and stored server-side in Cloudflare D1. There is no public D1 read endpoint.

The browser receives only a generic success/error response; it does not receive customer records, database rows or internal identifiers.

## Secrets

OpenAI credentials and rate-limit salts must be Cloudflare Secrets. They must never be placed in HTML, browser JavaScript, Git history, public repository files, URLs or browser storage.

## Security controls

The production API enforces exact-origin CORS, HTTPS-only security headers, request-size limits, server-side validation, prepared SQL statements, per-client rate limiting with hashed client keys, honeypot anti-bot handling, duplicate-submission protection and no-store responses.

## Data retention

Customer records should be retained only for the period required for active business operations and legal/accounting obligations. A private administrative process must periodically delete records that are no longer required.

## Incident response

Security vulnerabilities and suspected data exposure must be handled privately and not disclosed through public repository issues.
