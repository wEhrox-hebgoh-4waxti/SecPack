
let currentLanguage = "en";


async function loadLanguage(lang){


currentLanguage = lang;


let file;


if(lang==="fa"){
file="fa.json";
}

else if(lang==="ar"){
file="ar.json";
}

else{
file="en.json";
}



const response =
await fetch(file);



const translations =
await response.json();



document
.querySelectorAll("[data-lang]")
.forEach(element=>{


const key =
element.getAttribute("data-lang");


if(translations[key]){


element.innerText =
translations[key];


}


});



if(lang==="fa" || lang==="ar"){

document.body.style.direction="rtl";

document.body.style.textAlign="right";

}

else{

document.body.style.direction="ltr";

document.body.style.textAlign="left";

}


}
