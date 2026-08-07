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


const minimumStock={

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





window.addStock=function(product,quantity){

quantity=Number(quantity);


if(!product || !quantity){

alert("Please enter product and quantity");
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

alert("Please enter product and quantity");
return;

}


stockData[product]-=quantity;


if(stockData[product]<0){

stockData[product]=0;

}


saveStock();

alert("Stock removed successfully");

updateInventory();

};






function getStatus(product){

let value=stockData[product];


if(value<=minimumStock[product]){

return "🔴 Low Stock";

}


if(value<=minimumStock[product]*2){

return "🟡 Monitor";

}


return "🟢 Available";


}






function updateInventory(){


let film=document.getElementById("filmStock");
let glue=document.getElementById("glueStock");
let pack=document.getElementById("packStock");



if(film)
film.innerHTML=stockData["Thermal Lamination Film"]+" kg";


if(glue)
glue.innerHTML=stockData["Water-Based Adhesive"]+" kg";


if(pack)
pack.innerHTML=stockData["Packaging Materials"]+" pcs";




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


let suppliers=JSON.parse(

localStorage.getItem("secpackSuppliers")

) || [

{
name:"HiTech Resins",
country:"Pakistan",
product:"Water-Based Adhesive",
price:"-",
score:90,
status:"Active"
},


{
name:"Nantong Comens",
country:"China",
product:"Lamination Adhesive",
price:"-",
score:85,
status:"Testing"
}

];







function saveSuppliers(){

localStorage.setItem(

"secpackSuppliers",

JSON.stringify(suppliers)

);

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

price:price,

score:70,

status:"New"

});



saveSuppliers();


alert("Supplier saved successfully");


showSuppliers();


};









window.deleteSupplier=function(index){


let confirmDelete =
confirm(
"Are you sure you want to delete this supplier?"
);



if(confirmDelete){


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


let message="";


Object.keys(stockData).forEach(function(item){


if(getStatus(item)!=="🟢 Available"){


message += item+" : "+getStatus(item)+"\n";


}


});


alert(message || "All stock levels are OK");


};







window.viewReport=function(){


let report="SecPack Inventory Report\n\n";


Object.keys(stockData).forEach(function(item){


report += item+
" : "+
stockData[item]+
" "+
getStatus(item)+
"\n";


});


alert(report);


};






updateInventory();

showSuppliers();



});
