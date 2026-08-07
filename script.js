document.addEventListener("DOMContentLoaded", function () {

console.log("SecPack script loaded");



/* =========================
   INVENTORY SYSTEM
========================= */


let stockData = JSON.parse(
localStorage.getItem("secpackStock")
) || {

"Thermal Lamination Film":4400,
"Water-Based Adhesive":1100,
"Packaging Materials":2500

};



const minimumStock = {

"Thermal Lamination Film":1000,
"Water-Based Adhesive":200,
"Packaging Materials":500

};




function saveStock(){

localStorage.setItem(
"secpackStock",
JSON.stringify(stockData)
);

}




function getStatus(product){

let value = stockData[product];


if(value <= minimumStock[product]){

return "🔴 Low Stock";

}


if(value <= minimumStock[product] * 2){

return "🟡 Monitor";

}


return "🟢 Available";

}






window.addStock = function(product, quantity){


quantity = Number(quantity);


if(!product || !quantity){

alert("Enter product and quantity");
return;

}


stockData[product] += quantity;


saveStock();


alert("Stock added successfully");


updateInventory();


};







window.removeStock = function(product, quantity){


quantity = Number(quantity);


if(!product || !quantity){

alert("Enter product and quantity");
return;

}


stockData[product] -= quantity;


if(stockData[product] < 0){

stockData[product] = 0;

}


saveStock();


alert("Stock removed successfully");


updateInventory();


};






function updateInventory(){


let film = document.getElementById("filmStock");
let glue = document.getElementById("glueStock");
let pack = document.getElementById("packStock");


if(film)
film.innerHTML = stockData["Thermal Lamination Film"]+" kg";


if(glue)
glue.innerHTML = stockData["Water-Based Adhesive"]+" kg";


if(pack)
pack.innerHTML = stockData["Packaging Materials"]+" pcs";



let filmStatus=document.getElementById("filmStatus");
let glueStatus=document.getElementById("glueStatus");
let packStatus=document.getElementById("packStatus");


if(filmStatus)
filmStatus.innerHTML=getStatus("Thermal Lamination Film");


if(glueStatus)
glueStatus.innerHTML=getStatus("Water-Based Adhesive");


if(packStatus)
packStatus.innerHTML=getStatus("Packaging Materials");


}






/* =========================
   SUPPLIER SYSTEM
========================= */



let suppliers = JSON.parse(

localStorage.getItem("secpackSuppliers")

) || [];





function saveSuppliers(){

localStorage.setItem(

"secpackSuppliers",

JSON.stringify(suppliers)

);

}






function prepareSuppliers(){


suppliers = suppliers.map(function(item){


return {

name:item.name || "",
country:item.country || "",
product:item.product || "",
price:item.price || "-",
score:item.score || 70,
status:item.status || "New"

};


});


saveSuppliers();


}






window.addSupplier=function(){


let name=document.getElementById("supplierName").value;

let country=document.getElementById("supplierCountry").value;

let product=document.getElementById("supplierProduct").value;

let price=document.getElementById("supplierPrice").value;



if(!name){

alert("Enter supplier name");
return;

}



suppliers.push({

name:name,

country:country,

product:product,

price:price || "-",

score:70,

status:"New"

});



saveSuppliers();



alert("Supplier saved successfully");


showSuppliers();


};







window.deleteSupplier=function(index){



let answer = confirm(

"Delete this supplier?"

);



if(answer){


suppliers.splice(index,1);


saveSuppliers();


showSuppliers();


}


};








function showSuppliers(){



let list=document.getElementById("supplierList");



if(!list)
return;



list.innerHTML="";



suppliers.forEach(function(item,index){



list.innerHTML += `


<div class="card">


<h2>${item.name}</h2>


<p>
Country: ${item.country}
</p>


<p>
Product: ${item.product}
</p>


<p>
Price: ${item.price}
</p>


<p>
Score: ${item.score} / 100
</p>


<p>
Status: ${item.status}
</p>



<button onclick="deleteSupplier(${index})">

🗑 Delete

</button>



</div>


`;



});


}







window.checkAlerts=function(){


let result="";


Object.keys(stockData).forEach(function(item){


if(getStatus(item)!=="🟢 Available"){

result += item+" : "+getStatus(item)+"\n";

}


});



alert(result || "All stock levels are OK");


};






window.viewReport=function(){


let report="SecPack Inventory Report\n\n";


Object.keys(stockData).forEach(function(item){


report += item+
" : "+
stockData[item]+
" | "+
getStatus(item)+
"\n";


});


alert(report);


};







prepareSuppliers();

updateInventory();

showSuppliers();



});
