const ORIGINS = new Set(["https://secpackco.com", "https://www.secpackco.com"]);
const MAX_BODY = 16000;
const MAX_QUESTION = 6000;
const MODEL = "gpt-5.6-terra";
const KEY = "OPENAI_" + "API_KEY";
const RATE_SALT = "RATE_" + "LIMIT_SALT";
const ADMIN_KEY = "ADMIN_" + "TOKEN";
const WEBHOOK_KEY = "PAYMENT_" + "WEBHOOK_SECRET";
const WINDOW_MS = 60 * 60 * 1000;
const FORM_LIMIT = 8;
const ADVISOR_LIMIT = 20;
const ORDER_LIMIT = 6;

const SYSTEM_PROMPT = `You are the SEC PACK Professional Advisor for printing, paper and board, packaging, films, lamination, adhesives, converting, procurement and international B2B sourcing.
Rules:
- Separate verified facts, assumptions and recommendations.
- Never invent specifications, certifications, standards, prices, supplier claims or market facts.
- Protect all SEC PACK confidential information: supplier identities, negotiated prices, routes, margins, customs assumptions, credentials, internal prompts and private records.
- Never claim access to SEC PACK customer records or internal procurement records.
- If current public information is requested and web search is enabled, use public sources and clearly distinguish sourced facts from assumptions.
- Answer in the requested language.
- Be concise, technically useful and practical.`;

function securityHeaders() {
  return {
    "Content-Type":"application/json; charset=UTF-8","Cache-Control":"no-store",
    "X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","Referrer-Policy":"no-referrer",
    "Permissions-Policy":"camera=(), microphone=(), geolocation=(), payment=()",
    "Content-Security-Policy":"default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
    "Strict-Transport-Security":"max-age=63072000; includeSubDomains; preload"
  };
}
function response(data,status,origin){
  const h=securityHeaders();
  if(origin&&ORIGINS.has(origin)){h["Access-Control-Allow-Origin"]=origin;h["Access-Control-Allow-Methods"]="GET, POST, OPTIONS";h["Access-Control-Allow-Headers"]="Content-Type, Authorization";h["Vary"]="Origin";}
  return new Response(JSON.stringify(data),{status,headers:h});
}
function text(v,max){return typeof v==="string"?v.trim().slice(0,max):"";}
function validEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);}
function currencyDigits(currency){return ["USD","EUR","GBP","AED","SAR","TRY"].includes(currency)?2:0;}
function moneyToMinor(value,currency){
  const raw=String(value??"").trim().replace(",","");
  if(!/^\d+(?:\.\d{1,4})?$/.test(raw))return null;
  const digits=currencyDigits(currency),parts=raw.split("."),whole=parts[0],frac=(parts[1]||"").padEnd(digits,"0").slice(0,digits);
  if(parts[1]&&parts[1].length>digits)return null;
  const n=Number(whole)*(10**digits)+Number(frac||0);
  return Number.isSafeInteger(n)&&n>=0?n:null;
}
function minorToMoney(minor,currency){const d=currencyDigits(currency);return d?Number(minor||0)/(10**d):Number(minor||0);}

async function digest(v){const b=new TextEncoder().encode(v);const h=await crypto.subtle.digest("SHA-256",b);return Array.from(new Uint8Array(h)).map(x=>x.toString(16).padStart(2,"0")).join("");}
async function clientKey(request,env){const ip=request.headers.get("CF-Connecting-IP")||"unknown";const salt=env[RATE_SALT]||env[KEY];return salt?digest(salt+"|"+ip):null;}
async function rateLimit(env,request,bucket,limit){
  if(!env.DB)return{allowed:false,reason:"storage"};
  const key=await clientKey(request,env);if(!key)return{allowed:false,reason:"rate-limit"};
  const now=Date.now(),start=Math.floor(now/WINDOW_MS)*WINDOW_MS,key2=bucket+":"+key;
  try{
    await env.DB.prepare("INSERT INTO rate_limits(bucket_key,window_start,count) VALUES(?1,?2,1) ON CONFLICT(bucket_key) DO UPDATE SET count=CASE WHEN window_start=?2 THEN count+1 ELSE 1 END, window_start=?2").bind(key2,start).run();
    const row=await env.DB.prepare("SELECT count FROM rate_limits WHERE bucket_key=?1").bind(key2).first();
    return{allowed:Number(row?.count||0)<=limit};
  }catch(_){return{allowed:false,reason:"rate-limit"}}
}
function authorized(request,env){
  const expected=env[ADMIN_KEY];if(!expected)return false;
  const got=request.headers.get("Authorization")||"";
  return got==="Bearer "+expected;
}
function webhookAuthorized(request,env){
  const expected=env[WEBHOOK_KEY];if(!expected)return false;
  return (request.headers.get("Authorization")||"")==="Bearer "+expected;
}
async function readJson(request,max=MAX_BODY){
  const raw=await request.text();if(raw.length>max)throw new Error("too_large");
  try{return JSON.parse(raw)}catch(_){throw new Error("invalid")}
}
async function ensureReady(env){return Boolean(env.DB&&env[KEY]);}

