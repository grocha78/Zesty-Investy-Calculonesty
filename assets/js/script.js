var getFinancialData = function (year) {
  var apiKey = "gPd2zyM9aM9X1O3H2siv9B8iDbAkvltl";
  var apiUrl = fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data, city);
      });
    } else {
      weatherSearchedCity.textContent = "Error: City not found";
    }
  });
};
