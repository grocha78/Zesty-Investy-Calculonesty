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

// Data will contain the total amount for the year and label will contain the year
var data = [];
var labels = [];

var calculateGrowth = function (e) {
  e.preventDefault();
  data.length = 0;
  labels.length = 0;
  var growth = 0;
  try {
    //variables for our interest function
    var initial = parseInt(intialAmount.value);
    var period = parseInt(years.value);
    var interest = parseInt(rates.value);
    var contribute = parseInt(contributions.value);
    var newInterest = interest / 100 / 12;

    // calculation for compounding growth  A = P(1 + (r/n))^nt
    for (var i = 1; i <= period; i++) {
      let dollarUSLocale = Intl.NumberFormat("en-US");
      var final =
        initial * Math.pow(1 + newInterest, 12 * i) +
        (contribute * ([i] + 1) - contribute * [i]);
      data.push(toDecimal(final, 2));
      labels.push("Year " + i);
      // converting it into a dollar amount
      rawGrowth = toDecimal(final, 2);
      growth = dollarUSLocale.format(rawGrowth);
    }

    //display the graph and unhide the currency codes and exchange button
    message.innerText = `You will have this amount: $${growth} after ${period} years`;
    drawGraph();
    var investmentTotal = localStorage.setItem("Account-Balance", rawGrowth);
    results.classList.add("box-shadow");
    currencyTable.classList.remove("hide");
    currencyTable.classList.add("block");
    conversionContainerEl.classList.remove("hide");
    return investmentTotal;
  } catch (error) {
    console.error(error);
  }
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

//Mininmize values to have 2 decimal places at most
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
// Creates Table with all of the currency codes
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
  }
};

button.addEventListener("click", calculateGrowth);
conversionButton.addEventListener("click", calculateConversion);
