const btnLoan = document.getElementById("loanButton");
const btnBank = document.getElementById("bankButton");
const btnWork = document.getElementById("workButton");
const btnPayTotalLoan = document.getElementById("repayTotalLoan");
const buyLaptopButton = document.getElementById("buyLaptopButton");
let payMoney = document.getElementById("payMoney");
let amountToAdd = document.getElementById("amountToAdd");
let balanceMoney = document.getElementById("balanceMoney");
let currentDebt = document.getElementById("currentDebt");
let laptopsElement = document.getElementById("laptops");
let featuresElement = document.getElementById("features");
let imgElement = document.getElementById("laptopImg");
let laptopTitle = document.getElementById("laptopTitle");
let laptopDescription=document.getElementById("laptopDescription");
let laptopPrice = document.getElementById("laptopPrice");
let increment = 100;
let laptops = [];

btnLoan.addEventListener("click",function(){
    let amountToLoan = prompt("How much do you want to request as a loan?");

    if(amountToLoan == 0 || amountToLoan == null){
        alert("Invalid input.")
    } else if (amountToLoan >= (2 * (parseInt(balanceMoney.innerText)))){
        alert("Sorry, you are not eligible to ask for a loan (amount is 2x higher than your current balance).")
    } else {
        document.getElementById("div_debt").classList.remove("hide");
        currentDebt.innerText = amountToLoan;
        btnLoan.setAttribute("disabled", "disabled");
        btnLoan.style.backgroundColor = "gray";
        balanceMoney.innerText = (parseInt(balanceMoney.innerText)) + parseInt(amountToLoan);
    }
})

btnWork.addEventListener("click",function(){
    const balance = parseInt(amountToAdd.innerText);
    amountToAdd.innerText = balance + increment;

    if(btnLoan.hasAttribute("disabled")){
        let amountAvailableToPayLoan = parseInt(amountToAdd.innerText);
        let debtToPayInFull = parseInt(currentDebt.innerText);
        if(debtToPayInFull > 0) {
            btnPayTotalLoan.classList.remove("hide");
        }   
    }
})

btnBank.addEventListener("click",function(){
    let moneyToReceive = parseInt(amountToAdd.innerText);
    let currentBalance = parseInt(balanceMoney.innerText);

    if(btnLoan.hasAttribute("disabled")){
        let moneyToPayDebt = moneyToReceive * 0.1;
        let actualCurrentDebt = parseInt(currentDebt.innerText);
        if(moneyToPayDebt > actualCurrentDebt){
            let difference = moneyToPayDebt - actualCurrentDebt;
            balanceMoney.innerText = currentBalance + difference + moneyToReceive * 0.9;
            document.getElementById("div_debt").classList.add("hide");
            btnLoan.removeAttribute("disabled");
            btnLoan.style.backgroundColor = "green";
            amountToAdd.innerText = 0;
        } else{
            currentDebt.innerText = actualCurrentDebt - moneyToPayDebt;
            balanceMoney.innerText = (moneyToReceive * 0.9) + currentBalance;
            amountToAdd.innerText = 0;
        }
    } else {
        balanceMoney.innerText = moneyToReceive + currentBalance;
        amountToAdd.innerText = 0;
    }
})

btnPayTotalLoan.addEventListener("click",function(){
    let amountToLiquidateLoan = parseInt(amountToAdd.innerText);
    let loanToBeLiquidated = parseInt(currentDebt.innerText);
    let difference = parseInt(amountToLiquidateLoan - loanToBeLiquidated);
    let balanceLoanOperation = parseInt(balanceMoney.innerText);
    balanceLoanOperation = balanceLoanOperation + difference;

    if(loanToBeLiquidated > amountToLiquidateLoan){
        currentDebt.innerText = currentDebt.innerText - amountToLiquidateLoan;
    } else {
        currentDebt.innerText = 0;
        balanceMoney.innerText = balanceLoanOperation;
        document.getElementById("div_debt").classList.add("hide");
        btnLoan.removeAttribute("disabled");
        btnLoan.style.backgroundColor = "green";
        btnPayTotalLoan.classList.add("hide");
    }
    amountToAdd.innerText = 0;
})

//----------------Laptops handling--------------------
fetch("https://hickory-quilled-actress.glitch.me/computers") 
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => addLaptopsToMenu(laptops));

    const addLaptopsToMenu = (laptops) => {
        laptops.forEach(x => addLaptopToMenu(x));

        //Initial state of laptop presentation, in this case title, description and price (when app starts).
        laptopTitle.innerText = laptops[0].title;
        laptopDescription.innerText = laptops[0].description;
        laptopPrice.innerText = laptops[0].price;
        //Initial state of laptop features.
        let laptopSpecLength = laptops[0].specs.length;
        var ulListInitialState = "<ul>";
        for(let i = 0; i < laptopSpecLength; i++ ){
            ulListInitialState += "<li class='featureClass'>" + laptops[0].specs[i] + "</li>";
        }
        ulListInitialState += "</ul>";
        featuresElement.innerHTML = ulListInitialState;
    }
    
    const addLaptopToMenu = (laptop) => {
        const laptopElement = document.createElement('option');
        laptopElement.value = laptop.id;
        laptopElement.appendChild(document.createTextNode(laptop.title));
        laptopsElement.appendChild(laptopElement);
    }

    //-------------Laptop list handling--------------
    laptopsElement.addEventListener("change", function
    (){
        featuresElement.innerText = "";
        let indexValue = laptopsElement.value;
        const indexLaptop = laptops[indexValue - 1];
        let specsLenght = indexLaptop.specs.length;

        var ulList = "<ul>";
        for(let i = 0; i < specsLenght; i++ ){
            ulList += "<li class='featureClass'>" + indexLaptop.specs[i] + "</li>";
        }
        ulList += "</ul>";
        featuresElement.innerHTML = ulList;

        imgElement.src = "https://hickory-quilled-actress.glitch.me/" + indexLaptop.image;

        laptopTitle.innerText = indexLaptop.title;
        laptopDescription.innerText = indexLaptop.description;
        laptopPrice.innerText = indexLaptop.price;
    })
    
    //-------------Buy laptop handling--------------
    buyLaptopButton.addEventListener("click",function(){

        let balanceToBuyLaptop = parseInt(balanceMoney.innerText);
        let currentLaptopPrice = parseInt(laptopPrice.innerText);

        if(balanceToBuyLaptop >= currentLaptopPrice){
            let difference = balanceToBuyLaptop - currentLaptopPrice;
            balanceMoney.innerText = difference;
            alert("Congratulations! The laptop is yours.")
        } else {
            alert("You don't have enough money to buy this laptop.")
        }
    })

    //In case of error in image loading, in this case image 5 has a problem.
    //If we had no way of knowing image 5 had a problem we could just set the default image source to be a default image.
    imgElement.addEventListener("error", function(event) {
        event.target.src = "https://hickory-quilled-actress.glitch.me/assets/images/5.png"
        event.onerror = null
    })
