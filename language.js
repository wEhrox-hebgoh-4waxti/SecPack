let translations = {};



async function loadLanguage(lang){


try{


const response = await fetch(
`${lang}.json`
);


translations = await response.json();


document
.querySelectorAll("[data-i18n]")
.forEach(element=>{


const key = element.getAttribute(
"data-i18n"
);


if(translations[key]){


element.innerText =
translations[key];


}


});



if(lang==="fa"){


document.documentElement.lang="fa";

document.documentElement.dir="rtl";


}

else{


document.documentElement.lang=lang;

document.documentElement.dir="ltr";


}



}

catch(error){


console.log(
"Language loading error:",
error
);


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
