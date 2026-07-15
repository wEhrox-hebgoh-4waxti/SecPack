async function loadDashboard(){

const productBox = document.getElementById("product-count");
const supplierBox = document.getElementById("supplier-count");


if(!productBox || !supplierBox){

return;

}


try{

const products = await fetch("../data/products.json")
.then(response=>response.json());


const suppliers = await fetch("../data/suppliers.json")
.then(response=>response.json());


productBox.innerText = products.length;

supplierBox.innerText = suppliers.length;


}

catch(error){

console.log(error);

}

}





async function loadProducts(){


const container =
document.getElementById("products-list");


if(!container){

return;

}


try{


const products =
await fetch("../data/products.json")
.then(response=>response.json());



container.innerHTML="";



products.forEach(product=>{


container.innerHTML += `

<div class="card">

<h3>📦</h3>

<h2>${product.name}</h2>

<p>Category: ${product.category}</p>

<p>Application: ${product.application}</p>

<strong>${product.status}</strong>

</div>

`;

});


}

catch(error){

console.log(error);

}


}




function generateEmail(){


let supplier =
document.getElementById("supplier-name").value;


let type =
document.getElementById("email-type").value;


let result =
document.getElementById("email-result");



let text="";



if(type==="rfq"){


text=

`Dear ${supplier},

We are interested in your products.

Please send us your best quotation, MOQ, payment terms and delivery time.

Also kindly provide technical documents.

Best regards
SecPack Procurement Team`;



}




if(type==="sample"){


text=

`Dear ${supplier},

We would like to request a product sample for laboratory evaluation.

Please confirm sample availability and shipping details.

Best regards
SecPack Team`;



}




if(type==="followup"){


text=

`Dear ${supplier},

We are following up on our previous discussion.

Please update us regarding pricing and cooperation possibilities.

Best regards
SecPack Team`;



}




if(type==="document"){


text=

`Dear ${supplier},

Please provide TDS, COA and MSDS documents for technical evaluation.

Thank you.

Best regards
SecPack Team`;



}



result.value=text;


}




function startAI(){

alert("SecPack AI Assistant Ready");

}




document.addEventListener(
"DOMContentLoaded",
()=>{

loadDashboard();

loadProducts();

}
);
