function generateBusinessEmail(){

let supplier =
document.getElementById("supplier-name").value;

let contact =
document.getElementById("contact-name").value;

let product =
document.getElementById("product-name").value;

let requirement =
document.getElementById("requirement").value;

let price =
document.getElementById("target-price").value;

let purpose =
document.getElementById("email-purpose").value;

let result =
document.getElementById("email-result");


let email="";


if(purpose==="price"){

email=

`Dear ${contact},

Thank you for your previous information regarding ${product}.

We are currently evaluating suppliers for long-term cooperation in our market.

Our initial requirement is ${requirement}.

Considering current market conditions and our target purchasing level of ${price}, we would appreciate your best possible export quotation and commercial terms.

Please also confirm MOQ, production lead time, payment terms and shipping options.

We look forward to building a reliable long-term partnership with ${supplier}.

Best regards,
SecPack Procurement Team`;

}



if(purpose==="sample"){

email=

`Dear ${contact},

Thank you for sharing information about ${product}.

Before starting commercial cooperation, we would like to evaluate your product through a laboratory sample.

Please confirm sample availability, shipping details and technical documents including TDS and COA.

After successful evaluation, we will discuss regular purchasing requirements of ${requirement}.

Best regards,
SecPack Procurement Team`;

}



if(purpose==="cooperation"){

email=

`Dear ${contact},

We are interested in developing a long-term business relationship with ${supplier}.

Our focus is establishing a stable supply chain for ${product}.

We are looking for consistent quality, competitive pricing and reliable delivery.

Please share your company profile, export experience and cooperation terms.

Best regards,
SecPack Procurement Team`;

}



if(purpose==="followup"){

email=

`Dear ${contact},

I hope you are doing well.

We would like to follow up regarding our previous discussion about ${product}.

Please update us on quotation, availability and next steps.

We appreciate your feedback and look forward to your reply.

Best regards,
SecPack Procurement Team`;

}


if(result){
result.value=email;
}

}





// Load Suppliers Data

async function loadSuppliers(){

let container =
document.getElementById("suppliers-list");


if(!container) return;


try{

let response =
await fetch("../data/suppliers.json");


let suppliers =
await response.json();


container.innerHTML="";


suppliers.forEach(supplier=>{


container.innerHTML += `

<div class="card">

<h2>${supplier.name}</h2>

<p>
Country: ${supplier.country}
</p>

<p>
Category: ${supplier.category}
</p>

<p>
Score: ${supplier.score}/100
</p>

<p>
Status: ${supplier.status}
</p>

</div>

`;

});


}

catch(error){

console.log("Supplier data error", error);

}

}





// Load Products Data

async function loadProducts(){

let container =
document.getElementById("products-list");


if(!container) return;


try{

let response =
await fetch("../data/products.json");


let products =
await response.json();


container.innerHTML="";


products.forEach(product=>{


container.innerHTML += `

<div class="card">

<h2>${product.name}</h2>

<p>
Category: ${product.category}
</p>

<p>
Application: ${product.application}
</p>

<p>
Status: ${product.status}
</p>

</div>

`;

});


}

catch(error){

console.log("Product data error", error);

}

}





document.addEventListener("DOMContentLoaded",()=>{

loadSuppliers();

loadProducts();

});
