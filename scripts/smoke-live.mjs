const checks = [
  ["homepage", "https://secpackco.com/"],
  ["store", "https://secpackco.com/pages/store.html"],
  ["advisor-page", "https://secpackco.com/pages/advisor.html"],
  ["catalog", "https://api.secpackco.com/catalog"],
  ["health", "https://api.secpackco.com/health"],
  ["ready", "https://api.secpackco.com/ready"],
];

const fail = [];
for (const [name, url] of checks) {
  try {
    const r = await fetch(url, {
      redirect: "manual",
      headers: url.includes("api.secpackco.com") ? { Origin: "https://secpackco.com" } : {},
      signal: AbortSignal.timeout(15000)
    });
    const body = await r.text();
    console.log(name, r.status, r.headers.get("content-type") || "", body.slice(0, 120).replace(/\s+/g, " "));
    if (r.status < 200 || r.status >= 400) fail.push(`${name}: HTTP ${r.status}`);
    if (name === "health" && (!body.includes('"ok":true') || body.includes('"commerceSchema"'))) fail.push(`health: liveness contract violation ${body}`);
    if (name === "ready" && (!body.includes('"ok":true') || !body.includes('"commerceSchema":true'))) fail.push(`ready: schema not ready ${body}`);
    if (name === "catalog" && /"(?:(?:unit_)?price(?:_minor)?|stock_qty|reserved_qty|sold_qty|unit_cost_minor|warehouse)"/.test(body)) {
      fail.push("catalog: public response contains internal commercial/inventory fields");
    }
  } catch (e) {
    fail.push(`${name}: ${e.message}`);
  }
}

try {
  const r = await fetch("https://api.secpackco.com/catalog", {
    method: "OPTIONS",
    headers: { Origin: "https://secpackco.com", "Access-Control-Request-Method": "GET" },
    signal: AbortSignal.timeout(15000)
  });
  console.log("catalog-cors-preflight", r.status, r.headers.get("access-control-allow-origin") || "");
  if (r.status !== 204) fail.push(`catalog-cors-preflight: HTTP ${r.status}`);
} catch (e) {
  fail.push(`catalog-cors-preflight: ${e.message}`);
}

if (fail.length) {
  console.error("\nLIVE SMOKE FAILED");
  for (const x of fail) console.error("-", x);
  process.exit(1);
}
console.log("\nLIVE SMOKE PASSED");


try {
  const r = await fetch("https://api.secpackco.com/catalog", {
    headers: { Origin: "https://evil.example" },
    signal: AbortSignal.timeout(15000)
  });
  console.log("catalog-invalid-origin", r.status);
  if (r.status !== 403) fail.push(`catalog-invalid-origin: expected 403, got ${r.status}`);
} catch (e) {
  fail.push(`catalog-invalid-origin: ${e.message}`);
}
