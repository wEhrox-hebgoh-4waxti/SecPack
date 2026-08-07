document.addEventListener("DOMContentLoaded", function(){

    console.log("SecPack script loaded");


    let stockData = JSON.parse(
        localStorage.getItem("secpackStock")
    ) || {

        "Thermal Lamination Film": 4000,
        "Water-Based Adhesive": 500,
        "Packaging Materials": 2500

    };



    const minimumStock = {

        "Thermal Lamination Film":1000,
        "Water-Based Adhesive":200,
        "Packaging Materials":500

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

            stockData[product]=0;

        }


        stockData[product]+=quantity;


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



        stockData[product]-=quantity;



        if(stockData[product]<0){

            stockData[product]=0;

        }



        saveData();

        alert("Stock removed successfully");

        updateDisplay();

    };







    function getStatus(product){

        let current = stockData[product];

        let minimum = minimumStock[product];



        if(current <= minimum){

            return "🔴 Low Stock";

        }


        if(current <= minimum * 2){

            return "🟡 Monitor";

        }


        return "🟢 Available";


    }








    function updateDisplay(){


        let film =
        document.getElementById("filmStock");


        let glue =
        document.getElementById("glueStock");


        let pack =
        document.getElementById("packStock");



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




        let filmStatus =
        document.getElementById("filmStatus");


        let glueStatus =
        document.getElementById("glueStatus");


        let packStatus =
        document.getElementById("packStatus");



        if(filmStatus){

            filmStatus.innerHTML =
            getStatus("Thermal Lamination Film");

        }



        if(glueStatus){

            glueStatus.innerHTML =
            getStatus("Water-Based Adhesive");

        }



        if(packStatus){

            packStatus.innerHTML =
            getStatus("Packaging Materials");

        }


    }








    window.checkAlerts=function(){

        let alertText="";


        Object.keys(stockData).forEach(function(item){


            if(getStatus(item)!=="🟢 Available"){

                alertText += item+" : "+getStatus(item)+"\n";

            }


        });



        if(alertText){

            alert(alertText);

        }else{

            alert("All stock levels are OK");

        }


    };








    window.viewReport=function(){

        let report="SecPack Inventory Report\n\n";


        Object.keys(stockData).forEach(function(item){


            report +=
            item+
            " : "+
            stockData[item]+
            " | "+
            getStatus(item)+
            "\n";


        });



        alert(report);


    };





    updateDisplay();


});
