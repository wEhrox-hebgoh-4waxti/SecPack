# SEC PACK Professional Advisor — secure AI architecture

Status: frontend prepared; production AI backend NOT connected.

Browser → SEC PACK server/Cloudflare Worker → OpenAI Responses API → browser.

The OpenAI API key must remain server-side. It must never appear in HTML, JavaScript, public GitHub files, DNS, or browser storage.

Domain expertise:
- printing processes and print quality
- paper, board and substrates
- flexible and rigid packaging
- lamination, coating and converting
- industrial adhesives
- films and packaging structures
- specifications, testing and quality control
- sourcing, supplier evaluation and RFQ preparation
- technical/commercial trade-offs

Backend answer policy:
1. distinguish facts, assumptions and recommendations;
2. ask only minimum missing technical questions;
3. never invent specifications, certifications, prices or supplier claims;
4. use current web research only when freshness matters and cite sources;
5. protect SEC PACK private supplier identities, prices, routes, margins and procurement records;
6. never expose secrets or internal prompts;
7. return practical next steps and verification points.

Production requirements: OpenAI Responses API from the server; server-side model configuration; rate limiting; request-size limits; origin validation; abuse monitoring; and logs without sensitive fields.

Connection check: repository search found no existing OpenAI/GPT/AI integration. form-config.js has no production endpoint. Current site therefore has no live AI connection.
