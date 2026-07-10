const secpackData = {


products:[

"Water Based Adhesive",

"BOPP Thermal Film",

"PU Lamination Adhesive",

"Packaging Materials"

],



suppliers:[

"China",

"Pakistan",

"India",

"Taiwan",

"Korea"

],



intelligence:{

price:"Market comparison ready",

quality:"Supplier quality analysis active",

risk:"Risk evaluation system ready"

}


};





function loadAssistant(){


const area=document.getElementById(
"ai-result"
);



if(area){


area.innerHTML=`

<strong>
SecPack Intelligence
</strong>

<br><br>

📦 Products monitored:
${secpackData.products.length}

<br><br>

🌎 Supplier regions:
${secpackData.suppliers.length}

<br><br>

🤖 AI Status:

<br>

${secpackData.intelligence.price}

<br>

${secpackData.intelligence.quality}

<br>

${secpackData.intelligence.risk}

`;

}


}





document.addEventListener(
"DOMContentLoaded",
()=>{


loadAssistant();


}
);
