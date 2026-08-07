document.addEventListener("DOMContentLoaded", function(){

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







function updateInventory(){


let film=document.getElementById("filmStock");
let glue=document.getElementById("glueStock");
let pack=document.getElementById("packStock");



if(film){

film.innerHTML =
stockData["Thermal Lamination Film"]+" kg";

}



if(glue){

glue.innerHTML =
stockData["Water-Based Adhesive"]+" kg";

}



if(pack){

pack.innerHTML =
stockData["Packaging Materials"]+" pcs";

}


}







window.addStock=function(product,quantity){


quantity=Number(quantity);



if(!product || !quantity){

alert("Enter product and quantity");

return;

}



stockData[product]+=quantity;


saveStock();


alert("Stock added successfully");


updateInventory();


};







window.removeStock=function(product,quantity){


quantity=Number(quantity);



if(!product || !quantity){

alert("Enter product and quantity");

return;

}



stockData[product]-=quantity;



if(stockData[product]<0){

stockData[product]=0;

}



saveStock();


alert("Stock removed successfully");


updateInventory();


};/* =========================
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







function fixSupplierData(){


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









window.editSupplier=function(index){



let item=suppliers[index];



let name=prompt(
"Supplier Name:",
item.name
);



if(name===null)
return;




let country=prompt(
"Country:",
item.country
);



if(country===null)
return;





let product=prompt(
"Product:",
item.product
);



if(product===null)
return;





let price=prompt(
"Price:",
item.price
);



if(price===null)
return;





let score=prompt(
"Score:",
item.score
);



if(score===null)
return;





let status=prompt(
"Status:",
item.status
);



if(status===null)
return;





suppliers[index]={

name:name,

country:country,

product:product,

price:price,

score:Number(score),

status:status

};



saveSuppliers();


showSuppliers();



};









window.deleteSupplier=function(index){



let result = confirm(
"Delete this supplier?"
);



if(result){


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




<button onclick="editSupplier(${index})">

✏️ Edit

</button>



<button onclick="deleteSupplier(${index})">

🗑 Delete

</button>



</div>


`;



});



}








window.checkAlerts=function(){


alert("Stock alert system active");


};






window.viewReport=function(){


let report="SecPack Inventory Report\n\n";


Object.keys(stockData).forEach(function(item){


report += item+
" : "+
stockData[item]+
"\n";


});



alert(report);


};







fixSupplierData();

updateInventory();

showSuppliers();



});
