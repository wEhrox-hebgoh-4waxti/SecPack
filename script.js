document.addEventListener("DOMContentLoaded", function(){

    console.log("SecPack script loaded");


    let stockData = JSON.parse(
        localStorage.getItem("secpackStock")
    ) || {

        "Thermal Lamination Film": 4000,
        "Water-Based Adhesive": 500,
        "Packaging Materials": 2500

    };



    function saveData(){

        localStorage.setItem(
            "secpackStock",
            JSON.stringify(stockData)
        );

    }





    window.addStock = function(product, quantity){

        quantity = Number(quantity);


        if(!product || !quantity){

            alert("Please enter product and quantity");
            return;

        }


        if(stockData[product] === undefined){

            stockData[product] = 0;

        }


        stockData[product] += quantity;


        saveData();


        alert("Stock added successfully");


        updateDisplay();

    };






    window.removeStock = function(product, quantity){

        quantity = Number(quantity);


        if(!product || !quantity){

            alert("Please enter product and quantity");
            return;

        }


        if(stockData[product] === undefined){

            alert("Product not found");
            return;

        }


        stockData[product] -= quantity;


        if(stockData[product] < 0){

            stockData[product] = 0;

        }


        saveData();


        alert("Stock removed successfully");


        updateDisplay();

    };







    window.checkAlerts = function(){

        let message = "";


        Object.keys(stockData).forEach(function(item){


            if(stockData[item] < 500){

                message += item + 
                " : Low Stock\n";

            }


        });



        if(message){

            alert(message);

        }else{

            alert("All stock levels are OK");

        }


    };







    window.viewReport = function(){

        let report = "SecPack Inventory Report\n\n";


        Object.keys(stockData).forEach(function(item){


            report += 
            item + 
            " : " + 
            stockData[item] + 
            "\n";


        });



        alert(report);

    };







    function updateDisplay(){


        let film =
        document.getElementById("filmStock");


        let glue =
        document.getElementById("glueStock");


        let pack =
        document.getElementById("packStock");



        if(film){

            film.innerHTML =
            stockData["Thermal Lamination Film"] + " kg";

        }



        if(glue){

            glue.innerHTML =
            stockData["Water-Based Adhesive"] + " kg";

        }



        if(pack){

            pack.innerHTML =
            stockData["Packaging Materials"] + " pcs";

        }


    }




    updateDisplay();


});
