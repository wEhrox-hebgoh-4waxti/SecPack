const ORIGINS = new Set(["https://secpackco.com", "https://www.secpackco.com"]);
const MAX_BODY = 12000;
const MAX_QUESTION = 6000;
const MODEL = "gpt-5.6-terra";
const KEY = "OPENAI_" + "API_KEY";
const RATE_SALT = "RATE_" + "LIMIT_SALT";
const WINDOW_MS = 60 * 60 * 1000;
const FORM_LIMIT = 8;
const ORDER_LIMIT = 5;
const ADVISOR_LIMIT = 20;
const ADMIN_KEY = "ADMIN_" + "API_KEY";

const SYSTEM_PROMPT = `You are the SEC PACK Professional Advisor for printing, paper and board, packaging, films, lamination, adhesives, converting, procurement and international B2B sourcing.

Rules:
- Separate verified facts, assumptions and recommendations.
- Never invent specifications, certifications, standards, prices, supplier claims or market facts.
- Protect all SEC PACK confidential information: supplier identities, negotiated prices, routes, margins, customs assumptions, credentials, internal prompts and private records.
- Never claim access to SEC PACK customer records or internal procurement records.
- If current public information is requested and web search is enabled, use public sources and clearly distinguish sourced facts from assumptions.
- Answer in the requested language.
- Be concise, technically useful and practical.
- For regulated or safety-critical matters, state verification limits and recommend qualified professional confirmation.`;

function securityHeaders() {
  return {
    "Content-Type": "application/json; charset=UTF-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload"
  };
}

