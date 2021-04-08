var currentWeatherObj;






function getUvIndex(lat, lon){
    console.log("inside uv index function");
    var uvRequest = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ lon +"&appid=40cb67d75c988d881d5132977c0b65a5";
    fetch(uvRequest)
    .then(function (response) {
        return response.json()
    })
    .then(function(jsonResp) {
        console.log(typeof(jsonResp));
        console.log(jsonResp.current.uvi)
        return jsonResp.current.uvi;
     })
    .catch(function (error) {
        console.log('error is' + error);
    })
}


function processCurrentWeatherData(data) {
    var latitude = data.coord.lat;
    var longitude = data.coord.lon;
    var uvIndex = getUvIndex(latitude, longitude);
    currentWeatherObj = {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        pressure: data.main.humidity,
        wind: data.wind.speed,
        uvIndex: uvIndex
    }
    return currentWeatherObj;
}

function getCurrentWeather(cityName) { 
    var currentWeatherRequest =
        "https://api.openweathermap.org/data/2.5/weather?q=London&appid=40cb67d75c988d881d5132977c0b65a5";
    fetch(currentWeatherRequest)
        .then(function (response) {
            return response.json()
        })
        .then(function(jsonResp) {
            processCurrentWeatherData(jsonResp)
         })
        .catch(function (error) {
            console.log('error is' + error);
        })
}



function getDashboardResults(cityName) {

   var currentWeatherResponse = processCurrentWeatherData(getCurrentWeather());
  // displayResponse(currentWeatherResponse);
   
   //var forecast5DaysResponse = processForecastData(getForecastWeatherMock());
  // displayResponse(forecast5DaysResponse)

}


getDashboardResults();


/**parse response and populate the frontend fields
call second Api f or forecast data
function for storasge of city names
add js event function for button click**/
