const ACCOUNTING_API="https://api.secpackco.com";
const dbName="secpack-offline-v1";
let accountingToken=()=>window.SEC_PACK_ADMIN_TOKEN||"";

function idb(){
  return new Promise((resolve,reject)=>{
    const r=indexedDB.open(dbName,1);
    r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains("queue"))d.createObjectStore("queue",{keyPath:"id"});};
    r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
  });
}
async function queueItem(kind,payload){
  const d=await idb(),tx=d.transaction("queue","readwrite");tx.objectStore("queue").put({id:crypto.randomUUID(),kind,payload,created_at:new Date().toISOString()});return tx.complete;
}
async function drainQueue(){
  if(!navigator.onLine||!accountingToken())return;
  const d=await idb(),tx=d.transaction("queue","readwrite"),s=tx.objectStore("queue"),items=await new Promise((res,rej)=>{const r=s.getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});
  for(const item of items){
    try{await accountingApi(item.kind,item.payload);s.delete(item.id);}catch(_){}
  }
}
async function accountingApi(path,payload,method="POST"){
  const r=await fetch(ACCOUNTING_API+path,{method,headers:{Accept:"application/json","Content-Type":"application/json",Authorization:"Bearer "+accountingToken()},body:method==="GET"?undefined:JSON.stringify(payload)});
  const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||"خطا");return d;
}
function a(id){return document.getElementById(id);}
function amoney(v,c){const digits=["USD","EUR","GBP","AED","SAR","TRY"].includes(c)?2:0;return Number(v||0).toLocaleString("fa-IR",{maximumFractionDigits:digits})+" "+c;}
function renderAccounting(d){
  const box=a("accountingAccounts");box.replaceChildren(...d.accounts.map(x=>{const e=document.createElement("div");e.className="account-row";e.innerHTML="<b>"+escapeHtml(x.name)+"</b><span>"+amoney(Number(x.current_balance_minor)/(["USD","EUR","GBP","AED","SAR","TRY"].includes(x.currency)?100:1),x.currency)+"</span>";return e;}));
  a("accountingCosts").replaceChildren(...d.costs.slice(0,20).map(x=>{const e=document.createElement("div");e.className="account-row";e.innerHTML="<span>"+escapeHtml(x.category)+" · "+escapeHtml(x.description)+"</span><b>"+amoney(Number(x.amount_minor)/(["USD","EUR","GBP","AED","SAR","TRY"].includes(x.currency)?100:1),x.currency)+"</b>";return e;}));
  const flags=d.flags||[];a("auditFlags").replaceChildren(...(flags.length?flags.map(x=>{const e=document.createElement("div");e.className="audit-flag "+escapeHtml(x.severity);e.innerHTML="<b>"+escapeHtml(x.title)+"</b><p>"+escapeHtml(x.message)+"</p><small>"+escapeHtml(x.suggested_action||"")+"</small>";return e;}):[document.createTextNode("مغایرت یا کاستی باز شناسایی نشد.")]));
  a("documentList").replaceChildren(...d.docs.slice(0,15).map(x=>{const wrap=document.createElement("div");wrap.className="document-chip";const open=document.createElement("button");open.textContent=x.title+" · "+new Date(x.created_at).toLocaleDateString("fa-IR");open.onclick=async()=>{try{const q=await accountingApi("/admin/document?id="+encodeURIComponent(x.id),null,"GET");const w=window.open();if(w)w.document.write("<img style='max-width:100%;height:auto' src='"+q.data_url+"' alt='document'>");}catch(err){alert(err.message)}};const share=document.createElement("button");share.textContent="اشتراک ۷ روزه";share.onclick=async()=>{try{const q=await accountingApi("/admin/document/share",{id:x.id});await navigator.clipboard?.writeText(q.url);alert("لینک امن ۷ روزه کپی شد.");}catch(err){alert(err.message)}};wrap.append(open,share);return wrap;}));
}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
async function loadAccounting(){try{const d=await accountingApi("/admin/accounting",null,"GET");renderAccounting(d);return d}catch(e){const x=a("accountingStatus");if(x)x.textContent=e.message;}}
async function saveAccountingForm(form,path){
  const payload=Object.fromEntries(new FormData(form).entries());
  if(!navigator.onLine){await queueItem(path,payload);form.reset();a("accountingStatus").textContent="ثبت آفلاین شد و پس از اتصال همگام می‌شود.";return;}
  try{await accountingApi(path,payload);form.reset();await loadAccounting();a("accountingStatus").textContent="ثبت شد و دفتر مالی به‌روزرسانی شد.";}catch(e){await queueItem(path,payload);a("accountingStatus").textContent="ارتباط قطع شد؛ مورد در صف آفلاین ذخیره شد.";}
}
document.addEventListener("DOMContentLoaded",()=>{
  a("accountForm")?.addEventListener("submit",e=>{e.preventDefault();saveAccountingForm(e.currentTarget,"/admin/account");});
  a("entryForm")?.addEventListener("submit",e=>{e.preventDefault();saveAccountingForm(e.currentTarget,"/admin/accounting/entry");});
  a("costForm")?.addEventListener("submit",e=>{e.preventDefault();saveAccountingForm(e.currentTarget,"/admin/supply-cost");});
  a("receiptForm")?.addEventListener("submit",e=>{e.preventDefault();saveAccountingForm(e.currentTarget,"/admin/stock-receipt");});
  a("auditRun")?.addEventListener("click",async()=>{try{await accountingApi("/admin/audit",{});await loadAccounting();}catch(e){alert(e.message);}});
  a("assistantRun")?.addEventListener("click",async()=>{const out=a("assistantOutput");out.textContent="در حال بررسی…";try{const d=await accountingApi("/admin/accounting/assistant",{});out.textContent=d.answer||"تحلیلی دریافت نشد.";}catch(e){out.textContent=e.message;}});
  a("documentForm")?.addEventListener("submit",async e=>{
    e.preventDefault();const file=a("documentFile").files[0];if(!file)return;
    const img=new Image(),url=URL.createObjectURL(file);img.onload=async()=>{
      const max=1280,scale=Math.min(1,max/img.width,max/img.height),canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
      const dataUrl=canvas.toDataURL("image/jpeg",0.68);URL.revokeObjectURL(url);
      const payload={title:a("documentTitle").value.trim()||file.name,document_type:a("documentType").value,reference_type:a("documentRefType").value,reference_id:a("documentRefId").value,notes:a("documentNotes").value,data_url:dataUrl,captured_offline:!navigator.onLine};
      try{if(navigator.onLine)await accountingApi("/admin/document",payload);else await queueItem("/admin/document",payload);e.target.reset();a("accountingStatus").textContent=navigator.onLine?"تصویر سند ثبت شد.":"تصویر سند آفلاین ذخیره شد و بعداً همگام می‌شود.";await loadAccounting();}catch(err){await queueItem("/admin/document",payload);a("accountingStatus").textContent="تصویر در صف آفلاین قرار گرفت.";}
    };img.src=url;
  });
  window.addEventListener("online",async()=>{await drainQueue();await loadAccounting();});
  loadAccounting();drainQueue();
});
