const API="https://api.secpackco.com";
let token="",lastAlertIds=new Set(),timer=null,originalTitle=document.title,titleTimer=null;
const $=id=>document.getElementById(id);
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function money(v,c){return Number(v||0).toLocaleString("en-US",{maximumFractionDigits:["USD","EUR","GBP","AED","SAR","TRY"].includes(c)?2:0})+" "+c;}
async function api(path,opts={}){const headers={"Accept":"application/json","Content-Type":"application/json","Authorization":"Bearer "+token,...(opts.headers||{})};const r=await fetch(API+path,{...opts,headers});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||"خطا");return d;}
function el(tag,textValue){const e=document.createElement(tag);if(textValue!==undefined)e.textContent=String(textValue);return e;}
function renderStats(d){
  const p=d.products.reduce((s,x)=>({stock:s.stock+Number(x.stock_qty||0),res:s.res+Number(x.reserved_qty||0),sold:s.sold+Number(x.sold_qty||0)}),{stock:0,res:0,sold:0});
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
    const tr=el("tr"), name=el("td"), nameB=el("b",p.name_fa), nameSmall=el("small",p.name_en);name.append(nameB,el("br"),nameSmall);
    const tdCur=el("td"),cur=el("input");cur.dataset.currency=p.id;cur.value=p.currency;tdCur.append(cur);
    const tdPrice=el("td"),price=el("input");price.dataset.price=p.id;price.inputMode="decimal";price.value=p.unit_price_minor?((["USD","EUR","GBP","AED","SAR","TRY"].includes(p.currency))?p.unit_price_minor/100:p.unit_price_minor):"";tdPrice.append(price);
    const tdStock=el("td"),stock=el("input");stock.dataset.stock=p.id;stock.type="number";stock.min="0";stock.step="1";stock.value=p.stock_qty;tdStock.append(stock);
    const reserved=el("td",p.reserved_qty),sold=el("td",p.sold_qty);
    const tdActive=el("td"),active=el("input");active.dataset.active=p.id;active.type="checkbox";active.checked=Boolean(p.active);tdActive.append(active);
    const tdSave=el("td"),save=el("button","ذخیره");save.className="btn";save.dataset.save=p.id;tdSave.append(save);
    tr.append(name,tdCur,tdPrice,tdStock,reserved,sold,tdActive,tdSave);frag.append(tr);
  });
  $("products").replaceChildren(frag);
  const sf=document.createDocumentFragment();
  ps.filter(p=>p.active).forEach(p=>{const o=el("option",p.name_fa+" — "+money(p.unit_price_minor?((["USD","EUR","GBP","AED","SAR","TRY"].includes(p.currency))?p.unit_price_minor/100:p.unit_price_minor:0,p.currency));o.value=p.id;sf.append(o);});
  $("saleProduct").replaceChildren(sf);
}
function renderOrders(os){
  const frag=document.createDocumentFragment();
  os.forEach(o=>{
    const tr=el("tr"), order=el("td",o.order_no), customer=el("td");customer.append(el("span",o.customer_name),el("br"),el("small",o.phone||""));
    const dest=el("td",o.destination||"—"),total=el("td",money(o.total,o.currency)),pay=el("td",o.payment_status),statusTd=el("td"),sel=el("select");sel.dataset.status=o.id;
    ["pending","processing","paid","ready","fulfilled","cancelled"].forEach(s=>{const op=el("option",s);op.value=s;op.selected=o.status===s;sel.append(op);});statusTd.append(sel);
    const date=el("td",new Date(o.created_at).toLocaleString()),act=el("td"),b=el("button","ذخیره");b.className="btn";b.dataset.orderSave=o.id;act.append(b);
    tr.append(order,customer,dest,total,pay,statusTd,date,act);frag.append(tr);
  });
  $("orders").replaceChildren(frag);
}
async function load(){try{const d=await api("/admin/dashboard",{method:"GET"});renderStats(d);renderAlerts(d.alerts);renderProducts(d.products);renderOrders(d.orders);for(const a of d.alerts){if(!lastAlertIds.has(a.id)){lastAlertIds.add(a.id);startTitleAlarm("سفارش جدید SEC PACK");if("vibrate"in navigator)navigator.vibrate?.([250,100,250]);if("Notification"in window&&Notification.permission==="granted")new Notification("SEC PACK · "+a.title,{body:a.message});try{new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=").play().catch(()=>{});}catch(_){} }}}catch(e){$("loginStatus").textContent=e.message;logout();}}
function stopTitleAlarm(){if(titleTimer)clearInterval(titleTimer);titleTimer=null;document.title=originalTitle;}
function startTitleAlarm(message){stopTitleAlarm();let on=false;titleTimer=setInterval(()=>{on=!on;document.title=on?"🔔 "+message:originalTitle;},900);}
function logout(){token="";if(timer)clearInterval(timer);stopTitleAlarm();$("dashboard").classList.add("hidden");$("login").classList.remove("hidden");$("adminToken").value="";}
$("loginForm").addEventListener("submit",async e=>{e.preventDefault();token=$("adminToken").value.trim();try{await api("/admin/dashboard",{method:"GET"});$("login").classList.add("hidden");$("dashboard").classList.remove("hidden");await load();timer=setInterval(load,5000);}catch(e){$("loginStatus").textContent="کلید مدیریت نادرست است یا سرویس آماده نیست.";token="";}});
$("logoutBtn").onclick=logout;$("refreshBtn").onclick=load;
$("notifyBtn").onclick=async()=>{if("Notification"in window){const p=await Notification.requestPermission();$("notifyBtn").textContent=p==="granted"?"هشدارها فعال شد":"اجازه هشدار داده نشد";}};
document.addEventListener("click",async e=>{
 const save=e.target.closest("[data-save]");if(save){const id=save.dataset.save;try{await api("/admin/product",{method:"POST",body:JSON.stringify({id,currency:document.querySelector("[data-currency='"+id+"']").value,unit_price:document.querySelector("[data-price='"+id+"']").value,stock_qty:Number(document.querySelector("[data-stock='"+id+"']").value),active:document.querySelector("[data-active='"+id+"']").checked})});await load();}catch(x){alert(x.message);}}
 const rs=e.target.closest("[data-read]");if(rs){await api("/admin/alerts/read",{method:"POST",body:JSON.stringify({id:rs.dataset.read})});await load();}
 const os=e.target.closest("[data-order-save]");if(os){const id=os.dataset.orderSave,status=document.querySelector("[data-status='"+id+"']").value;try{await api("/admin/order-status",{method:"POST",body:JSON.stringify({order_id:id,status})});await load();}catch(x){alert(x.message);}}
});
$("saleForm").addEventListener("submit",async e=>{e.preventDefault();try{const d=await api("/admin/sale",{method:"POST",body:JSON.stringify({product_id:$("saleProduct").value,quantity:Number($("saleQty").value),unit_price:$("salePrice").value||undefined,customer:$("saleCustomer").value})});$("saleStatus").textContent="فروش ثبت شد: "+money(d.total,d.currency);e.target.reset();await load();}catch(x){$("saleStatus").textContent=x.message;}});
