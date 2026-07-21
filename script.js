function generateBusinessEmail(){

let supplier=document.getElementById("supplier-name")?.value||"";
let contact=document.getElementById("contact-name")?.value||"";
let product=document.getElementById("product-name")?.value||"";
let requirement=document.getElementById("requirement")?.value||"";
let price=document.getElementById("target-price")?.value||"";
let purpose=document.getElementById("email-purpose")?.value||"";
let result=document.getElementById("email-result");

let email="";

if(purpose==="price"){

email=`Dear ${contact},

Thank you for your previous information regarding ${product}.

We are currently evaluating suppliers for long-term cooperation in our market.

Our estimated purchasing volume is ${requirement}.

Considering our target purchasing price of ${price}, we would appreciate your best export quotation.

Please also confirm MOQ, production lead time, payment terms and shipping options.

We look forward to establishing long-term cooperation with ${supplier}.

Best regards,
SecPack Procurement Team`;

}

if(purpose==="sample"){

email=`Dear ${contact},

Thank you for your information regarding ${product}.

Before commercial cooperation, we would like to receive a laboratory sample.

Please confirm sample availability together with TDS, COA and MSDS.

Best regards,
SecPack Procurement Team`;

}

if(purpose==="cooperation"){

email=`Dear ${contact},

We are interested in building a long-term partnership with ${supplier}.

Please share your export experience, product catalogue and commercial conditions.

Best regards,
SecPack Procurement Team`;

}

if(purpose==="followup"){

email=`Dear ${contact},

I hope you are doing well.

We would like to follow up regarding our previous discussion about ${product}.

Please update us on quotation, availability and next steps.

Best regards,
SecPack Procurement Team`;

}

if(result){
result.value=email;
}

}



// ----------------------------
// Load Suppliers
// ----------------------------

async function loadSuppliers(){

const container=document.getElementById("suppliers-list");

if(!container) return;

try{

const response=await fetch("../data/suppliers.json");
const suppliers=await response.json();

container.innerHTML="";

suppliers.forEach(item=>{

container.innerHTML+=`

<div class="card">

<h2>${item.name}</h2>

<p><strong>Country:</strong> ${item.country}</p>

<p><strong>City:</strong> ${item.city}</p>

<p><strong>Contact:</strong> ${item.contact}</p>

<p><strong>Position:</strong> ${item.position}</p>

<p><strong>Product:</strong> ${item.product}</p>

<p><strong>Category:</strong> ${item.category}</p>

<p><strong>Last Price:</strong> ${item.lastPrice}</p>

<p><strong>Target Price:</strong> ${item.targetPrice}</p>

<p><strong>Purchase:</strong> ${item.purchaseVolume}</p>

<p><strong>TDS:</strong> ${item.tds}</p>

<p><strong>COA:</strong> ${item.coa}</p>

<p><strong>MSDS:</strong> ${item.msds}</p>

<p><strong>Sample:</strong> ${item.sample}</p>

<p><strong>Status:</strong> ${item.status}</p>

<p><strong>Score:</strong> ${item.score}/100</p>

<p><strong>Last Contact:</strong> ${item.lastContact}</p>

<p><strong>Notes:</strong> ${item.notes}</p>

</div>

`;

});

}catch(error){

console.log(error);

}

}



// ----------------------------
// Load Products
// ----------------------------

async function loadProducts(){

const container=document.getElementById("products-list");

if(!container) return;

try{

const response=await fetch("../data/products.json");
const products=await response.json();

container.innerHTML="";

products.forEach(item=>{

container.innerHTML+=`

<div class="card">

<h2>${item.name}</h2>

<p><strong>Category:</strong> ${item.category}</p>

<p><strong>Application:</strong> ${item.application}</p>

<p><strong>Status:</strong> ${item.status}</p>

</div>

`;

});

}catch(error){

console.log(error);

}

}



document.addEventListener("DOMContentLoaded",()=>{

loadSuppliers();

loadProducts();

});
