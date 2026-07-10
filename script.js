const products = [

{
name:"Water Based Lamination Adhesive",
category:"Adhesive",
market:"Global"
},

{
name:"BOPP Thermal Film 15 Micron",
category:"Film",
market:"Global"
},

{
name:"PU Lamination Adhesive",
category:"Adhesive",
market:"Global"
}

];



const suppliers = [

{
name:"China Manufacturers",
score:88
},

{
name:"Pakistan Manufacturers",
score:82
},

{
name:"India Manufacturers",
score:85
},

{
name:"Taiwan Manufacturers",
score:90
}

];



function loadAIInsight(){


const box=document.getElementById("ai-result");


if(box){


box.innerHTML=

`
<strong>AI Market Intelligence:</strong>

<br><br>

Products monitored:
${products.length}

<br>

Supplier groups analyzed:
${suppliers.length}

<br><br>

SecPack AI recommends continuous supplier comparison based on:

<br>
• Price
<br>
• Quality Stability
<br>
• Technical Support
<br>
• Delivery Risk

`;

}


}



document.addEventListener(
"DOMContentLoaded",
()=>{

loadAIInsight();

}

);
