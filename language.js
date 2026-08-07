let translations = {};


async function loadLanguage(lang){

    try{

        const response = await fetch(`lang/${lang}.json`);

        translations = await response.json();

        localStorage.setItem("language", lang);

        document.documentElement.lang = lang;

        document.documentElement.dir =
            (lang==="fa" || lang==="ar") ? "rtl" : "ltr";


        document.querySelectorAll("[data-i18n]").forEach(el=>{

            const key = el.dataset.i18n;

            if(translations[key]){

                el.textContent = translations[key];

            }

        });


        window.dispatchEvent(new Event("languageChanged"));

    }

    catch(error){

        console.log("Language loading error:", error);

    }

}



function changeLanguage(lang){

    loadLanguage(lang);

}



document.addEventListener("DOMContentLoaded",()=>{

    loadLanguage(localStorage.getItem("language") || "en");

});
