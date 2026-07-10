
/*
=================================
 SecPack Enterprise
 Sprint 3
 JavaScript Core
=================================
*/


// Product Database (Temporary Mock Data)

const products = [

{
name:"Water Based Lamination Adhesive",
country:"Pakistan",
supplier:"HiTech Resins",
MOQ:"16 Tons",
tds:"Available",
coa:"Available",
msds:"Available",
score:92
},


{
name:"Thermal BOPP Film 15 Micron",
country:"China",
supplier:"Shandong Birch Green",
MOQ:"20 Tons",
tds:"Available",
coa:"Available",
msds:"Available",
score:88
},


{
name:"PU Laminating Adhesive",
country:"India",
supplier:"Industrial Supplier",
MOQ:"10 Tons",
tds:"Available",
coa:"Pending",
msds:"Available",
score:85
}

];



// Supplier Ranking

const suppliers = [

{
name:"HiTech Resins",
quality:95,
price:88,
delivery:90,
response:92
},

{
name:"Shandong Birch Green",
quality:90,
price:85,
delivery:88,
response:90
}

];




// AI Market Insight

const marketInsight = {

product:"BOPP Thermal Film",

change:"-4.8%",

recommendation:
"Good time to negotiate"

};




// Generate Product Cards

function loadProducts(){

const container =
document.querySelector(".product-grid");


if(!container) return;


products.forEach(product=>{


container.innerHTML += `

<div class="product-card">

<div class="product-image">
📦
</div>


<h3>
${product.name}
</h3>


<div class="rating">
★★★★★
</div>


<div class="info-row">
<span class="label">
Country
</span>

<span>
${product.country}
</span>

</div>


<div class="info-row">

<span class="label">
Supplier
</span>

<span>
${product.supplier}
</span>

</div>


<div class="info-row">

<span class="label">
MOQ
</span>

<span>
${product.MOQ}
</span>

</div>



<div class="info-row">

<span>
AI Score
</span>

<strong>
${product.score}
</strong>


</div>


<button class="btn btn-primary">
Request Quote
</button>


</div>

`;

});


}





// Start System

document.addEventListener(
"DOMContentLoaded",
()=>{


loadProducts();


console.log(
"SecPack AI Engine Loaded"
);


});
