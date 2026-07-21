// ----------------------------
// Load Suppliers
// ----------------------------

async function loadSuppliers(){

let container = document.getElementById("suppliers-list");

if(!container) return;


try{

let response = await fetch("../data/suppliers.json");

let suppliers = await response.json();


container.innerHTML="";


suppliers.forEach(supplier=>{


container.innerHTML += `

<div class="card"
onclick="openSupplier(${supplier.id})"
style="cursor:pointer">


<h2>
${supplier.name}
</h2>


<p>
Country: ${supplier.country}
</p>


<p>
Category: ${supplier.category}
</p>


<p>
Score: ${supplier.score} / 100
</p>


<p>
Status: ${supplier.status}
</p>


</div>

`;


});


}

catch(error){

console.log("Supplier loading error",error);

}


}




// ----------------------------
// Open Supplier Profile
// ----------------------------

function openSupplier(id){

window.location.href =
"supplier-profile.html?id="+id;

}




// ----------------------------
// Load Products
// ----------------------------

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


<h2>
${product.name}
</h2>


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

console.log("Product loading error",error);

}


}





document.addEventListener("DOMContentLoaded",()=>{


loadSuppliers();

loadProducts();


});