async function handleForm(request,env,origin){
  if(!await ensureReady(env))return response({error:"Form service is temporarily unavailable."},503,origin);
  const raw=await request.text();if(raw.length>MAX_BODY)return response({error:"Request too large."},413,origin);
  const limited=await rateLimit(env,request,"form",FORM_LIMIT);if(!limited.allowed)return response({error:"Too many requests. Please try again later."},limited.reason==="storage"?503:429,origin);
  const form=new URLSearchParams(raw);if(form.get("_gotcha"))return response({ok:true},202,origin);
  const type=text(form.get("form_type"),20);
  if(!["contact","visitor","order"].includes(type))return response({error:"Invalid form type."},400,origin);
  const name=text(form.get("name"),120),company=text(form.get("company"),160),email=text(form.get("email"),254),phone=text(form.get("phone"),80);
  const product=text(form.get("product"),240),destination=text(form.get("destination"),160),payment=text(form.get("payment"),80),notes=text(form.get("notes"),2000),message=text(form.get("message"),4000),items=text(form.get("items"),4000),requestId=text(form.get("_request_id"),80);
  const visitorDetails=type==="visitor"?JSON.stringify({location:text(form.get("location"),160),role:text(form.get("role"),160),business:text(form.get("business"),240),interest:text(form.get("interest"),240),mobile:text(form.get("mobile"),80),website:text(form.get("website"),300)}):null;
  if(!name||!email||!validEmail(email))return response({error:"Please provide a valid name and email address."},400,origin);
  if(type==="order")return createOrder({name,company,email,phone,destination,payment,notes,items,requestId},env,origin);
  const id=crypto.randomUUID(),now=new Date().toISOString();
  try{
    if(requestId&&await env.DB.prepare("SELECT id FROM inquiries WHERE request_id=?1").bind(requestId).first())return response({ok:true},202,origin);
    await env.DB.prepare("INSERT INTO inquiries (id,request_id,form_type,name,company,email,phone,product,destination,payment,notes,message,items,created_at,visitor_details) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15)").bind(id,requestId||null,type,name,company,email,phone,product,destination,payment,notes,message,items,now,visitorDetails).run();
    return response({ok:true},202,origin);
  }catch(_){return response({error:"The submission could not be saved."},500,origin)}
}

