async function loadDashboard(){

const productBox = document.getElementById("product-count");
const supplierBox = document.getElementById("supplier-count");


if(!productBox || !supplierBox){

return;

}


try{


const products = await fetch("../data/products.json")
.then(res=>res.json());


const suppliers = await fetch("../data/suppliers.json")
.then(res=>res.json());



productBox.innerText = products.length;

supplierBox.innerText = suppliers.length;



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
loadDashboard
);
