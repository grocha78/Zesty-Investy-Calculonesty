var context = document.getElementById("data-set").getContext("2d");
var bar = new Chart(context, {});

var intialAmount = document.getElementById("initial-amount");
var years = document.getElementById("years");
var rates = document.getElementById("rates");
var contributions = document.getElementById("contributions");

var message = document.getElementById("message");
var button = document.querySelector(".input-group-button");

button.addEventListener("click", calculateGrowth);

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
      growth = toDecimal(final, 2);
      growth = dollarUSLocale.format(growth);
    }

    message.innerText = `You will have this amount $${growth} after ${period} years`;
    drawGraph();
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
          backgroundColor: "rgba(12, 141, 0, 0.7)",
          borderWidth: 0,
        },
      ],
    },
  });
};

var toDecimal = function (value, decimals) {
  return +value.toFixed(decimals);
};
