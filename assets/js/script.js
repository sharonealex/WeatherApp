var currentWeatherObj;



function getCurrentWeather(cityName) { //NOT WORKING AT THE MOMENT
    var currentWeatherRequest =
        "https://api.openweathermap.org/data/2.5/weather?q=London&appid=40cb67d75c988d881d5132977c0b65a5";
    fetch(currentWeatherRequest).then(function (data) {
        console.log(data);
    });
}



function getUVindex(lat, long){
    return "7.5"  //functionality to be added later
}



function processWeatherData(data) {
    var latitude = data.coord.lat;
    var longitude = data.coord.lon;
    var uvIndex = getUVindex(latitude, longitude);
    currentWeatherObj = {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        pressure: data.main.humidity,
        wind: data.wind.speed,
        uvIndex: uvIndex
    }
    return currentWeatherObj;
}


function getCurrentWeatherMock() {
    return {
        coord: { lon: -0.1257, lat: 51.5085 },
        weather: [
            { id: 803, main: "Clouds", description: "broken clouds", icon: "04d" },
        ],
        base: "stations",
        main: {
            temp: 278.63,
            feels_like: 274.04,
            temp_min: 277.59,
            temp_max: 279.82,
            pressure: 1024,
            humidity: 45,
        },
        visibility: 10000,
        wind: { speed: 7.72, deg: 280 },
        clouds: { all: 75 },
        dt: 1617792444,
        sys: {
            type: 1,
            id: 1414,
            country: "GB",
            sunrise: 1617772914,
            sunset: 1617820973,
        },
        timezone: 3600,
        id: 2643743,
        name: "London",
        cod: 200,
    };
}

//Funtion invoking Mocks as APIs not working
function getDashboardResults(cityName) {

   var currentWeatherResponse = processWeatherData(getCurrentWeatherMock());
   displayResponse(currentWeatherResponse);
   
   var forecast5DaysResponse = processForecastData(getForecastWeatherMock());
   displayResponse(forecast5DaysResponse)

}


getDashboardResults();


/**parse response and populate the frontend fields
call second Api f or forecast data
function for storasge of city names
add js event function for button click**/
