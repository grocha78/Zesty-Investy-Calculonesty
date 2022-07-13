var context = document.getElementById("data-set").getContext("2d");
var bar = new Chart(context, {});

var intialAmount = document.getElementById("initial-amount");
var years = document.getElementById("years");
var rates = document.getElementById("rates");
var contributions = document.getElementById("contributions");

var message = document.getElementById("message");
var button = document.querySelector(".input-group-button");
var conversionButton = document.querySelector(".conversion-btn");
var apiContainerEl = document.getElementById("api-content-container");
var results = document.querySelector(".results");
var conversionContainerEl = document.querySelector("#conversion-container");
var convertedAmount = document.querySelector(".converted-amount");
var currencyTable = document.getElementById("currency-codes");
var cardContainerEl = document.querySelector("#card-container");

var data = [];
var labels = [];

var calculateGrowth = function (e) {
  e.preventDefault();
  data.length = 0;
  labels.length = 0;
  var growth = 0;
  try {
    var initial = parseInt(intialAmount.value);
    var period = parseInt(years.value);
    var interest = parseInt(rates.value);
    var contribute = parseInt(contributions.value);
    var newInterest = interest / 100 / 12;
    console.log(newInterest);
    for (var i = 1; i <= period; i++) {
      let dollarUSLocale = Intl.NumberFormat("en-US");
      var final = contribute + initial * Math.pow(1 + newInterest, 12 * i);
      data.push(toDecimal(final, 2));
      labels.push("Year " + i);
      rawGrowth = toDecimal(final, 2);
      growth = dollarUSLocale.format(rawGrowth);
    }

    message.innerText = `You will have this amount: $${growth} after ${period} years`;
    drawGraph();
    var investmentTotal = localStorage.setItem("Account-Balance", rawGrowth);
    results.classList.add("box-shadow");
    currencyTable.classList.remove("hide");
    currencyTable.classList.add("block");
    conversionContainerEl.classList.remove("hide");
    cardContainerEl.classList.remove("hide");
    return investmentTotal;
  } catch (error) {
    console.error(error);
  }

  // saveBalance();

};

var drawGraph = function () {
  bar.destroy();
  bar = new Chart(context, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Growth throughout the Years",
          data,
          fill: true,
          backgroundColor: "#14770b",
          borderWidth: 0,
        },
      ],
    },
  });
};

var toDecimal = function (value, decimals) {
  return +value.toFixed(decimals);
};

var calculateConversion = function (event) {
  event.preventDefault();
  var myHeaders = new Headers();
  myHeaders.append("apikey", "21x8PSp7AjckH13xSwlutwsSoLp93Tib");

  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: myHeaders,
  };

  var investmentTotal = localStorage.getItem("Account-Balance");
  var countryInput = document.querySelector("#currency-conversions");
  var to = countryInput.value;

  console.log(to, investmentTotal);
  fetch(
    `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=USD&amount=${investmentTotal}`,
    requestOptions
  ).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        convertedValue(data);
      });
    }
  });

  var convertedValue = function (value) {
    console.log(value.result);
    rawValue = value.result;
    filteredValue = toDecimal(rawValue, 2);
    convertedAmount.textContent = filteredValue;
  };
};

var myTable = new Headers();
myTable.append("apikey", "Nz8ARHO3m6OatqxGu8NexGyTeSUEAMps");

var requestSymbols = {
  method: "GET",
  redirect: "follow",
  headers: myTable,
};

fetch(
  "https://api.apilayer.com/exchangerates_data/symbols",
  requestSymbols
).then(function (response) {
  if (response.ok) {
    response.json().then(function (symbols) {
      displaySymbols(symbols);
    });
  }
});

var displaySymbols = function (symbols) {
  for (var currencyCode in symbols.symbols) {
    var group = document.createElement("tr");
    var code = document.createElement("td");
    code.textContent = currencyCode;
    var territory = document.createElement("td");
    territory.textContent = symbols.symbols[currencyCode];
    group.appendChild(code);
    group.appendChild(territory);
    currencyTable.appendChild(group);

    // console.log("Abbreviation: " + currencyCode);
    // console.log("Label: " + symbols.symbols[currencyCode]);
  }
};

// var saveBalance = function() {
//   localStorage.setItem("data", JSON.stringify(balance));
// };

// var loadBalance = function() {
//   var savedBalance = localStorage.getItem("data");

//   if (!savedBalance) {
//     return false;
//   }
//   console.log("Saved balance found!");

//   savedBalance = JSON.parse(savedBalance);

//   for (var i = 0; i < savedBalance.length; i++) {

//     calculateGrowth(savedBalance[i]);
//   }
// };

button.addEventListener("click", calculateGrowth);
conversionButton.addEventListener("click", calculateConversion);

// loadBalance();
