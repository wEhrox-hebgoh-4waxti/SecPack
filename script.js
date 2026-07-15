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

<p>
Category: ${product.category}
</p>

<p>
Application: ${product.application}
</p>

<strong>
${product.status}
</strong>

</div>

`;

});


}

catch(error){

console.log(error);

}


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
