let translations = {};

async function loadLanguage(lang){

try{

const response = await fetch(`lang/${lang}.json`);

translations = await response.json();

document
.querySelectorAll("[data-i18n]")
.forEach(element=>{

const key = element.getAttribute("data-i18n");

if(translations[key]){

element.innerText = translations[key];

}

});

if(lang === "fa"){

document.documentElement.lang = "fa";
document.documentElement.dir = "rtl";

}

else if(lang === "ar"){

document.documentElement.lang = "ar";
document.documentElement.dir = "rtl";

}

else{

document.documentElement.lang = "en";
document.documentElement.dir = "ltr";

}

localStorage.setItem("language", lang);

}

catch(error){

console.log("Language Error:",error);

}

}

function changeLanguage(lang){

loadLanguage(lang);

}

document.addEventListener("DOMContentLoaded",()=>{

const savedLanguage = localStorage.getItem("language") || "en";

loadLanguage(savedLanguage);

});
