# SEC PACK Security Policy

## Public repository rule

This repository is for the public SEC PACK website only.

Never commit:
- supplier contact details that are not intended for public release
- purchase prices, target prices, margins or negotiation records
- private logistics routes or customs information
- customer personal data
- API keys, passwords, access tokens or payment credentials
- private documents or internal procurement records

Confidential procurement and administrative data must be stored in a separate private system and must never be loaded by the public website.

## Reporting a security issue

Please report suspected security vulnerabilities privately to the SEC PACK owner rather than publishing sensitive details in a public issue.

## Scope

The public website is intentionally designed as a static information and storefront layer. Authentication, payment authorization, order processing and confidential business data must be handled by a protected server-side system, not by client-side JavaScript or GitHub Pages.