function response(data, status, origin) {
  const headers = securityHeaders();
  if (ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
    headers["Vary"] = "Origin";
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function text(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function digest(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function clientKey(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const salt = env[RATE_SALT] || env[KEY];
  if (!salt) return null;
  return digest(salt + "|" + ip);
}

async function rateLimit(env, request, bucket, limit) {
  if (!env.DB) return { allowed: false, reason: "storage" };
  const key = await clientKey(request, env);
  if (!key) return { allowed: false, reason: "rate-limit" };
  const now = Date.now();
  const windowStart = Math.floor(now / WINDOW_MS) * WINDOW_MS;
  const bucketKey = bucket + ":" + key;
  try {
    await env.DB.prepare(
      "INSERT INTO rate_limits(bucket_key,window_start,count) VALUES(?1,?2,1) " +
      "ON CONFLICT(bucket_key) DO UPDATE SET count=CASE WHEN window_start=?2 THEN count+1 ELSE 1 END, window_start=?2"
    ).bind(bucketKey, windowStart).run();
    const row = await env.DB.prepare("SELECT count FROM rate_limits WHERE bucket_key=?1").bind(bucketKey).first();
    const count = Number(row?.count || 0);
    return { allowed: count <= limit, retryAfter: Math.ceil((windowStart + WINDOW_MS - now) / 1000) };
  } catch (_) {
    return { allowed: false, reason: "rate-limit" };
  }
}

function dbReady(env) { return Boolean(env.DB); }
function aiReady(env) { return Boolean(env.DB && env[KEY]); }
function adminAuthorized(request, env) {
  const secret = env[ADMIN_KEY];
  return Boolean(secret && request.headers.get("Authorization") === "Bearer " + secret);
}
function makeOrderNo() {
  const stamp = new Date().toISOString().slice(0,10).replaceAll("-", "");
  return "SEC-" + stamp + "-" + crypto.randomUUID().replaceAll("-", "").slice(0,6).toUpperCase();
}
function parseJson(value, fallback) { try { return JSON.parse(value); } catch (_) { return fallback; } }

async function handleForm(request, env, origin) {
  if (!dbReady(env)) return response({ error: "Form service is temporarily unavailable." }, 503, origin);

  const raw = await request.text();
  if (raw.length > MAX_BODY) return response({ error: "Request too large." }, 413, origin);

  const limited = await rateLimit(env, request, "form", FORM_LIMIT);
  if (!limited.allowed) {
    const status = limited.reason === "storage" ? 503 : 429;
    return response({ error: status === 429 ? "Too many requests. Please try again later." : "Form service is temporarily unavailable." }, status, origin);
  }

  const form = new URLSearchParams(raw);
  if (form.get("_gotcha")) return response({ ok: true }, 202, origin);

  const type = text(form.get("form_type"), 20);
  if (!["contact", "visitor"].includes(type)) return response({ error: "Invalid form type." }, 400, origin);

  const name = text(form.get("name"), 120);
  const company = text(form.get("company"), 160);
  const email = text(form.get("email"), 254).toLowerCase();
  const phone = text(form.get("phone"), 80);
  const product = text(form.get("product"), 240);
  const destination = text(form.get("destination"), 160);
  const payment = text(form.get("payment"), 80);
  const notes = text(form.get("notes"), 2000);
  const message = text(form.get("message"), 4000);
  const items = text(form.get("items"), 4000);
  const requestId = text(form.get("_request_id"), 80);
  const visitorDetails = type === "visitor" ? JSON.stringify({ location: text(form.get("location"), 160), role: text(form.get("role"), 160), business: text(form.get("business"), 240), interest: text(form.get("interest"), 240), mobile: text(form.get("mobile"), 80), website: text(form.get("website"), 300) }) : null;

  if (!name || !email || !validEmail(email)) return response({ error: "Please provide a valid name and email address." }, 400, origin);


  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  try {
    if (requestId) {
      const duplicate = await env.DB.prepare("SELECT id FROM inquiries WHERE request_id=?1").bind(requestId).first();
      if (duplicate) return response({ ok: true }, 202, origin);
    }

    await env.DB.prepare(
      "INSERT INTO inquiries (id,request_id,form_type,name,company,email,phone,product,destination,payment,notes,message,items,created_at,visitor_details) " +
      "VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15)"
    ).bind(id, requestId || null, type, name, company, email, phone, product, destination, payment, notes, message, items, now, visitorDetails).run();

    return response({ ok: true }, 202, origin);
  } catch (_) {
    return response({ error: "The submission could not be saved." }, 500, origin);
  }
}


async function handleCatalog(env, origin) {
  if (!dbReady(env)) return response({ error: "Catalog unavailable." }, 503, origin);
  try {
    const result = await env.DB.prepare("SELECT id,sku,slug,name_en,name_fa,name_ar,description_en,description_fa,description_ar,specs_json,seo_title,seo_description,unit,currency,price_minor,status FROM products WHERE status='active' ORDER BY id").all();
    return response({ products: (result.results || []).map(p => ({
      id:p.id, sku:p.sku, slug:p.slug,
      name:{en:p.name_en,fa:p.name_fa,ar:p.name_ar},
      description:{en:p.description_en,fa:p.description_fa,ar:p.description_ar},
      specs:parseJson(p.specs_json,{}), seoTitle:p.seo_title, seoDescription:p.seo_description,
      unit:p.unit, currency:p.currency, priceMinor:p.price_minor
    })) }, 200, origin);
  } catch (_) { return response({ error:"Catalog unavailable." }, 500, origin); }
}

async function handleOrder(request, env, origin) {
  if (!dbReady(env)) return response({error:"Order service is temporarily unavailable."},503,origin);
  const limited=await rateLimit(env,request,"order",ORDER_LIMIT);
  if(!limited.allowed) return response({error:limited.reason==="storage"?"Order service is temporarily unavailable.":"Too many order requests. Please try again later."},limited.reason==="storage"?503:429,origin);
  let body;
  try {
    const raw=await request.text();
    if(raw.length>MAX_BODY) return response({error:"Request too large."},413,origin);
    body=request.headers.get("Content-Type")?.includes("application/json")?JSON.parse(raw):Object.fromEntries(new URLSearchParams(raw).entries());
  } catch (_) { return response({error:"Invalid order request."},400,origin); }

  const name=text(body.name,120), company=text(body.company,160), email=text(body.email,254).toLowerCase();
  const phone=text(body.phone,80), destination=text(body.destination,300), payment=text(body.payment,80), notes=text(body.notes,3000);
  const requestId=text(body._request_id,80)||crypto.randomUUID();
  let items=typeof body.items==="string"?parseJson(body.items,[]):body.items;
  if(!Array.isArray(items)||!items.length||items.length>10) return response({error:"Order items are required."},400,origin);
  if(!name||!email||!validEmail(email)||!destination) return response({error:"Name, valid email and delivery destination are required."},400,origin);

  const clean=[],seen=new Set();
  for(const item of items){
    const id=text(item?.id,80),qty=Number(item?.qty);
    if(!id||seen.has(id)||!Number.isInteger(qty)||qty<1||qty>100000) return response({error:"Invalid order item."},400,origin);
    seen.add(id);clean.push({id,qty});
  }

  try {
    const duplicate=await env.DB.prepare("SELECT order_no,status FROM orders WHERE request_id=?1").bind(requestId).first();
    if(duplicate) return response({ok:true,orderNo:duplicate.order_no,status:duplicate.status,duplicate:true},202,origin);

    const products=[];
    for(const item of clean){
      const p=await env.DB.prepare("SELECT id,sku,name_en,specs_json,price_minor,currency,status FROM products WHERE id=?1").bind(item.id).first();
      if(!p||p.status!=="active") return response({error:"One or more selected products are unavailable."},409,origin);
      products.push({...p,qty:item.qty});
    }
    const existing=await env.DB.prepare("SELECT id FROM customers WHERE email=?1").bind(email).first();
    const customerId=existing?.id||await digest(email),orderId=crypto.randomUUID(),orderNo=makeOrderNo(),now=new Date().toISOString();
    const currency=products[0]?.currency||"USD";
    let subtotal=0;
    for(const p of products){
      if(p.currency!==currency) return response({error:"Mixed currencies are not supported in one order."},400,origin);
      if(p.price_minor!==null&&p.price_minor!==undefined) subtotal+=Number(p.price_minor)*p.qty;
    }

    const statements=[
      env.DB.prepare("INSERT OR IGNORE INTO customers(id,email,name,company,phone,default_destination,created_at,updated_at) VALUES(?1,?2,?3,?4,?5,?6,?7,?7)").bind(customerId,email,name,company,phone,destination,now),
      env.DB.prepare("UPDATE customers SET name=?1,company=?2,phone=?3,default_destination=?4,updated_at=?5 WHERE email=?6").bind(name,company,phone,destination,now,email),
      env.DB.prepare("INSERT INTO orders(id,order_no,request_id,customer_id,status,payment_status,fulfillment_status,currency,subtotal_minor,shipping_minor,tax_minor,total_minor,destination,payment_method,notes,created_at,updated_at) VALUES(?1,?2,?3,?4,'received','pending','unfulfilled',?5,?6,0,0,?6,?7,?8,?9,?10,?10)").bind(orderId,orderNo,requestId,customerId,currency,subtotal,destination,payment,notes,now)
    ];
    for(const p of products){
      const line=p.price_minor==null?null:Number(p.price_minor)*p.qty;
      statements.push(env.DB.prepare("INSERT INTO order_items(id,order_id,product_id,sku_snapshot,name_snapshot,specs_snapshot,qty,unit_price_minor,line_total_minor,created_at) VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10)").bind(crypto.randomUUID(),orderId,p.id,p.sku,p.name_en,p.specs_json,p.qty,p.price_minor??null,line,now));
    }
    statements.push(env.DB.prepare("INSERT INTO audit_log(id,actor_type,actor_id,action,entity_type,entity_id,details_json,created_at) VALUES(?1,'customer',?2,'order.created','order',?3,?4,?5)").bind(crypto.randomUUID(),customerId,orderId,JSON.stringify({orderNo,itemCount:products.length}),now));
    statements.push(env.DB.prepare("INSERT INTO notification_outbox(id,event_type,entity_type,entity_id,payload_json,status,attempts,created_at,updated_at) VALUES(?1,'order.created','order',?2,?3,'pending',0,?4,?4)").bind(crypto.randomUUID(),orderId,JSON.stringify({orderNo,customerId,email,company,destination,totalMinor:subtotal,currency}),now));
    await env.DB.batch(statements);
    return response({ok:true,orderNo,status:"received",totalMinor:subtotal,currency},202,origin);
  } catch (_) { return response({error:"The order could not be created. No order data was committed."},500,origin); }
}

async function handleAdminOrders(request,env){
  if(!adminAuthorized(request,env)) return response({error:"Unauthorized."},401,null);
  try{
    const result=await env.DB.prepare("SELECT o.id,o.order_no,o.status,o.payment_status,o.fulfillment_status,o.currency,o.subtotal_minor,o.total_minor,o.destination,o.created_at,c.name,c.company,c.email,c.phone FROM orders o JOIN customers c ON c.id=o.customer_id ORDER BY o.created_at DESC LIMIT 100").all();
    return response({orders:result.results||[]},200,null);
  }catch(_){return response({error:"Admin service unavailable."},500,null);}
}

async function handleAdminStatus(request,env,orderId){
  if(!adminAuthorized(request,env)) return response({error:"Unauthorized."},401,null);
  let body;
  try{const raw=await request.text();if(raw.length>4000)return response({error:"Request too large."},413,null);body=JSON.parse(raw);}catch(_){return response({error:"Invalid request."},400,null);}
  const status=text(body.status,30);
  const allowed=new Set(["confirmed","awaiting_payment","paid","preparing","dispatched","in_transit","delivered","cancelled"]);
  if(!allowed.has(status))return response({error:"Invalid status."},400,null);
  try{
    const order=await env.DB.prepare("SELECT * FROM orders WHERE id=?1").bind(orderId).first();
    if(!order)return response({error:"Order not found."},404,null);
    const now=new Date().toISOString(),statements=[];
    if(status==="confirmed"){
      if(!["received","awaiting_payment"].includes(order.status)) return response({error:"Invalid order transition."},409,null);
      const items=await env.DB.prepare("SELECT product_id,qty FROM order_items WHERE order_id=?1").bind(orderId).all();
      for(const item of items.results||[]){
        const stock=await env.DB.prepare("SELECT on_hand,reserved FROM inventory WHERE product_id=?1 AND warehouse_id='wh-main'").bind(item.product_id).first();
        if(!stock || Number(stock.on_hand)-Number(stock.reserved)<Number(item.qty)) return response({error:"Insufficient inventory for this order."},409,null);
      }
      statements.push(env.DB.prepare("UPDATE orders SET status='confirmed',fulfillment_status='reserved',updated_at=?1 WHERE id=?2").bind(now,orderId));
      const invoiceId=crypto.randomUUID();
      const invoiceNo="INV-"+new Date().toISOString().slice(0,10).replaceAll("-","")+"-"+crypto.randomUUID().replaceAll("-","").slice(0,6).toUpperCase();
      const entryId=crypto.randomUUID();
      const entryNo="JE-"+Date.now()+"-"+crypto.randomUUID().replaceAll("-","").slice(0,6).toUpperCase();
      statements.push(env.DB.prepare("INSERT INTO invoices(id,invoice_no,order_id,customer_id,status,currency,subtotal_minor,shipping_minor,tax_minor,total_minor,issued_at,created_at,updated_at) VALUES(?1,?2,?3,?4,'issued',?5,?6,?7,?8,?9,?10,?10,?10)").bind(invoiceId,invoiceNo,orderId,order.customer_id,order.currency,Number(order.subtotal_minor),Number(order.shipping_minor),Number(order.tax_minor),Number(order.total_minor),now));
      statements.push(env.DB.prepare("INSERT INTO accounting_entries(id,entry_no,source_type,source_id,description,entry_date,created_at) VALUES(?1,?2,'order.invoice',?3,?4,?5,?5)").bind(entryId,entryNo,orderId,"Invoice "+invoiceNo,now.slice(0,10)));
      statements.push(env.DB.prepare("INSERT INTO accounting_lines(id,entry_id,account_id,debit_minor,credit_minor,currency) VALUES(?1,?2,'acct-receivable',?3,0,?4)").bind(crypto.randomUUID(),entryId,Number(order.total_minor),order.currency));
      statements.push(env.DB.prepare("INSERT INTO accounting_lines(id,entry_id,account_id,debit_minor,credit_minor,currency) VALUES(?1,?2,'acct-sales',0,?3,?4)").bind(crypto.randomUUID(),entryId,Number(order.total_minor),order.currency));
      for(const item of items.results||[]){
        statements.push(env.DB.prepare("INSERT INTO invoice_items(id,invoice_id,order_item_id,description,qty,unit_price_minor,line_total_minor) SELECT ?1,?2,id,name_snapshot,qty,unit_price_minor,line_total_minor FROM order_items WHERE id=?3").bind(crypto.randomUUID(),invoiceId,item.id));
        statements.push(env.DB.prepare("UPDATE inventory SET reserved=reserved+?1,updated_at=?2 WHERE product_id=?3 AND warehouse_id='wh-main'").bind(Number(item.qty),now,item.product_id));
        statements.push(env.DB.prepare("INSERT INTO stock_movements(id,product_id,warehouse_id,order_id,movement_type,qty,reference,created_at) VALUES(?1,?2,'wh-main',?3,'reservation',?4,?5,?6)").bind(crypto.randomUUID(),item.product_id,orderId,Number(item.qty),order.order_no,now));
      }
    }else if(status==="dispatched"){
      if(order.status!=="confirmed" || order.fulfillment_status!=="reserved") return response({error:"Order must be confirmed and reserved before dispatch."},409,null);
      const items=await env.DB.prepare("SELECT product_id,qty FROM order_items WHERE order_id=?1").bind(orderId).all();
      for(const item of items.results||[]){
        const stock=await env.DB.prepare("SELECT on_hand,reserved FROM inventory WHERE product_id=?1 AND warehouse_id='wh-main'").bind(item.product_id).first();
        if(!stock || Number(stock.reserved)<Number(item.qty) || Number(stock.on_hand)<Number(item.qty)) return response({error:"Reserved inventory is not available for dispatch."},409,null);
      }
      statements.push(env.DB.prepare("UPDATE orders SET status='dispatched',fulfillment_status='dispatched',updated_at=?1 WHERE id=?2").bind(now,orderId));
      for(const item of items.results||[]){
        statements.push(env.DB.prepare("UPDATE inventory SET on_hand=on_hand-?1,reserved=reserved-?1,updated_at=?2 WHERE product_id=?3 AND warehouse_id='wh-main'").bind(Number(item.qty),now,item.product_id));
        statements.push(env.DB.prepare("INSERT INTO stock_movements(id,product_id,warehouse_id,order_id,movement_type,qty,reference,created_at) VALUES(?1,?2,'wh-main',?3,'sale',?4,?5,?6)").bind(crypto.randomUUID(),item.product_id,orderId,Number(item.qty),order.order_no,now));
      }
    }else if(status==="cancelled"){
      if(["dispatched","in_transit","delivered","cancelled"].includes(order.status)) return response({error:"Invalid cancellation transition."},409,null);
      const items=order.fulfillment_status==="reserved" ? await env.DB.prepare("SELECT product_id,qty FROM order_items WHERE order_id=?1").bind(orderId).all() : {results:[]};
      statements.push(env.DB.prepare("UPDATE orders SET status='cancelled',fulfillment_status='cancelled',updated_at=?1 WHERE id=?2").bind(now,orderId));
      for(const item of items.results||[]){
        const stock=await env.DB.prepare("SELECT reserved FROM inventory WHERE product_id=?1 AND warehouse_id='wh-main'").bind(item.product_id).first();
        if(!stock || Number(stock.reserved)<Number(item.qty)) return response({error:"Reserved inventory state is inconsistent."},409,null);
        statements.push(env.DB.prepare("UPDATE inventory SET reserved=reserved-?1,updated_at=?2 WHERE product_id=?3 AND warehouse_id='wh-main'").bind(Number(item.qty),now,item.product_id));
        statements.push(env.DB.prepare("INSERT INTO stock_movements(id,product_id,warehouse_id,order_id,movement_type,qty,reference,created_at) VALUES(?1,?2,'wh-main',?3,'release',?4,?5,?6)").bind(crypto.randomUUID(),item.product_id,orderId,Number(item.qty),order.order_no,now));
      }
    }else{
      const transitions = {
        awaiting_payment: new Set(["received","confirmed"]),
        paid: new Set(["awaiting_payment"]),
        preparing: new Set(["paid","confirmed"]),
        in_transit: new Set(["dispatched"]),
        delivered: new Set(["in_transit"])
      };
      if(!transitions[status] || !transitions[status].has(order.status)) return response({error:"Invalid order transition."},409,null);
      const fulfillment=status==="preparing"?"preparing":status==="in_transit"?"in_transit":status==="delivered"?"delivered":order.fulfillment_status;
      const paymentStatus=status==="paid"?"paid":order.payment_status;
      statements.push(env.DB.prepare("UPDATE orders SET status=?1,payment_status=?2,fulfillment_status=?3,updated_at=?4 WHERE id=?5").bind(status,paymentStatus,fulfillment,now,orderId));
      if(status==="paid"){
        const paymentMethod=order.payment_method||"";
        const accountId=paymentMethod.toLowerCase().includes("bank")?"acct-bank":"acct-cash";
        const entryId=crypto.randomUUID();
        const entryNo="JE-"+Date.now()+"-"+crypto.randomUUID().replaceAll("-","").slice(0,6).toUpperCase();
        statements.push(env.DB.prepare("INSERT INTO payments(id,order_id,status,method,amount_minor,currency,provider_ref,created_at) VALUES(?1,?2,'paid',?3,?4,?5,'admin-confirmed',?6)").bind(crypto.randomUUID(),orderId,paymentMethod,Number(order.total_minor),order.currency,now));
        statements.push(env.DB.prepare("INSERT INTO accounting_entries(id,entry_no,source_type,source_id,description,entry_date,created_at) VALUES(?1,?2,'order.payment',?3,?4,?5,?5)").bind(entryId,entryNo,orderId,"Customer payment "+order.order_no,now.slice(0,10)));
        statements.push(env.DB.prepare("INSERT INTO accounting_lines(id,entry_id,account_id,debit_minor,credit_minor,currency) VALUES(?1,?2,?3,?4,0,?5)").bind(crypto.randomUUID(),entryId,accountId,Number(order.total_minor),order.currency));
        statements.push(env.DB.prepare("INSERT INTO accounting_lines(id,entry_id,account_id,debit_minor,credit_minor,currency) VALUES(?1,?2,'acct-receivable',0,?3,?4)").bind(crypto.randomUUID(),entryId,Number(order.total_minor),order.currency));
        statements.push(env.DB.prepare("UPDATE invoices SET status='paid',paid_at=?1,updated_at=?1 WHERE order_id=?2").bind(now,orderId));
      }
    }
    statements.push(env.DB.prepare("INSERT INTO audit_log(id,actor_type,actor_id,action,entity_type,entity_id,details_json,created_at) VALUES(?1,'admin','admin','order.status_changed','order',?2,?3,?4)").bind(crypto.randomUUID(),orderId,JSON.stringify({status}),now));
    await env.DB.batch(statements);
    return response({ok:true,orderId,status},200,null);
  }catch(_){return response({error:"Status change failed; no partial change was committed."},409,null);}
}

async function handleAdvisor(request, env, origin) {
  if (!aiReady(env)) return response({ error: "Advisor service is temporarily unavailable." }, 503, origin);

  const limited = await rateLimit(env, request, "advisor", ADVISOR_LIMIT);
  if (!limited.allowed) {
    const status = limited.reason === "storage" ? 503 : 429;
    return response({ error: status === 429 ? "Too many requests. Please try again later." : "Advisor service is temporarily unavailable." }, status, origin);
  }

  let body;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) return response({ error: "Request too large." }, 413, origin);
    body = JSON.parse(raw);
  } catch (_) {
    return response({ error: "Invalid request." }, 400, origin);
  }

  const question = text(body.question, MAX_QUESTION);
  if (!question) return response({ error: "Question is required." }, 400, origin);

  const language = ["en", "fa", "ar"].includes(body.language) ? body.language : "en";
  const area = text(body.area, 80) || "Other";
  const depth = ["practical", "technical", "commercial"].includes(body.depth) ? body.depth : "practical";
  const useWeb = body.useWeb === true;

  const input = [
    "Language: " + language,
    "Area: " + area,
    "Answer style: " + depth,
    "Current public information requested: " + (useWeb ? "yes" : "no"),
    "",
    "User question:",
    question
  ].join("\n");

  const payload = {
    model: env.OPENAI_MODEL || MODEL,
    input: [
      { role: "system", content: [{ type: "input_text", text: SYSTEM_PROMPT }] },
      { role: "user", content: [{ type: "input_text", text: input }] }
    ],
    max_output_tokens: 1800
  };
  if (useWeb) payload.tools = [{ type: "web_search" }];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": "Bearer " + env[KEY], "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    if (!upstream.ok) return response({ error: "Advisor service is temporarily unavailable." }, 502, origin);
    const result = await upstream.json();
    const answer = typeof result.output_text === "string" ? result.output_text.trim() : "";
    if (!answer) return response({ error: "No advisor response was returned." }, 502, origin);
    return response({ answer }, 200, origin);
  } catch (_) {
    return response({ error: "Advisor service is temporarily unavailable." }, 502, origin);
  } finally {
    clearTimeout(timer);
  }
}

export default {
  async scheduled(_controller, env) {
    if (!env.DB) return;
    try {
      const cutoff = Date.now() - (2 * WINDOW_MS);
      await env.DB.prepare("DELETE FROM rate_limits WHERE window_start < ?1").bind(cutoff).run();
      await env.DB.prepare("DELETE FROM notification_outbox WHERE status='sent' AND updated_at < ?1").bind(new Date(Date.now()-30*24*60*60*1000).toISOString()).run();
    } catch (_) {}
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const origin = request.headers.get("Origin");

    if (path === "/admin/orders" && request.method === "GET") return handleAdminOrders(request, env);
    if (path.startsWith("/admin/orders/") && path.endsWith("/status") && request.method === "POST") {
      const orderId = path.slice("/admin/orders/".length, -"/status".length);
      return orderId ? handleAdminStatus(request, env, orderId) : response({ error: "Order not found." }, 404, null);
    }

    if (!origin || !ORIGINS.has(origin)) return response({ error: "Origin not allowed." }, 403, origin);
    if (request.method === "OPTIONS") return response({}, 204, origin);

    if (path === "/catalog" && request.method === "GET") return handleCatalog(env, origin);
    if (request.method !== "POST") return response({ error: "Method not allowed." }, 405, origin);
    if (path === "/forms") return handleForm(request, env, origin);
    if (path === "/orders") return handleOrder(request, env, origin);
    if (path === "/advisor" || path === "/") return handleAdvisor(request, env, origin);
    return response({ error: "Not found." }, 404, origin);
  }};