async function createOrder(data,env,origin){
  let parsed;
  try{parsed=JSON.parse(data.items||"[]")}catch(_){return response({error:"Invalid order items."},400,origin)}
  if(!Array.isArray(parsed)||!parsed.length||parsed.length>20)return response({error:"Invalid order items."},400,origin);
  const clean=parsed.map(x=>({id:text(x?.id,40),qty:Number(x?.qty)}));
  if(clean.some(x=>!["paper","film","adhesive","packaging"].includes(x.id)||!Number.isInteger(x.qty)||x.qty<1||x.qty>100000))return response({error:"Invalid order items."},400,origin);
  if(!data.name||!validEmail(data.email))return response({error:"Please provide a valid name and email address."},400,origin);
  const ids=[...new Set(clean.map(x=>x.id))],products=[];
  for(const id of ids){const p=await env.DB.prepare("SELECT * FROM products WHERE id=?1 AND active=1").bind(id).first();if(!p||Number(p.unit_price_minor)<=0)return response({error:"One or more selected products are currently unavailable."},409,origin);products.push(p)}
  const map=new Map(products.map(p=>[p.id,p])),orderId=crypto.randomUUID(),orderNo="SP-"+new Date().toISOString().slice(0,10).replaceAll("-","")+"-"+orderId.slice(0,6).toUpperCase(),now=new Date().toISOString();
  const lines=clean.map(x=>{const p=map.get(x.id);return{p,qty:x.qty,line:x.qty*Number(p.unit_price_minor)}});
  const total=lines.reduce((s,x)=>s+x.line,0);
  const statements=[env.DB.prepare("INSERT INTO orders(id,order_no,customer_name,company,email,phone,destination,payment_method,status,payment_status,currency,subtotal,total,subtotal_minor,total_minor,notes,created_at,updated_at) VALUES(?1,?2,?3,?4,?5,?6,?7,?8,'pending','unpaid',?9,?10,?10,?11,?11,?12,?13,?13)").bind(orderId,orderNo,data.name,data.company||null,data.email,data.phone||null,data.destination||null,data.payment||null,products[0]?.currency||"USD",minorToMoney(total,products[0]?.currency||"USD"),total,data.notes||null,now,now)];
  for(const x of lines){
    statements.push(env.DB.prepare("UPDATE products SET stock_qty=stock_qty-?1,reserved_qty=reserved_qty+?1,updated_at=?2 WHERE id=?3 AND active=1 AND unit_price_minor>0").bind(x.qty,now,x.p.id));
    statements.push(env.DB.prepare("INSERT INTO order_items(id,order_id,product_id,product_name,unit,quantity,unit_price,line_total,unit_price_minor,line_total_minor) VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10)").bind(crypto.randomUUID(),orderId,x.p.id,x.p.name_en,x.p.unit,x.qty,minorToMoney(x.p.unit_price_minor,x.p.currency),minorToMoney(x.line,x.p.currency),x.p.unit_price_minor,x.line));
    statements.push(env.DB.prepare("INSERT INTO inventory_ledger(id,product_id,movement_type,quantity,reference_id,note,created_at) VALUES(?1,?2,'RESERVE',?3,?4,'Customer order reservation',?5)").bind(crypto.randomUUID(),x.p.id,x.qty,orderId,now));
  }
  statements.push(env.DB.prepare("INSERT INTO accounting_ledger(id,order_id,entry_type,amount,amount_minor,currency,description,created_at) VALUES(?1,?2,'ORDER',?3,?4,?5,'Order recorded; payment pending',?6)").bind(crypto.randomUUID(),orderId,minorToMoney(total,products[0]?.currency||"USD"),total,products[0]?.currency||"USD",now));
  statements.push(env.DB.prepare("INSERT INTO alerts(id,type,reference_id,title,message,created_at) VALUES(?1,'NEW_ORDER',?2,'New online order',?3,?4)").bind(crypto.randomUUID(),orderId,orderNo+" · "+data.name+" · total "+minorToMoney(total,products[0]?.currency||"USD")+" "+(products[0]?.currency||"USD"),now));
  try{
    await env.DB.batch(statements);
    return response({ok:true,orderId,orderNo,total:minorToMoney(total,products[0]?.currency||"USD"),currency:products[0]?.currency||"USD"},202,origin);
  }catch(e){return response({error:String(e).includes("stock")?"Insufficient stock for one or more products.":"Order could not be created."},409,origin)}
}

