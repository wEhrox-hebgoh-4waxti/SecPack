const ACCOUNTING_API="https://api.secpackco.com";
const dbName="secpack-offline-v1";

function idb(){
  return new Promise((resolve,reject)=>{
    const r=indexedDB.open(dbName,1);
    r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains("queue"))d.createObjectStore("queue",{keyPath:"id"});};
    r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
  });
}
async function queueItem(kind,payload){
  const d=await idb(),tx=d.transaction("queue","readwrite");
  tx.objectStore("queue").put({id:crypto.randomUUID(),kind,payload,created_at:new Date().toISOString()});
  return new Promise((resolve,reject)=>{tx.oncomplete=()=>resolve(true);tx.onerror=()=>reject(tx.error);});
}
async function drainQueue(){
  if(!navigator.onLine)return;
  const d=await idb();
  const readTx=d.transaction("queue","readonly"),s=readTx.objectStore("queue");
  const items=await new Promise((res,rej)=>{const r=s.getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});
  for(const item of items){
    try{
      await accountingApi(item.kind,item.payload);
      const delTx=d.transaction("queue","readwrite");delTx.objectStore("queue").delete(item.id);
    }catch(e){
      if(e.status>=400&&e.status<500&&e.status!==429){
        const delTx=d.transaction("queue","readwrite");delTx.objectStore("queue").delete(item.id);
      }
    }
  }
}
async function accountingApi(path,payload,method="POST"){
  const headers={"Accept":"application/json"};
  if(method!=="GET"){
    headers["Content-Type"]="application/json";
    const key=String(payload?.request_id||crypto.randomUUID());
    headers["X-Idempotency-Key"]=key;
  }
  const r=await fetch(ACCOUNTING_API+path,{method,headers,credentials:"include",body:method==="GET"?undefined:JSON.stringify(payload)});
  const d=await r.json().catch(()=>({}));
  if(!r.ok){const e=new Error(d.error||"خطا");e.status=r.status;throw e;}
  return d;
}
function a(id){return document.getElementById(id);}
function amoney(v,c){const digits=["USD","EUR","GBP","AED","SAR","TRY"].includes(c)?2:0;return Number(v||0).toLocaleString("fa-IR",{maximumFractionDigits:digits})+" "+c;}
function fromMinor(v,c){return Number(v||0)/(["USD","EUR","GBP","AED","SAR","TRY"].includes(c)?100:1);}
function renderAccounting(d){
  const sm=d.summary||[],inv=d.inventory||{},div=a("accountingSummary");
  if(div){
    const frag=document.createDocumentFragment();
    sm.forEach(x=>{
      const card=document.createElement("div");card.className="admin-card";
      const h=document.createElement("h3");h.textContent="فروش / دریافت / هزینه · "+x.currency;
      const p=document.createElement("div");p.textContent=amoney(fromMinor(x.sales_minor,x.currency),x.currency)+" / "+amoney(fromMinor(x.payments_minor,x.currency),x.currency)+" / "+amoney(fromMinor(x.expenses_minor,x.currency),x.currency);
      card.append(h,p);frag.append(card);
    });
    const invCard=document.createElement("div");invCard.className="admin-card";
    const ih=document.createElement("h3");ih.textContent="موجودی / رزرو / فروش";
    const ip=document.createElement("div");ip.className="stat";ip.textContent=Number(inv.qty||0)+" / "+Number(inv.reserved||0)+" / "+Number(inv.sold||0);
    invCard.append(ih,ip);frag.append(invCard);div.replaceChildren(frag);
  }
  ["entryAccount","costAccount","receiptAccount","accountOffset"].forEach(id=>{
    const s=a(id);if(!s)return;s.replaceChildren();
    if(id==="costAccount"||id==="receiptAccount"){const z=document.createElement("option");z.value="";z.textContent="حساب پرداخت را انتخاب کنید";s.append(z);}
    (d.accounts||[]).forEach(x=>{const o=document.createElement("option");o.value=x.id;o.textContent=x.name+" · "+x.currency;s.append(o);});
  });
  const box=a("accountingAccounts");if(box)box.replaceChildren(...(d.accounts||[]).map(x=>{
    const e=document.createElement("div");e.className="account-row";const b=document.createElement("b");b.textContent=x.name;
    const s=document.createElement("span");s.textContent=amoney(fromMinor(x.current_balance_minor,x.currency),x.currency);e.append(b,s);return e;
  }));
  const costs=a("accountingCosts");if(costs)costs.replaceChildren(...(d.costs||[]).slice(0,20).map(x=>{
    const e=document.createElement("div");e.className="account-row";const s=document.createElement("span");s.textContent=x.category+" · "+x.description;
    const b=document.createElement("b");b.textContent=amoney(fromMinor(x.amount_minor,x.currency),x.currency);e.append(s,b);return e;
  }));
  window.SEC_PACK_ADMIN_PRODUCTS=d.products||window.SEC_PACK_ADMIN_PRODUCTS||[];
  const flags=d.flags||[],flagBox=a("auditFlags");if(flagBox)flagBox.replaceChildren(...(flags.length?flags.map(x=>{
    const e=document.createElement("div");e.className="audit-flag "+String(x.severity||"");const b=document.createElement("b");b.textContent=x.title;
    const p=document.createElement("p");p.textContent=x.message;const s=document.createElement("small");s.textContent=x.suggested_action||"";e.append(b,p,s);return e;
  }):[document.createTextNode("مغایرت یا کاستی باز شناسایی نشد.")]));
  const docs=d.docs||[],docBox=a("documentList");if(docBox)docBox.replaceChildren(...docs.slice(0,15).map(x=>{
    const wrap=document.createElement("div");wrap.className="document-chip";const open=document.createElement("button");
    open.textContent=x.title+" · "+new Date(x.created_at).toLocaleDateString("fa-IR");
    open.onclick=async()=>{try{const q=await accountingApi("/admin/document?id="+encodeURIComponent(x.id),null,"GET");const w=window.open();if(w){const img=w.document.createElement("img");img.style.maxWidth="100%";img.style.height="auto";img.src=q.data_url;img.alt="document";w.document.body.append(img);}}catch(err){alert(err.message)}};
    const share=document.createElement("button");share.textContent="ارسال / اشتراک ۷ روزه";
    share.onclick=async()=>{try{const q=await accountingApi("/admin/document/share",{request_id:crypto.randomUUID(),id:x.id});if(navigator.share){await navigator.share({title:"SEC PACK · "+x.title,text:"Secure document link (valid 7 days):",url:q.url});}else{await navigator.clipboard?.writeText(q.url);alert("لینک امن ۷ روزه کپی شد.");}}catch(err){if(err.name!=="AbortError")alert(err.message)}};
    wrap.append(open,share);return wrap;
  }));
}
async function loadSupplyCases(){
  try{
    const d=await accountingApi("/admin/supply-cases",null,"GET"),box=a("supplyCases"),select=a("supplyProduct");
    if(select&&window.SEC_PACK_ADMIN_PRODUCTS)select.replaceChildren(...window.SEC_PACK_ADMIN_PRODUCTS.map(p=>{const o=document.createElement("option");o.value=p.id;o.textContent=p.name_fa;return o;}));
    if(!box)return;
    const names={factory_order:"سفارش کارخانه",factory_payment:"پرداخت کارخانه",customs:"گمرک",transport:"حمل",warehouse_receipt:"ورود انبار گرگان",ready_for_delivery:"آماده تحویل"};
    const frag=document.createDocumentFragment();
    d.cases.forEach(c=>{
      const card=document.createElement("div");card.className="quote";const title=document.createElement("strong");title.textContent=c.case_no+" · "+(c.supplier||"بدون تأمین‌کننده");
      const meta=document.createElement("p");meta.textContent="تعداد: "+c.quantity+" · ارزش خرید: "+fromMinor(c.purchase_total_minor,c.currency)+" "+c.currency+" · وضعیت: "+c.status;card.append(title,meta);
      d.milestones.filter(m=>m.case_id===c.id).forEach(m=>{
        const row=document.createElement("div");row.className="account-row";const label=document.createElement("span");label.textContent=names[m.milestone_type]||m.milestone_type;
        const sel=document.createElement("select");["pending","in_progress","done","blocked"].forEach(s=>{const o=document.createElement("option");o.value=s;o.textContent=s;o.selected=m.status===s;sel.append(o);});
        sel.onchange=async()=>{try{await accountingApi("/admin/supply-milestone",{request_id:crypto.randomUUID(),id:m.id,status:sel.value});await loadSupplyCases();}catch(e){alert(e.message)}};
        row.append(label,sel);card.append(row);
      });frag.append(card);
    });box.replaceChildren(frag);
  }catch(e){const box=a("supplyCases");if(box)box.textContent=e.message;}
}
async function loadAccounting(){try{const d=await accountingApi("/admin/accounting",null,"GET");renderAccounting(d);return d}catch(e){const x=a("accountingStatus");if(x)x.textContent=e.message;}}
async function saveAccountingForm(form,path){
  const payload=Object.fromEntries(new FormData(form).entries());payload.request_id=crypto.randomUUID();
  if(!navigator.onLine){await queueItem(path,payload);form.reset();a("accountingStatus").textContent="ثبت آفلاین شد و پس از اتصال همگام می‌شود.";return;}
  try{await accountingApi(path,payload);form.reset();await loadAccounting();a("accountingStatus").textContent="ثبت شد و دفتر مالی به‌روزرسانی شد.";}
  catch(e){
    if(e.status===429||!e.status||e.status>=500){await queueItem(path,payload);a("accountingStatus").textContent="ارتباط قطع شد؛ مورد در صف آفلاین ذخیره شد.";}
    else a("accountingStatus").textContent=e.message;
  }
}
document.addEventListener("DOMContentLoaded",()=>{
  a("accountForm")?.addEventListener("submit",e=>{e.preventDefault();saveAccountingForm(e.currentTarget,"/admin/account");});
  a("entryForm")?.addEventListener("submit",e=>{e.preventDefault();saveAccountingForm(e.currentTarget,"/admin/accounting/entry");});
  a("costForm")?.addEventListener("submit",e=>{e.preventDefault();saveAccountingForm(e.currentTarget,"/admin/supply-cost");});
  a("receiptForm")?.addEventListener("submit",e=>{e.preventDefault();saveAccountingForm(e.currentTarget,"/admin/stock-receipt");});
  a("supplyCaseForm")?.addEventListener("submit",e=>{e.preventDefault();saveAccountingForm(e.currentTarget,"/admin/supply-case").then(loadSupplyCases);});
  a("auditRun")?.addEventListener("click",async()=>{try{await accountingApi("/admin/audit",{request_id:crypto.randomUUID()});await loadAccounting();}catch(e){alert(e.message);}});
  a("assistantRun")?.addEventListener("click",async()=>{const out=a("assistantOutput");out.textContent="در حال بررسی…";try{const d=await accountingApi("/admin/accounting/assistant",{request_id:crypto.randomUUID()});out.textContent=d.answer||"تحلیلی دریافت نشد.";}catch(e){out.textContent=e.message;}});
  a("documentForm")?.addEventListener("submit",async e=>{
    e.preventDefault();const file=a("documentFile").files[0];if(!file)return;
    if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>6*1024*1024){a("accountingStatus").textContent="فقط تصویر JPG/PNG/WebP تا ۶ مگابایت مجاز است.";return;}
    const img=new Image(),url=URL.createObjectURL(file);img.onload=async()=>{
      try{
        const max=1280,scale=Math.min(1,max/img.width,max/img.height),canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
        const dataUrl=canvas.toDataURL("image/jpeg",0.68),payload={request_id:crypto.randomUUID(),title:a("documentTitle").value.trim()||file.name,document_type:a("documentType").value,reference_type:a("documentRefType").value,reference_id:a("documentRefId").value,notes:a("documentNotes").value,data_url:dataUrl,captured_offline:!navigator.onLine};
        URL.revokeObjectURL(url);
        try{if(navigator.onLine)await accountingApi("/admin/document",payload);else await queueItem("/admin/document",payload);e.target.reset();a("accountingStatus").textContent=navigator.onLine?"تصویر سند ثبت شد.":"تصویر سند آفلاین ذخیره شد و بعداً همگام می‌شود.";await loadAccounting();}catch(err){if(err.status===429||!err.status||err.status>=500)await queueItem("/admin/document",payload);a("accountingStatus").textContent="تصویر در صف آفلاین قرار گرفت.";}
      }catch(err){URL.revokeObjectURL(url);a("accountingStatus").textContent="پردازش سند ناموفق بود.";}
    };
    img.onerror=()=>{URL.revokeObjectURL(url);a("accountingStatus").textContent="فایل تصویر قابل خواندن نیست.";};
    img.src=url;
  });
  window.addEventListener("online",async()=>{await drainQueue();await loadAccounting();});
  loadAccounting().then(loadSupplyCases);drainQueue();
});