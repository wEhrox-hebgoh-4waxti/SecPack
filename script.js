const secpack = {

name:"SecPack Enterprise",

};


async function loadDashboard(){

try{

const products = await fetch("../data/products.json")
.then(response=>response.json());


const suppliers = await fetch("../data/suppliers.json")
.then(response=>response.json());



let productCount =
document.getElementById("product-count");


let supplierCount =
document.getElementById("supplier-count");



if(productCount){

productCount.innerText = products.length;

}


if(supplierCount){

supplierCount.innerText = suppliers.length;

}


}

catch(error){

console.log(error);

}

}



function startAI(){

alert(
"SecPack AI Assistant Ready"
);

}



document.addEventListener(
"DOMContentLoaded",
()=>{

loadDashboard();

}
);
