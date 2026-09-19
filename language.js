(function(){
"use strict";
const KEY="secpack-lang", SUPPORTED=["en","fa","ar"];

const COMMON={
"Home":{fa:"خانه",ar:"الرئيسية"},"Products":{fa:"محصولات",ar:"المنتجات"},"Online Store":{fa:"فروشگاه آنلاین",ar:"المتجر الإلكتروني"},
"Company":{fa:"شرکت",ar:"الشركة"},"For Manufacturers":{fa:"برای تولیدکنندگان",ar:"للمصنعين"},"Knowledge Center":{fa:"مرکز دانش",ar:"مركز المعرفة"},
"Resources":{fa:"منابع",ar:"المصادر"},"Contact":{fa:"تماس",ar:"اتصل بنا"},"Contact SEC PACK":{fa:"تماس با SEC PACK",ar:"اتصل بـ SEC PACK"},
"Explore Products":{fa:"مشاهده محصولات",ar:"استكشف المنتجات"},"Request a Discussion":{fa:"درخواست گفتگو",ar:"طلب مناقشة"},
"International Trade & Sourcing":{fa:"تجارت بین‌الملل و تأمین",ar:"التجارة الدولية والتوريد"},
"International Trade · Sourcing · Procurement":{fa:"تجارت بین‌الملل · تأمین · خرید",ar:"التجارة الدولية · التوريد · المشتريات"},
"Manufacturer sourcing":{fa:"شناسایی تولیدکننده",ar:"تحديد المصنعين"},"Supplier evaluation":{fa:"ارزیابی تأمین‌کننده",ar:"تقييم الموردين"},
"Commercial negotiation":{fa:"مذاکره تجاری",ar:"التفاوض التجاري"},"International procurement":{fa:"خرید بین‌المللی",ar:"المشتريات الدولية"},
"Global Sourcing":{fa:"تأمین جهانی",ar:"التوريد العالمي"},"Procurement":{fa:"تدارکات و خرید",ar:"المشتريات"},"Trade Support":{fa:"پشتیبانی تجارت",ar:"دعم التجارة"},
"Copy Paper":{fa:"کاغذ تحریر",ar:"ورق النسخ"},"Lamination Films":{fa:"فیلم لمینیشن",ar:"أفلام التصفيح"},
"Water-Based Adhesives":{fa:"چسب‌های پایه آب",ar:"مواد لاصقة مائية"},"Packaging Materials":{fa:"مواد بسته‌بندی",ar:"مواد التغليف"},
"Add to cart":{fa:"افزودن به سبد",ar:"أضف إلى السلة"},"View order":{fa:"مشاهده سفارش",ar:"عرض الطلب"},
"Scientific product guide":{fa:"راهنمای علمی محصول",ar:"الدليل العلمي للمنتج"},"Register":{fa:"ثبت‌نام",ar:"تسجيل"},
"Privacy Policy":{fa:"سیاست حفظ حریم خصوصی",ar:"سياسة الخصوصية"},"Cart:":{fa:"سبد:",ar:"السلة:"},
"View A4 specifications":{fa:"مشاهده مشخصات A4",ar:"عرض مواصفات A4"},"View film specifications":{fa:"مشاهده مشخصات فیلم",ar:"عرض مواصفات الأفلام"},
"View adhesive specifications":{fa:"مشاهده مشخصات چسب",ar:"عرض مواصفات المواد اللاصقة"},"View packaging materials":{fa:"مشاهده مواد بسته‌بندی",ar:"عرض مواد التغليف"}
};

function applyExact(lang){
 document.documentElement.lang=lang;
 document.documentElement.dir=(lang==="fa"||lang==="ar")?"rtl":"ltr";
 document.querySelectorAll("[data-lang]").forEach(b=>{
   b.classList.toggle("on",b.dataset.lang===lang);
   b.classList.toggle("active-language",b.dataset.lang===lang);
 });
 const dict=COMMON;
 document.querySelectorAll("body *").forEach(el=>{
   if(el.children.length===0){
     const raw=(el.textContent||"").trim();
     if(!raw)return;
     if(lang==="en"){
       const original=el.getAttribute("data-original-text");
       if(original!==null) el.textContent=original;
     }else if(dict[raw] && dict[raw][lang]){
       if(!el.hasAttribute("data-original-text"))el.setAttribute("data-original-text",raw);
       el.textContent=dict[raw][lang];
     }
   }
 });
 if(window.applyPageTranslations) window.applyPageTranslations(lang);
 localStorage.setItem(KEY,lang);
}

function setLanguage(lang){
 lang=SUPPORTED.includes(lang)?lang:"en";
 applyExact(lang);
 // Homepage has its own complete EN/FA/AR dictionary.
 if(typeof window.setHomepageLanguage==="function") window.setHomepageLanguage(lang);
}

function init(){
 document.querySelectorAll("[data-lang]").forEach(btn=>{
   btn.addEventListener("click",()=>setLanguage(btn.dataset.lang));
 });
 setLanguage(localStorage.getItem(KEY)||"en");
}
window.secpackSetLanguage=setLanguage;
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();