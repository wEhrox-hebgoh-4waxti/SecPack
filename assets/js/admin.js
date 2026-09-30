const API="https://api.secpackco.com";
let token="",lastAlertIds=new Set(),timer=null,originalTitle=document.title,titleTimer=null;
const $=id=>document.getElementById(id);
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function money(v,c){return Number(v||0).toLocaleString("en-US",{maximumFractionDigits:["USD","EUR","GBP","AED","SAR","TRY"].includes(c)?2:0})+" "+c;}
function requestKey(opts={}){
  if(opts.idempotencyKey)return String(opts.idempotencyKey);
  try{const body=opts.body?JSON.parse(opts.body):null;if(body?.request_id)return String(body.request_id);}catch(_){}
  return crypto.randomUUID();
}
async function api(path,opts={}){
  const headers={"Accept":"application/json","Content-Type":"application/json",...(opts.headers||{})};
  if(token)headers.Authorization="Bearer "+token;
  const isMutation=(opts.method||"GET").toUpperCase()!=="GET";
  if(isMutation&&path!=="/admin/session"&&path!=="/admin/logout")headers["X-Idempotency-Key"]=requestKey(opts);
  const r=await fetch(API+path,{...opts,headers,credentials:"include"});
  const d=await r.json().catch(()=>({}));
  if(!r.ok){const e=new Error(d.error||"خطا");e.status=r.status;throw e;}
  return d;
}
function el(tag,textValue){const e=document.createElement(tag);if(textValue!==undefined)e.textContent=String(textValue);return e;}
function renderStats(d){
  const p=d.products.reduce((s,x)=>({stock:s.stock+Math.max(0,Number(x.stock_qty||0)-Number(x.reserved_qty||0)),res:s.res+Number(x.reserved_qty||0),sold:s.sold+Number(x.sold_qty||0)}),{stock:0,res:0,sold:0});
  const salesRows=(d.totals||[]).map(x=>money(x.sales_minor,x.currency)).join(" · ")||"0";
  const paymentRows=(d.totals||[]).map(x=>money(x.payments_minor,x.currency)).join(" · ")||"0";
  const values=[["موجودی قابل فروش",p.stock],["رزرو سفارش‌ها",p.res],["فروش تجمعی (تعداد)",p.sold],["فروش ثبت‌شده",salesRows],["دریافت‌های ثبت‌شده",paymentRows]];
  const frag=document.createDocumentFragment();
  values.forEach(([label,value])=>{const card=el("div");card.className="admin-card";card.append(el("h3",label),el("div",value));card.lastChild.className="stat";frag.append(card);});
  $("stats").replaceChildren(frag);
}
function renderAlerts(a){
  const frag=document.createDocumentFragment();
  if(!a.length){frag.append(el("span","هشدار جدیدی ندارید."));$("alerts").replaceChildren(frag);return;}
  a.forEach(x=>{const box=el("div");box.className="alert-item";box.append(el("b",x.title),el("br"),el("span",x.message),el("br"),el("small",new Date(x.created_at).toLocaleString()));const b=el("button","خوانده شد");b.className="btn";b.dataset.read=x.id;box.append(b);frag.append(box);});
  $("alerts").replaceChildren(frag);
}
function renderProducts(ps){
  const frag=document.createDocumentFragment();
  ps.forEach(p=>{
    const tr=el("tr"),name=el("td"),nameB=el("b",p.name_fa),nameSmall=el("small",p.name_en);name.append(nameB,el("br"),nameSmall);
    const tdCur=el("td"),cur=el("input");cur.dataset.currency=p.id;cur.value=p.currency;tdCur.append(cur);
    const tdPrice=el("td"),price=el("input");price.dataset.price=p.id;price.inputMode="decimal";price.value=p.unit_price_minor?((["USD","EUR","GBP","AED","SAR","TRY"].includes(p.currency))?p.unit_price_minor/100:p.unit_price_minor):"";tdPrice.append(price);
    const tdStock=el("td"),stock=el("input");stock.dataset.stock=p.id;stock.type="number";stock.min="0";stock.step="1";stock.value=p.stock_qty;stock.disabled=true;stock.title="برای حفظ یکپارچگی، موجودی فقط از مسیر رسید انبار/فروش تغییر می‌کند";tdStock.append(stock);
    const reserved=el("td",p.reserved_qty),sold=el("td",p.sold_qty);
    const tdActive=el("td"),active=el("input");active.dataset.active=p.id;active.type="checkbox";active.checked=Boolean(p.active);tdActive.append(active);
    const tdSave=el("td"),save=el("button","ذخیره");save.className="btn";save.dataset.save=p.id;tdSave.append(save);
    tr.append(name,tdCur,tdPrice,tdStock,reserved,sold,tdActive,tdSave);frag.append(tr);
  });
  $("products").replaceChildren(frag);
  const sf=document.createDocumentFragment();
  ps.filter(p=>p.active).forEach(p=>{const amount=p.unit_price_minor?((["USD","EUR","GBP","AED","SAR","TRY"].includes(p.currency))?p.unit_price_minor/100:p.unit_price_minor):0;const o=el("option",p.name_fa+" — "+money(amount,p.currency));o.value=p.id;sf.append(o);});
  $("saleProduct").replaceChildren(sf);
  const rf=document.createDocumentFragment();
  ps.filter(p=>p.active).forEach(p=>{const o=el("option",p.name_fa);o.value=p.id;rf.append(o);});
  $("receiptProduct")?.replaceChildren(rf);
}
function renderAuditLog(rows){
  const box=$("auditLog");if(!box)return;const frag=document.createDocumentFragment();
  if(!rows.length){frag.append(el("span","هنوز تغییری ثبت نشده است."));box.replaceChildren(frag);return;}
  rows.slice(0,40).forEach(x=>{const item=el("div");item.className="alert-item";item.append(el("b",x.action+" · "+x.entity_type),el("br"),el("span",x.entity_id||"—"),el("br"),el("small",new Date(x.created_at).toLocaleString()));frag.append(item);});box.replaceChildren(frag);
}
function renderOrders(os){
  const frag=document.createDocumentFragment();
  os.forEach(o=>{
    const tr=el("tr"),order=el("td",o.order_no),customer=el("td");customer.append(el("span",o.customer_name),el("br"),el("small",o.phone||""));
    const dest=el("td",o.destination||"—"),total=el("td",money(o.total,o.currency)),pay=el("td",o.payment_status),statusTd=el("td"),sel=el("select");sel.dataset.status=o.id;
    ["pending","processing","paid","ready","fulfilled","cancelled"].forEach(s=>{const op=el("option",s);op.value=s;op.selected=o.status===s;sel.append(op);});statusTd.append(sel);
    const date=el("td",new Date(o.created_at).toLocaleString()),act=el("td"),b=el("button","ذخیره");b.className="btn";b.dataset.orderSave=o.id;act.append(b);
    if(o.payment_status==="paid"){const rb=el("button","استرداد");rb.className="btn";rb.dataset.refund=o.id;act.append(rb);}
    tr.append(order,customer,dest,total,pay,statusTd,date,act);frag.append(tr);
  });$("orders").replaceChildren(frag);
}
async function load(){
  try{
    const d=await api("/admin/dashboard",{method:"GET"});renderStats(d);renderAlerts(d.alerts);renderProducts(d.products);renderOrders(d.orders);
    const audit=await api("/admin/audit-log",{method:"GET"});renderAuditLog(audit.entries||[]);
    for(const a of d.alerts){if(!lastAlertIds.has(a.id)){lastAlertIds.add(a.id);startTitleAlarm("سفارش جدید SEC PACK");if("vibrate"in navigator)navigator.vibrate?.([250,100,250]);if("Notification"in window&&Notification.permission==="granted")new Notification("SEC PACK · "+a.title,{body:a.message});}}
  }catch(e){$("loginStatus").textContent=e.message;logout();}
}
function stopTitleAlarm(){if(titleTimer)clearInterval(titleTimer);titleTimer=null;document.title=originalTitle;}
function beepAlarm(){
  try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const ctx=new C(),now=ctx.currentTime;
    [0,0.18,0.36].forEach((offset,i)=>{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type="sine";osc.frequency.value=i===1?1046:880;gain.gain.setValueAtTime(0.0001,now+offset);gain.gain.exponentialRampToValueAtTime(0.12,now+offset+0.02);gain.gain.exponentialRampToValueAtTime(0.0001,now+offset+0.14);osc.connect(gain);gain.connect(ctx.destination);osc.start(now+offset);osc.stop(now+offset+0.15);});
    setTimeout(()=>ctx.close().catch(()=>{}),800);
  }catch(_){}
}
function startTitleAlarm(message){stopTitleAlarm();beepAlarm();let on=false;titleTimer=setInterval(()=>{on=!on;document.title=on?"🔔 "+message:originalTitle;},900);}
async function logout(){try{await fetch(API+"/admin/logout",{method:"POST",headers:{"Accept":"application/json"},credentials:"include"});}catch(_){}token="";window.SEC_PACK_ADMIN_TOKEN="";if(timer)clearInterval(timer);stopTitleAlarm();$("dashboard").classList.add("hidden");$("login").classList.remove("hidden");$("adminToken").value="";}
$("loginForm").addEventListener("submit",async e=>{
  e.preventDefault();token=$("adminToken").value.trim();
  try{await api("/admin/session",{method:"POST"});token="";window.SEC_PACK_ADMIN_TOKEN="";await api("/admin/dashboard",{method:"GET"});$("login").classList.add("hidden");$("dashboard").classList.remove("hidden");await load();timer=setInterval(load,5000);}
  catch(e){$("loginStatus").textContent="کلید مدیریت نادرست است یا سرویس آماده نیست.";token="";window.SEC_PACK_ADMIN_TOKEN="";}
});
$("logoutBtn").onclick=logout;$("refreshBtn").onclick=load;
$("notifyBtn").onclick=async()=>{if("Notification"in window){const p=await Notification.requestPermission();$("notifyBtn").textContent=p==="granted"?"هشدارها فعال شد":"اجازه هشدار داده نشد";}};
document.addEventListener("click",async e=>{
  const save=e.target.closest("[data-save]");
  if(save){const id=save.dataset.save;try{await api("/admin/product",{method:"POST",body:JSON.stringify({request_id:crypto.randomUUID(),id,currency:document.querySelector("[data-currency='"+id+"']").value,unit_price:document.querySelector("[data-price='"+id+"']").value,stock_qty:Number(document.querySelector("[data-stock='"+id+"']").value),active:document.querySelector("[data-active='"+id+"']").checked})});await load();}catch(x){alert(x.message);}}
  const rs=e.target.closest("[data-read]");
  if(rs){try{await api("/admin/alerts/read",{method:"POST",body:JSON.stringify({request_id:crypto.randomUUID(),id:rs.dataset.read})});await load();}catch(x){alert(x.message);}}
  const rf=e.target.closest("[data-refund]");
  if(rf){
    const returnInventory=window.confirm("آیا کالای تحویل‌شده نیز به موجودی برگردد؟ لغو = فقط استرداد مالی.");
    if(window.confirm("استرداد این سفارش قطعی است؟")){
      try{await api("/admin/refund",{method:"POST",body:JSON.stringify({request_id:crypto.randomUUID(),order_id:rf.dataset.refund,return_inventory:returnInventory})});await load();}catch(x){alert(x.message);}
    }
  }
  const os=e.target.closest("[data-order-save]");
  if(os){const id=os.dataset.orderSave,status=document.querySelector("[data-status='"+id+"']").value;try{await api("/admin/order-status",{method:"POST",body:JSON.stringify({request_id:crypto.randomUUID(),order_id:id,status})});await load();}catch(x){alert(x.message);}}
});
$("saleForm").addEventListener("submit",async e=>{
  e.preventDefault();const submit=e.submitter||e.target.querySelector("button[type=submit]");if(submit)submit.disabled=true;
  try{const d=await api("/admin/sale",{method:"POST",body:JSON.stringify({request_id:crypto.randomUUID(),product_id:$("saleProduct").value,quantity:Number($("saleQty").value),unit_price:$("salePrice").value||undefined,customer:$("saleCustomer").value})});$("saleStatus").textContent="فروش ثبت شد: "+money(d.total,d.currency);e.target.reset();await load();}
  catch(x){$("saleStatus").textContent=x.message;}finally{if(submit)submit.disabled=false;}
});