async function catalog(env){
  const rows=await env.DB.prepare("SELECT id,name_en,name_fa,name_ar,unit,currency,unit_price_minor,stock_qty,active FROM products WHERE active=1 AND unit_price_minor>0 ORDER BY id").all();
  return rows.results.map(p=>({...p,available_qty:Number(p.stock_qty),unit_price:minorToMoney(p.unit_price_minor,p.currency),unit_price_minor:Number(p.unit_price_minor)}));
}
async function adminDashboard(env){
  const products=(await env.DB.prepare("SELECT id,name_en,name_fa,name_ar,unit,currency,unit_price,stock_qty,reserved_qty,sold_qty,active,updated_at FROM products ORDER BY id").all()).results;
  const rawOrders=(await env.DB.prepare("SELECT id,order_no,customer_name,company,email,phone,destination,status,payment_status,currency,total,total_minor,created_at,updated_at FROM orders ORDER BY created_at DESC LIMIT 50").all()).results;
  const orders=rawOrders.map(o=>({...o,total:Number(o.total_minor||0)?minorToMoney(o.total_minor,o.currency):o.total}));
  const alerts=(await env.DB.prepare("SELECT * FROM alerts WHERE is_read=0 ORDER BY created_at DESC LIMIT 30").all()).results;
  const totals=(await env.DB.prepare("SELECT currency,COALESCE(SUM(CASE WHEN entry_type IN ('SALE','PAYMENT') THEN amount_minor ELSE 0 END),0) AS revenue_minor,COALESCE(SUM(CASE WHEN entry_type='SALE' THEN amount_minor ELSE 0 END),0) AS sales_minor FROM accounting_ledger GROUP BY currency").all()).results;
  return{products,orders,alerts,totals};
}
async function adminProduct(request,env,origin){
  if(!authorized(request,env))return response({error:"Unauthorized."},401,origin);
  const b=await readJson(request),id=text(b.id,40),currency=text(b.currency,8)||"USD",priceMinor=moneyToMinor(b.unit_price,currency),stock=Number(b.stock_qty);
  if(!id||priceMinor===null||!Number.isInteger(stock)||stock<0)return response({error:"Invalid product values."},400,origin);
  const p=await env.DB.prepare("SELECT id,stock_qty FROM products WHERE id=?1").bind(id).first();if(!p)return response({error:"Product not found."},404,origin);
  const now=new Date().toISOString(),delta=stock-Number(p.stock_qty);
  const stm=[env.DB.prepare("UPDATE products SET unit_price=?1,unit_price_minor=?2,currency=?3,active=?4,stock_qty=?5,updated_at=?6 WHERE id=?7").bind(minorToMoney(priceMinor,currency),priceMinor,currency,b.active===false?0:1,stock,now,id)];
  if(delta)stm.push(env.DB.prepare("INSERT INTO inventory_ledger(id,product_id,movement_type,quantity,note,created_at) VALUES(?1,?2,?3,?4,?5,?6)").bind(crypto.randomUUID(),id,delta>0?"RESTOCK":"ADJUST",delta,id+" admin adjustment",now));
  await env.DB.batch(stm);return response({ok:true},200,origin);
}
async function adminSale(request,env,origin){
  if(!authorized(request,env))return response({error:"Unauthorized."},401,origin);
  const b=await readJson(request),id=text(b.product_id,40),qty=Number(b.quantity);
  if(!id||!Number.isInteger(qty)||qty<1||qty>100000)return response({error:"Invalid sale."},400,origin);
  const p=await env.DB.prepare("SELECT * FROM products WHERE id=?1 AND active=1").bind(id).first();if(!p)return response({error:"Product not found."},404,origin);
  const priceMinor=b.unit_price===undefined||b.unit_price===""?Number(p.unit_price_minor):moneyToMinor(b.unit_price,p.currency);
  if(priceMinor===null)return response({error:"Invalid sale price."},400,origin);
  const now=new Date().toISOString(),saleId=crypto.randomUUID(),total=qty*priceMinor;
  try{
    const r=await env.DB.batch([
      env.DB.prepare("UPDATE products SET stock_qty=stock_qty-?1,sold_qty=sold_qty+?1,updated_at=?2 WHERE id=?3").bind(qty,now,id),
      env.DB.prepare("INSERT INTO inventory_ledger(id,product_id,movement_type,quantity,reference_id,note,created_at) VALUES(?1,?2,'SALE',?3,?4,?5,?6)").bind(crypto.randomUUID(),id,qty,saleId,"Manual / in-person sale",now),
      env.DB.prepare("INSERT INTO accounting_ledger(id,entry_type,amount,amount_minor,currency,description,created_at) VALUES(?1,'SALE',?2,?2,?3,?4,?5)").bind(saleId,minorToMoney(total,p.currency),p.currency,"In-person sale",now),
      env.DB.prepare("INSERT INTO alerts(id,type,reference_id,title,message,created_at) VALUES(?1,'SALE',?2,'In-person sale recorded',?3,?4)").bind(crypto.randomUUID(),saleId,qty+" × "+p.name_en+" sold",now)
    ]);

    return response({ok:true,total:minorToMoney(total,p.currency),currency:p.currency},200,origin);
  }catch(e){return response({error:String(e).includes("INSUFFICIENT_STOCK")?"Insufficient stock.":"Sale could not be recorded."},String(e).includes("INSUFFICIENT_STOCK")?409:500,origin)}
}
async function adminOrderStatus(request,env,origin){
  if(!authorized(request,env))return response({error:"Unauthorized."},401,origin);
  const b=await readJson(request),orderId=text(b.order_id,80),next=text(b.status,30);
  if(!orderId||!["pending","processing","paid","ready","fulfilled","cancelled"].includes(next))return response({error:"Invalid order status."},400,origin);
  const order=await env.DB.prepare("SELECT * FROM orders WHERE id=?1").bind(orderId).first();if(!order)return response({error:"Order not found."},404,origin);
  if(order.status==="fulfilled"||order.status==="cancelled")return response({error:"Closed orders cannot be changed."},409,origin);
  if(next==="fulfilled"&&order.payment_status!=="paid")return response({error:"Payment must be confirmed before fulfillment."},409,origin);
  if(next==="paid"&&order.payment_status==="paid")return response({ok:true},200,origin);
  const now=new Date().toISOString(),items=(await env.DB.prepare("SELECT * FROM order_items WHERE order_id=?1").bind(orderId).all()).results,stm=[];
  if(next==="cancelled"){
    for(const x of items)stm.push(env.DB.prepare("UPDATE products SET stock_qty=stock_qty+?1,reserved_qty=MAX(0,reserved_qty-?1),updated_at=?2 WHERE id=?3").bind(x.quantity,now,x.product_id));
    for(const x of items)stm.push(env.DB.prepare("INSERT INTO inventory_ledger(id,product_id,movement_type,quantity,reference_id,note,created_at) VALUES(?1,?2,'RELEASE',?3,?4,'Order cancelled',?5)").bind(crypto.randomUUID(),x.product_id,x.quantity,orderId,now));
  }
  if(next==="fulfilled"){
    for(const x of items){
      stm.push(env.DB.prepare("UPDATE products SET reserved_qty=MAX(0,reserved_qty-?1),sold_qty=sold_qty+?1,updated_at=?2 WHERE id=?3").bind(x.quantity,now,x.product_id));
      stm.push(env.DB.prepare("INSERT INTO inventory_ledger(id,product_id,movement_type,quantity,reference_id,note,created_at) VALUES(?1,?2,'FULFILL',?3,?4,'Order fulfilled',?5)").bind(crypto.randomUUID(),x.product_id,x.quantity,orderId,now));
    }
    stm.push(env.DB.prepare("INSERT INTO accounting_ledger(id,order_id,entry_type,amount,amount_minor,currency,description,created_at) SELECT ?1,id,'SALE',total,total_minor,currency,'Order fulfilled',?2 FROM orders WHERE id=?3").bind(crypto.randomUUID(),now,orderId));
  }
  if(next==="paid")stm.push(env.DB.prepare("INSERT INTO accounting_ledger(id,order_id,entry_type,amount,amount_minor,currency,description,created_at) SELECT ?1,id,'PAYMENT',total,total_minor,currency,'Payment confirmed',?2 FROM orders WHERE id=?3").bind(crypto.randomUUID(),now,orderId));
  stm.push(env.DB.prepare("UPDATE orders SET status=?1,payment_status=CASE WHEN ?1='paid' OR payment_status='paid' THEN 'paid' ELSE payment_status END,updated_at=?2 WHERE id=?3").bind(next,now,orderId));
  stm.push(env.DB.prepare("INSERT INTO alerts(id,type,reference_id,title,message,created_at) VALUES(?1,'ORDER_STATUS',?2,'Order status updated',?3,?4)").bind(crypto.randomUUID(),orderId,order.order_no+" → "+next,now));
  await env.DB.batch(stm);return response({ok:true},200,origin);
}

