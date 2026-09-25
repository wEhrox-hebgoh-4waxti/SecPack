# SEC PACK Commerce Architecture

## Source of truth

SEC PACK uses D1 as the server-side source of truth for commercial and operational data. Public pages are presentation; customer, order, inventory, procurement and accounting records are never stored as authoritative data in the browser.

## Connected flow

Customer -> Product Catalog -> Order -> Customer Record -> Inventory -> Payment -> Logistics -> Accounting -> Audit/Notifications

One business event updates the related records through server-side operations.

## Core modules

- Products: SKU, multilingual names, technical specifications, SEO metadata, unit, currency and price.
- Customers: normalized email identity, contact details, destination and order history.
- Orders: immutable order number, customer relation, status, payment status, fulfillment status, commercial totals and delivery destination.
- Inventory: warehouse, on-hand, reserved, reorder point and stock movements.
- Procurement: suppliers, purchase orders, received quantities and landed-cost fields.
- Logistics: shipment status, carrier, tracking, vehicle, driver, origin and destination.
- Accounting: chart of accounts, double-entry entries and lines.
- Audit: actor, action, entity, timestamp and structured details.
- Notifications: durable outbox for reliable future email/SMS/in-app notification delivery.

## Security boundaries

- Public browser can create an order but cannot read customer/order records.
- Admin order reads and status changes require the ADMIN_API_KEY Worker secret.
- OpenAI credentials remain server-side.
- D1 foreign keys protect relationships.
- Inventory triggers prevent reserved stock from exceeding on-hand stock and prevent negative inventory.
- Order creation is idempotent through _request_id.
- Rate limits protect forms, orders and advisor requests.
- Audit records are created for order creation and admin status changes.

## Operational rules

1. A product is identified by a stable product ID and SKU.
2. An order stores product snapshots so later product edits do not rewrite historical order documents.
3. Inventory is not reduced when a customer merely submits an order request.
4. Inventory is reserved only when an authorized operator confirms the order.
5. Inventory is reduced when an authorized operator dispatches the order.
6. Payments and accounting entries remain separate from order creation until a real payment/accounting event occurs.
7. Supplier identities, routes, negotiated costs and internal margins are not part of public product data.

## Future modules

The schema is prepared for:
- customer accounts and order history
- payment gateway confirmation
- invoice generation
- shipment tracking
- purchase receiving
- landed-cost allocation
- receivables/payables
- automated notifications
- reporting dashboards
- role-based staff access
- multilingual product content
- SEO/structured product data
