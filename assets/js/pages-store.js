const STORE_TEXT={
en:{eyebrow:"SUPPLY REQUEST",title:"Request A4 Copy Paper",intro:"Choose the quantity, enter your delivery details and submit a supply request. SEC PACK confirms commercial terms and availability privately.",paper:"A4 Copy Paper",spec:"500 sheets / ream · 5 reams / carton",quantity:"Quantity (reams)",commercial:"Commercial terms",commercialText:"Price and confirmed availability are provided privately by SEC PACK after reviewing the request.",details:"1. Your details",buy:"Submit supply request",stepsTitle:"Simple 3-step supply request",step1:"Choose quantity.",step2:"Enter your details.",step3:"Submit. SEC PACK reviews the request and confirms the next commercial step privately.",ctaEyebrow:"SEC PACK OPERATIONS",ctaTitle:"Supply requests stay connected to operations.",ctaText:"Requests enter one controlled workflow. Pricing, availability, payment and fulfillment remain private.",orderOk:"Request received. SEC PACK has recorded it and will review the commercial and fulfillment details.",ref:"Request reference",failed:"The request could not be completed."},
fa:{eyebrow:"درخواست تأمین",title:"درخواست تأمین کاغذ کپی A4",intro:"تعداد را انتخاب کنید، اطلاعات تحویل را وارد کنید و درخواست تأمین را ارسال کنید. SEC PACK شرایط تجاری و موجودی تأییدشده را به‌صورت خصوصی اعلام می‌کند.",paper:"کاغذ کپی A4",spec:"۵۰۰ برگ در ریم · ۵ ریم در کارتن",quantity:"تعداد (ریم)",commercial:"شرایط تجاری",commercialText:"قیمت و موجودی تأییدشده پس از بررسی درخواست، به‌صورت خصوصی توسط SEC PACK اعلام می‌شود.",details:"۱. اطلاعات خریدار",buy:"ارسال درخواست تأمین",stepsTitle:"درخواست تأمین در ۳ مرحله",step1:"تعداد را انتخاب کنید.",step2:"اطلاعات خود را وارد کنید.",step3:"درخواست را ارسال کنید؛ SEC PACK مرحله تجاری بعدی را خصوصی با شما هماهنگ می‌کند.",ctaEyebrow:"عملیات SEC PACK",ctaTitle:"درخواست‌های تأمین به عملیات متصل هستند.",ctaText:"همه درخواست‌ها وارد یک جریان کنترل‌شده می‌شوند و قیمت، موجودی، پرداخت و تحویل خصوصی باقی می‌مانند.",orderOk:"درخواست دریافت شد. SEC PACK آن را ثبت می‌کند و جزئیات تجاری و تأمین را بررسی خواهد کرد.",ref:"مرجع درخواست",failed:"ارسال درخواست انجام نشد."},
ar:{eyebrow:"طلب توريد",title:"طلب توريد ورق A4",intro:"اختر الكمية وأدخل بيانات التسليم وأرسل طلب التوريد. تؤكد SEC PACK الشروط التجارية والتوافر بشكل خاص.",paper:"ورق نسخ A4",spec:"500 ورقة / رزمة · 5 رزم / كرتون",quantity:"الكمية (رزمة)",commercial:"الشروط التجارية",commercialText:"يتم تقديم السعر والتوافر المؤكد بشكل خاص من SEC PACK بعد مراجعة الطلب.",details:"1. بيانات المشتري",buy:"إرسال طلب التوريد",stepsTitle:"طلب توريد من 3 خطوات",step1:"اختر الكمية.",step2:"أدخل بياناتك.",step3:"أرسل الطلب؛ تراجع SEC PACK الطلب وتؤكد الخطوة التجارية التالية بشكل خاص.",ctaEyebrow:"عمليات SEC PACK",ctaTitle:"طلبات التوريد مرتبطة بالعمليات.",ctaText:"تدخل الطلبات في مسار تشغيلي مضبوط، وتبقى الأسعار والتوافر والدفع والتنفيذ خاصة.",orderOk:"تم استلام الطلب وتسجيله، وستراجع SEC PACK التفاصيل التجارية والتنفيذية.",ref:"مرجع الطلب",failed:"تعذر إرسال الطلب."}};

function lang(){return STORE_TEXT[document.documentElement.lang]||STORE_TEXT.en}
function applyText(){
  const t=lang();
  document.querySelectorAll("[data-store]").forEach(e=>{const k=e.dataset.store;if(t[k])e.textContent=t[k]});
  document.title="SEC PACK | "+t.title;
  const name=document.getElementById("customerName"),phone=document.getElementById("customerPhone"),destination=document.getElementById("destination"),notes=document.getElementById("notes");
  if(name)name.placeholder=t.details.includes("۱")?"نام / شرکت":"Name / Company";
  if(phone)phone.placeholder=t.quantity.startsWith("ت")?"موبایل / واتساپ":"Phone / WhatsApp";
  if(destination)destination.placeholder=t.commercialText.startsWith("قیمت")?"مقصد تحویل":"Delivery destination";
  if(notes)notes.placeholder=t.stepsTitle.startsWith("درخواست")?"توضیحات تحویل یا نیاز ویژه":"Delivery notes or special requirements";
}

function validQuantity(){
  const input=document.getElementById("buyQty");
  const q=Math.max(1,Math.floor(Number(input?.value)||1));
  if(input)input.value=q;
  return q;
}

document.getElementById("buyQty")?.addEventListener("input",validQuantity);

document.getElementById("buyButton")?.addEventListener("click",async()=>{
  const q=validQuantity();
  const name=document.getElementById("customerName")?.value.trim()||"";
  const email=document.getElementById("customerEmail")?.value.trim()||"";
  const phone=document.getElementById("customerPhone")?.value.trim()||"";
  const destination=document.getElementById("destination")?.value.trim()||"";
  const notes=document.getElementById("notes")?.value||"";
  const resultBox=document.getElementById("orderResult");
  const button=document.getElementById("buyButton");
  if(!name||!email||!phone||!destination){if(resultBox)resultBox.textContent=lang().failed;return}
  if(button)button.disabled=true;
  try{
    const result=await window.secpackSubmitPayload({name,email,phone,destination,notes,items:JSON.stringify([{id:"paper",qty:q}])},"order",resultBox,button);
    if(!result?.ok)throw new Error();
    const box=document.createElement("div");box.className="quote";
    const p=document.createElement("p");p.textContent=lang().orderOk;
    const ref=document.createElement("strong");ref.textContent=lang().ref+": "+(result.result?.orderNo||"");
    box.append(p,ref);resultBox.replaceChildren(box);
  }catch(_){
    if(resultBox)resultBox.textContent=lang().failed;
    if(button)button.disabled=false;
  }
});

window.addEventListener("secpack:languagechange",applyText);
applyText();