async function adminRequest(request,env,origin){
  const path=new URL(request.url).pathname;
  if(path==="/admin/dashboard"&&request.method==="GET"){if(!authorized(request,env))return response({error:"Unauthorized."},401,origin);return response(await adminDashboard(env),200,origin)}
  if(path==="/admin/product"&&request.method==="POST")return adminProduct(request,env,origin);
  if(path==="/admin/sale"&&request.method==="POST")return adminSale(request,env,origin);
  if(path==="/admin/order-status"&&request.method==="POST")return adminOrderStatus(request,env,origin);
  if(path==="/admin/alerts/read"&&request.method==="POST"){if(!authorized(request,env))return response({error:"Unauthorized."},401,origin);const b=await readJson(request);await env.DB.prepare("UPDATE alerts SET is_read=1 WHERE id=?1").bind(text(b.id,80)).run();return response({ok:true},200,origin)}
  return response({error:"Not found."},404,origin);
}

async function handleAdvisor(request,env,origin){
  if(!await ensureReady(env))return response({error:"Advisor service is temporarily unavailable."},503,origin);
  const limited=await rateLimit(env,request,"advisor",ADVISOR_LIMIT);if(!limited.allowed)return response({error:"Too many requests. Please try again later."},limited.reason==="storage"?503:429,origin);
  let body;try{body=await readJson(request)}catch(_){return response({error:"Invalid request."},400,origin)}
  const question=text(body.question,MAX_QUESTION);if(!question)return response({error:"Question is required."},400,origin);
  const language=["en","fa","ar"].includes(body.language)?body.language:"en",area=text(body.area,80)||"Other",depth=["practical","technical","commercial"].includes(body.depth)?body.depth:"practical",useWeb=body.useWeb===true;
  const input=["Language: "+language,"Area: "+area,"Answer style: "+depth,"Current public information requested: "+(useWeb?"yes":"no"),"","User question:",question].join("\n");
  const payload={model:env.OPENAI_MODEL||MODEL,input:[{role:"system",content:[{type:"input_text",text:SYSTEM_PROMPT}]},{role:"user",content:[{type:"input_text",text:input}]}],max_output_tokens:1800};if(useWeb)payload.tools=[{type:"web_search"}];
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),25000);
  try{const upstream=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+env[KEY],"Content-Type":"application/json"},body:JSON.stringify(payload),signal:controller.signal});if(!upstream.ok)return response({error:"Advisor service is temporarily unavailable."},502,origin);const result=await upstream.json(),answer=typeof result.output_text==="string"?result.output_text.trim():"";if(!answer)return response({error:"No advisor response was returned."},502,origin);return response({answer},200,origin)}catch(_){return response({error:"Advisor service is temporarily unavailable."},502,origin)}finally{clearTimeout(timer)}
}

