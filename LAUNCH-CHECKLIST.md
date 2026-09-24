# SEC PACK — Launch & Sales Readiness Checklist

## 1. Website work already prepared
- EN / فارسی / العربی language system and RTL support
- Product pages and scientific product guide
- B2B cart and order-request flow
- Visitor registration and contact inquiry flows
- Local draft preservation when the production endpoint is not configured
- Production form transport adapter
- Honeypot anti-spam field on public contact forms
- GitHub Pages deployment workflow and basic SEO/security files
- No supplier identities, procurement prices, margins, credentials or private logistics data in the public site

## 2. Owner actions before public launch

### A. Create the form receiving account
Recommended simple launch path: Formspree.
Create one Formspree project and one form for SEC PACK submissions. After creation, send the form endpoint to the site maintainer so it can be inserted into `form-config.js`.

### B. Secure the form settings
- Verify the receiving business email.
- Keep spam protection enabled.
- Restrict submissions to `secpackco.com` after the domain is live.
- Keep the website honeypot field enabled.
- Never place an API key or secret in the public GitHub repository.

### C. Connect the custom domain
- Add/verify `secpackco.com` in GitHub Pages settings.
- Configure the DNS records required by GitHub Pages at the domain registrar.
- Configure `www` if you want the www address too.
- Enable HTTPS after GitHub makes it available.
- After the domain is live, update canonical URLs, Open Graph URLs, sitemap and robots.txt to the production domain.

### D. Business email
- Use a dedicated SEC PACK business mailbox for website inquiries and orders.
- Verify that mailbox with the form provider.

### E. First real end-to-end test
1. Open the site on iPhone.
2. Test EN → فارسی → العربی.
3. Add A4 Copy Paper to the cart.
4. Enter a test order.
5. Submit it.
6. Confirm the success message.
7. Confirm the notification arrives at the SEC PACK business email.
8. Confirm the submission appears in the form dashboard.
9. Confirm customer details, destination, quantity and cart items are present.
10. Repeat once from another browser/device.

## 3. Online payment is a separate stage
The current storefront is designed for B2B quotation/order confirmation first. Do not advertise that online payment is available until product/price rules, shipping/tax/customs treatment, server-side order acceptance, payment confirmation and refunds/cancellations are defined.

For the first A4 shipment from Blue Hills, a reliable B2B order/invoice workflow is more important than exposing a public fixed retail price.

## 4. First A4 shipment — keep procurement private
The public website may show the A4 specification, but supplier identity, negotiated factory price, freight quotes, customs assumptions, margin and internal landed-cost calculations must remain outside the public repository.

Keep a private transaction file containing:
- proforma invoice
- final commercial invoice
- packing list
- certificate/origin and required export documents
- transport document
- customs/import documents
- payment evidence
- agreed specification
- final quantity and gross/net weights
- inspection/quality evidence
- delivery milestones
- all negotiated commercial terms

## 5. Launch gate
Website → secure submission endpoint → email notification → stored submission record → real test order → custom domain → final QA.

Only after that should SEC PACK move to payment integration.