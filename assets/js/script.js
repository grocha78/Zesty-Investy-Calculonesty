var context = document.getElementById("data-set").getContext("2d");
var bar = new Chart(context, {});

var intialAmount = document.getElementById("initial-amount");
var years = document.getElementById("years");
var rates = document.getElementById("rates");
var contributions = document.getElementById("contributions");

var message = document.getElementById("message");
var button = document.querySelector(".input-group-button");

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
          backgroundColor: "rgb(212, 175, 55)",
          borderWidth: 0,
        },
      ],
    },
  });
};

var toDecimal = function (value, decimals) {
  return +value.toFixed(decimals);
};

button.addEventListener("click", calculateGrowth);

// possible local storage function
// "city" has been turned into "results" per class id on line 43 of html
// is the getWeather function below equal to the calculateGrowth function above?

// var searchHistoryEl = $("#search-history");
// var calculateInputEL = $("#calculate-input");
// var searchButtonEl = $("#search-button");
// var currentDayEl = $("#current-day");
// var forecastEl = $("#forecast");

// var currentHistory = [];

// function getCoordinates(results) {
//     let apiUrl = ""

//     fetch(apiUrl).then(function(response){
//         if(response.ok){
//           response.json().then(function(results) {
//             getWeather(results[0].lat, results[0].lon, results[0].name);
//           })
//         }
//       })
// }

// function search(searchHistory) { 
//     let results = "";
  
//     if(!searchHistory) {
//       function toTitleCase(str) {
//         let lower = str.toLowerCase();
//         return lower.replace(/(?:^|\s)\w/g, function(match){
//           return match.toUpperCase();
//         })
//       };
  
//       results = toTitleCase($(calculateInputEl).val().trim());
  
//       if(results==="") {
//         return;
//       } else if(currentHistory.includes(results,0)) {
//         // do nothing and continue with search
//       } else {
//         currentHistory.push(results);
//         localStorage.setItem("search",JSON.stringify(currentHistory));
//       }
//     } else {
//       results = searchHistory.trim();
//     }
  
//     getCoordinates(results);
  
//     calculateInputEl.val("");
//   };
  
//   // Populates search history column
//   function renderSearchHistory() {
//     searchHistoryEl.empty();
  
//     for(var i=0;i<currentHistory.length;i++) {
//       searchHistoryEl.prepend("<button type='submit' class='history-item mb-3 btn rounded bg-success w-100 font-weight-bold'>" + currentHistory[i] + "</button>");
//     }
//   }
  
//   // Loads search history and writes to page
//   function loadStorage() {
//     var searchHistory = localStorage.getItem("search");
  
//     if(!searchHistory) {
//       return false;
//     }
  
//     currentHistory=JSON.parse(searchHistory);
  
//     for(var i=0; i<currentHistory.length; i++) {
//       searchHistoryEl.prepend("<button type='submit' class='history-item mb-3 btn rounded bg-success w-100 font-weight-bold'>" + currentHistory[i] + "</button>");
//     }
//   }
  
//   // removes necessary elements before running subsequent search
//   // Converts search to title case and stores in localStorage before passing to getCoordinates()
//   $(searchButtonEl).on("click",searchInputEl,function(){
//     currentDayEl.children("*").remove();
//     forecastEl.children("*").remove();
//     search();
//     renderSearchHistory();
//   });
  
//   //search on history item when clicked
//   //do not log entry to search history as it already exists there
//   $(searchHistoryEl).on("click", function(event){
//     var historySearchTerm = event.target.textContent;
//     currentDayEl.children("*").remove();
//     forecastEl.children("*").remove();
//     search(historySearchTerm);
//   });
  
//   loadStorage();