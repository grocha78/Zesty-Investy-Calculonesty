var getFinancialData = function (date1, date2) {
  var ticker = "SPY";
  var date1 = "2019-01-05";
  var date2 = "2022-01-05";
  var apiKey = "gPd2zyM9aM9X1O3H2siv9B8iDbAkvltl";
  var apiUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${date1}/${date2}?apiKey=${apiKey}`;

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
      });
    }
  });
};

getFinancialData();
