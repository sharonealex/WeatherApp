var currentWeatherObj;
var cityInputEl = document.querySelector("#city");
var citySearchEl = document.querySelector("#search-button");
var processCurrentWeatherData1;
var cityEl = document.querySelector("#searchedCity");
var tempEl = document.querySelector("#temperature");
var humidityEl = document.querySelector("#humidity");
var windSpeedEl = document.querySelector("#wind-speed");
var pressureEl = document.querySelector("#pressure");
var uvindexEl = document.querySelector("#UV-index");
var uvIndexValue;
var forecastEl = document.querySelectorAll(".forecast");

/**
 * Function to extract the UV index of a city against the provided latiuted and longitude.
 * */

function getUvIndex(lat, lon, currentWeatherObj) {

    var uvRequest = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=40cb67d75c988d881d5132977c0b65a5";
    fetch(uvRequest)
        .then(function (response) {
            return response.json()
        })
        .then(function (jsonResp) {
            uvIndexValue = jsonResp.current.uvi;

            var uvIndexSpan = document.createElement('span');
            uvIndexSpan.setAttribute("class", "badge badge-danger");
            uvIndexSpan.innerHTML = jsonResp.current.uvi;
            uvindexEl.innerHTML = "UV Index: ";
            uvindexEl.append(uvIndexSpan);
        })
        .catch(function (error) {
            console.log('error is' + error);
        })
}

/**
 * The current weather result is iterated and rendered through HTML tags
 * */

function displayCurrentWeather(city, weather) {
    cityEl.textContent = city;

    var tempSpan = document.createElement('span')
    tempSpan.textContent = "Temperature: " + weather.temperature + "F";
    tempEl.appendChild(tempSpan);

    var humiditySpan = document.createElement('span')
    humiditySpan.textContent = "Humidity: " + weather.humidity + "%";
    humidityEl.appendChild(humiditySpan);

    var windSpan = document.createElement('span');
    windSpan.textContent = "Wind Speed: " + weather.wind + "MPH";
    windSpeedEl.appendChild(windSpan);

}


/**
 * Queries the openweatherMap api for current dates weather.
 * Also calls a separate call to fetch the UVIndex.
 * */

function getDashboardResults(city) {
    var currentWeatherRequest =
        "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=40cb67d75c988d881d5132977c0b65a5";
    fetch(currentWeatherRequest)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            var latitude = data.coord.lat;
            var longitude = data.coord.lon;
            currentWeatherObj = {
                temperature: data.main.temp,
                humidity: data.main.humidity,
                pressure: data.main.humidity,
                wind: data.wind.speed,
                date: data.dt
            }
            return getUvIndex(latitude, longitude, currentWeatherObj);
        })
        .then(function () {
            return currentWeatherObj;
        })
        .then(function (currentWeatherObj) {
            displayCurrentWeather(city, currentWeatherObj)
        })
        .catch(function (error) {
            console.log('error is' + error);
        })
}

/**
 * Forecast for 5 days is iterated and rendered through HTML tags
 * */

function displayForecast(forecastData){
    for (i=0; i < forecastEl.length; i++) {
        forecastEl[i].innerHTML = "";
        var forecastIndex = i*8 + 4;
        var forecastMonth = '4';
        var forecastDay = '4';
        var forecastYear = '5';
        var forecastDateEl = document.createElement("p");
        forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
        forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
        forecastEl[i].append(forecastDateEl);
        var forecastWeatherEl = document.createElement("img");
        forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/10d@2x.png");
        forecastWeatherEl.setAttribute("alt",forecastData.list[0].weather[0].description);
        forecastEl[i].append(forecastWeatherEl);
        var forecastTempEl = document.createElement("p");
        forecastTempEl.innerHTML = "Temp: " + forecastData.list[0].main.temp;
        forecastEl[i].append(forecastTempEl);
        var forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.innerHTML = "Humidity: " + forecastData.list[0].main.humidity + "%";
        forecastEl[i].append(forecastHumidityEl);
    }
}

/**
 * API call to forecast API and return 5 days of weather forcast.
 * */

function get5DaysForeCastDashboardResults(city){
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=london&appid=40cb67d75c988d881d5132977c0b65a5"
    fetch(forecastUrl)
    .then(function(resp){
        return resp.json();
    })
    .then(function(forecastData){
        console.log(forecastData);
        displayForecast(forecastData)
    })
    .catch(function(err){
        console.log('error'+  err);
    })

    
}

/**
 * Event handler for search button
 * */

var searchHandler = function (event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (city) {
        getDashboardResults(city);
        get5DaysForeCastDashboardResults(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a City");
    }
}


citySearchEl.addEventListener("click", searchHandler)