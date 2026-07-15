let translations = {};


async function loadLanguage(lang){

try{

const response = await fetch(
`lang/${lang}.json`
);


translations = await response.json();


document
.querySelectorAll("[data-i18n]")
.forEach(item=>{


let key=item.getAttribute("data-i18n");


if(translations[key]){

item.innerText =
translations[key];

}


});


if(lang==="fa"){

document.documentElement.dir="rtl";

}

else{

document.documentElement.dir="ltr";

}


}

catch(error){

console.log(error);

}


}



function changeLanguage(lang){

loadLanguage(lang);

}



document.addEventListener(
"DOMContentLoaded",
()=>{

loadLanguage("en");

}
);
