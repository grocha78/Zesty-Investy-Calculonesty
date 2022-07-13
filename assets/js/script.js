var context = document.getElementById("data-set").getContext("2d");
var bar = new Chart(context, {});

var intialAmount = document.getElementById("initial-amount");
var years = document.getElementById("years");
var rates = document.getElementById("rates");
var contributions = document.getElementById("contributions");

var message = document.getElementById("message");
var button = document.querySelector(".input-group-button");
var conversionButton = document.querySelector(".conversion-btn");
var conversionContainerEl = document.querySelector("#conversion-container");
var convertedAmount = document.querySelector(".converted-amount");

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

    for (var i = 1; i <= period; i++) {
      let dollarUSLocale = Intl.NumberFormat("en-US");
      var final =
        contribute + initial * Math.pow(1 + interest / 100 / 1, 1 * i);
      data.push(toDecimal(final, 2));
      labels.push("Year " + i);
      rawGrowth = toDecimal(final, 2);
      growth = dollarUSLocale.format(rawGrowth);
    }

    message.innerText = `You will have this amount: $${growth} after ${period} years`;
    drawGraph();
    var investmentTotal = localStorage.setItem("Account-Balance", rawGrowth);
    conversionContainerEl.classList.remove("hide");
    return investmentTotal;
  } catch (error) {
    console.error(error);
  }

  saveBalance();
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

button.addEventListener("click", calculateGrowth) 

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

var saveBalance = function() {
    localStorage.setItem("Account-Balance", JSON.stringify(balance));
    console.log(data);
};

var loadBalance = function() {
    var savedBalance = localStorage.getItem("Account-Balance");
    // if there is no balance, set balance to an empty array and return out of the function
    if (!savedBalance) {
        return false;
    }
    console.log("Saved balance found!");
    // else, load up saved balance

    // parse into array of objects
    savedBalance = JSON.parse(savedBalance);

    // loop through savedBalance array
    for (var i = 0; i < savedBalance.length; i++) {
        // pass each balance object into the 'calculateGrowth()' function
        calculateGrowth(savedBalance[i]);
    }
};

loadBalance();