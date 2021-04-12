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
var index = 0;
var searchedCitiesList = [];
const searchHistoryEl = document.querySelector("#searchTable");

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

function displayForecast(forecastData) {
    for (i = 0; i < forecastEl.length; i++) {

        forecastEl[i].innerHTML = "";
        var unixFormat = moment.unix(forecastData.list[index].dt).format("MMM Do, YYYY, hh:mm:ss");
        var forecastDateEl = document.createElement("p");
        forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
        forecastDateEl.innerHTML = unixFormat
        forecastEl[i].append(forecastDateEl);
        var forecastWeatherEl = document.createElement("img");
        //  forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/10d@2x.png");
        forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastData.list[index].weather[0].icon + "@2x.png");
        forecastWeatherEl.setAttribute("alt", "weatherImg" + i);
        forecastEl[i].append(forecastWeatherEl);
        var forecastTempEl = document.createElement("p");
        forecastTempEl.innerHTML = "Temp: " + forecastData.list[index].main.temp;
        forecastEl[i].append(forecastTempEl);
        var forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.innerHTML = "Humidity: " + forecastData.list[index].main.humidity + "%";
        forecastEl[i].append(forecastHumidityEl);
        index = index + 8;
    }
}

/**
 * API call to forecast API and return 5 days of weather forcast.
 * */

function get5DaysForeCastDashboardResults(city) {
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=40cb67d75c988d881d5132977c0b65a5";
    fetch(forecastUrl)
        .then(function (resp) {
            return resp.json();
        })
        .then(function (forecastData) {
            displayForecast(forecastData)
        })
        .catch(function (err) {
            console.log('error' + err);
        })
}

function saveCityName(city) {
    searchedCitiesList.push(city);
    localStorage.setItem("cities", searchedCitiesList)
}

function displaySearchedCitiesList() {

    if(localStorage.getItem("cities")){
        var cities = localStorage.getItem("cities");
        for (let i=0; i<cities.length; i++) {
            var row = searchHistoryEl.insertRow(1);
            var cell = row.insertCell(0);
            cell.innerHTML = cities[i];
        }
    }

   
}


/**
 * Event handler for search button
 * */

var searchHandler = function (event) {

    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (city) {
        windSpeedEl.textContent = '';
        tempEl.textContent = '';
        humidityEl.textContent = '';
        cityEl.textContent = city;
        cityInputEl.value = "";
        getDashboardResults(city);
        get5DaysForeCastDashboardResults(city);
    } else {
        alert("Please enter valid City for search");
    }
    saveCityName(city);
    //displaySearchedCitiesList();  Not working.

}


citySearchEl.addEventListener("click", searchHandler)