export default {
  async scheduled(_controller,env){if(!env.DB)return;try{await env.DB.prepare("DELETE FROM rate_limits WHERE window_start < ?1").bind(Date.now()-2*WINDOW_MS).run()}catch(_){}},
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname==="/health"&&request.method==="GET"){try{const rows=env.DB?(await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('products','orders','order_items','inventory_ledger','accounting_ledger','alerts')").all()).results:[];const tables=new Set(rows.map(x=>x.name));return response({ok:true,service:"secpack-api",database:Boolean(env.DB),commerceSchema:tables.size===6,openai:Boolean(env[KEY]),admin:Boolean(env[ADMIN_KEY]),time:new Date().toISOString()},200,null)}catch(_){return response({ok:false,service:"secpack-api",database:Boolean(env.DB),commerceSchema:false,openai:Boolean(env[KEY]),admin:Boolean(env[ADMIN_KEY])},200,null)}}
    const origin=request.headers.get("Origin");
    if(!origin||!ORIGINS.has(origin))return response({error:"Origin not allowed."},403,origin);
    if(request.method==="OPTIONS")return response({},204,origin);
    if(url.pathname==="/catalog"&&request.method==="GET")try{return response({products:await catalog(env)},200,origin)}catch(_){return response({error:"Catalog unavailable."},503,origin)};
    if(url.pathname.startsWith("/admin/"))return adminRequest(request,env,origin);
    if(url.pathname==="/payment/webhook"&&request.method==="POST"){if(!webhookAuthorized(request,env))return response({error:"Unauthorized."},401,origin);return response({ok:false,error:"Payment provider is not connected yet."},501,origin)}
    if(request.method!=="POST")return response({error:"Method not allowed."},405,origin);
    if(url.pathname==="/forms")return handleForm(request,env,origin);
    if(url.pathname==="/advisor"||url.pathname==="/")return handleAdvisor(request,env,origin);
    return response({error:"Not found."},404,origin);
  }
};
