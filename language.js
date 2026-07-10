const translations = {

en: {

title: "SecPack Enterprise",

subtitle: "Global Packaging Procurement Intelligence System",

products_title: "Product Catalog",

supplier_title: "Supplier Intelligence",

ai_title: "AI Market Insight"

},


fa: {

title: "سک‌پک اینترپرایز",

subtitle: "سیستم هوشمند تأمین و خرید جهانی بسته‌بندی",

products_title: "کاتالوگ محصولات",

supplier_title: "هوش تأمین‌کنندگان",

ai_title: "تحلیل هوشمند بازار"

},


ar: {

title: "SecPack Enterprise",

subtitle: "نظام ذكاء التوريد والشراء العالمي للتغليف",

products_title: "كتالوج المنتجات",

supplier_title: "ذكاء الموردين",

ai_title: "تحليل السوق بالذكاء الاصطناعي"

}

};



function loadLanguage(lang){


let elements =
document.querySelectorAll("[data-lang]");


elements.forEach(function(element){


let key =
element.getAttribute("data-lang");


if(translations[lang] && translations[lang][key]){

element.innerHTML =
translations[lang][key];

}


});



if(lang === "fa"){

document.body.style.direction = "rtl";

document.documentElement.lang = "fa";

}

else if(lang === "ar"){

document.body.style.direction = "rtl";

document.documentElement.lang = "ar";

}

else{

document.body.style.direction = "ltr";

document.documentElement.lang = "en";

}



localStorage.setItem(
"secpack-language",
lang
);


}




document.addEventListener(
"DOMContentLoaded",
function(){


let savedLanguage =
localStorage.getItem(
"secpack-language"
);


loadLanguage(
savedLanguage || "en"
);


}
);
