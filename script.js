document.addEventListener("DOMContentLoaded", function(){

    console.log("SecPack script loaded");


    const stockData = JSON.parse(localStorage.getItem("secpackStock")) || {
        "Thermal Lamination Film": 4000,
        "Water-Based Adhesive": 500,
        "Packaging Materials": 2500
    };


    function saveStockData(){

        localStorage.setItem(
            "secpackStock",
            JSON.stringify(stockData)
        );

    }



    window.addStock = function(product, quantity){

        if(!product || !quantity) return;


        if(stockData[product]){

            stockData[product] += Number(quantity);

        }else{

            stockData[product] = Number(quantity);

        }


        saveStockData();

        alert("Stock added successfully");

        location.reload();

    };





    window.removeStock = function(product, quantity){

        if(!product || !quantity) return;


        if(stockData[product]){

            stockData[product] -= Number(quantity);

            if(stockData[product] < 0){

                stockData[product] = 0;

            }

        }


        saveStockData();

        alert("Stock removed successfully");

        location.reload();

    };





    window.checkAlerts = function(){

        let message = "";

        Object.keys(stockData).forEach(function(item){


            if(stockData[item] < 500){

                message += item + " : Low Stock\n";

            }


        });


        if(message){

            alert(message);

        }else{

            alert("All stock levels are OK");

        }

    };





    window.viewReport = function(){

        let report = "";

        Object.keys(stockData).forEach(function(item){

            report += item + " : " + stockData[item] + "\n";

        });


        alert(report);

    };


});
