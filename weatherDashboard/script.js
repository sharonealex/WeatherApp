var searchButton = document.querySelector("#search-button");
var searchInput = document.querySelector("input");
var todayContainer = document.querySelector("#today")

var weatherApiRootUrl = 'https://api.openweathermap.org';
var weatherApiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';
var forecastEl = document.querySelector("#forecast")
var city;
var searchHistory = [];
var historyContainerEl = document.querySelector("#history");

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function renderCurrentWeather(city, weather, timezone) {
    var date = dayjs().tz(timezone).format('M/D/YYYY');
    var tempF = weather.temp;
    var windMph = weather.wind_speed;
    var humidity = weather.humidity;
    var uvi = weather.uvi;
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    var iconDescription = weather.weather[0].description || weather[0].main;

    var card = document.createElement("div");
    var cardBody = document.createElement("div");
    var heading = document.createElement("h2");
    var weatherIcon = document.createElement("img");
    var tempEl = document.createElement("p");
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    var uvEl = document.createElement("p");
    var uviBadge = document.createElement("button");

    heading.textContent = `${city} (${date})`;
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    weatherIcon.setAttribute('class', 'weather-img');
    heading.append(weatherIcon);
    tempEl.textContent = `Temp: ${tempF}°F`;
    windEl.textContent = `Wind: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    card.setAttribute("class", "card");
    cardBody.setAttribute("class", 'card-body');
    card.append(cardBody);
    uvEl.textContent = 'UV Index: ';
    uviBadge.classList.add('btn', 'btn-sm');
    if (uvi < 3) {
        uviBadge.classList.add('btn-success');
    } else if (uvi < 7) {
        uviBadge.classList.add('btn-warning');
    } else {
        uviBadge.classList.add('btn-danger');
    }
    uviBadge.textContent = uvi;
    uvEl.append(uviBadge)
    cardBody.append(heading, tempEl, windEl, humidityEl, uvEl)
    todayContainer.innerHTML = '';
    todayContainer.append(card);
}

function renderForecastCard(forecast, timezone){
 var unixTimestamp = forecast.dt;
 var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
 var iconDescription = forecast.weather[0].description;
  var tempF = forecast.temp.day;
  var { humidity } = forecast;
  var windMph = forecast.wind_speed;

  var col = document.createElement('div');
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var cardTitle = document.createElement('h5');
  var weatherIcon = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.setAttribute('class', 'col-md');
  col.classList.add('five-day-card');
  card.setAttribute('class', 'card bg-primary h-100 text-white');
  cardBody.setAttribute('class', 'card-body p-2');
  cardTitle.setAttribute('class', 'card-title');
  tempEl.setAttribute('class', 'card-text');
  windEl.setAttribute('class', 'card-text');
  humidityEl.setAttribute('class', 'card-text');

  // Add content to elements
  cardTitle.textContent = dayjs.unix(unixTimestamp).tz(timezone).format('M/D/YYYY');
  weatherIcon.setAttribute('src', iconUrl);
  weatherIcon.setAttribute('alt', iconDescription);
  tempEl.textContent = `Temp: ${tempF} °F`;
  windEl.textContent = `Wind: ${windMph} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  forecastEl.append(col);
}

function renderForecast(dailyForecast, timezone){
    
    var startDt = dayjs().tz(timezone).add(1, 'day').startOf('day').unix();
    var endDt = dayjs().tz(timezone).add(6, 'day').startOf('day').unix();
    var headingCol = document.createElement("div");
    var heading = document.createElement("h4");
    
    headingCol.setAttribute('class', 'col-12');
    heading.textContent = '5-Day Forecast:';
    headingCol.append(heading);
    forecastEl.append(headingCol);
    forecastEl.innerHTML = "";
    for (var i = 0; i < dailyForecast.length; i++) {
        // The api returns forecast data which may include 12pm on the same day and
        // always includes the next 7 days. The api documentation does not provide
        // information on the behavior for including the same day. Results may have
        // 7 or 8 items.
        if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
          renderForecastCard(dailyForecast[i], timezone);
        }
      }

}

function renderItems(city, data) {
    console.log(data)
    renderCurrentWeather(city, data.current, data.timezone);
    renderForecast(data.daily, data.timezone);
}

function appendToHistory(city) {
    var isPresent = searchHistory.indexOf(city); //-1
    if (isPresent == -1) {
        searchHistory.push(city)
        window.localStorage.setItem("search-history", JSON.stringify(searchHistory))
        renderSearchHistory()
    }else {
        return;
    }
}

function fetchWeather(location) {
    var lat = location.lat;
    var lon = location.lon;
    var city = location.name;
    var apiUrl = `${weatherApiRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${weatherApiKey}`;
    fetch(apiUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            //this data has all the  mashed up info for both the rendering divs.
            renderItems(city, data);
        })
}

function getCoordinates(city) {
    var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${city}&limit=5&appid=${weatherApiKey}`;
    fetch(apiUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {

            if (data[0]) {
                appendToHistory(city);
                fetchWeather(data[0]);
            } else {
                alert("Location not found");
            }
        }
        )
        .catch(function (err) {
            console.log(err)
        })
}


function handleSearchFormSubmit(event) {
    event.preventDefault();
    if (searchInput) {
        city = searchInput.value.trim();
        getCoordinates(city);
        searchInput.value = "";
    }
    return;
}

function renderSearchHistory() {
    historyContainerEl.innerHTML = '';
    for (var i = searchHistory.length - 1; i >= 0; i--) {
        var btn = document.createElement("button");
        btn.classList.add('history-btn')
        btn.setAttribute('data-search', searchHistory[i]);
        btn.textContent = searchHistory[i];
        historyContainerEl.append(btn)
    }
}

function initSearchHistory() {
    var storedHistory = window.localStorage.getItem("search-history");
    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory);
    }
    renderSearchHistory();
}

function handleSearchHistoryClick(e){
e.preventDefault();
if(e.target.matches(".history-btn")){
    var btn = e.target;
    var searchedCity = btn.getAttribute("data-search");
    getCoordinates(searchedCity)
}
}

searchButton.addEventListener("click", handleSearchFormSubmit);
historyContainerEl.addEventListener("click", handleSearchHistoryClick)
initSearchHistory();


