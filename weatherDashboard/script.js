var searchButton = document.querySelector("#search-button");
var searchInput = document.querySelector("input");
var weatherApiRootUrl = 'https://api.openweathermap.org';
var weatherApiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';
var city;
var searchHistory = [];
var historyContainerEl = document.querySelector("#history");


function appendToHistory(city) {
   if(searchHistory.indexOf(city == -1)){
    searchHistory.push(city)
    window.localStorage.setItem("search-history", searchHistory)
  renderSearchHistory()
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
           renderItems (city, data);
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

function renderSearchHistory(){
    historyContainerEl.innerHTML = '';
    for(var i = searchHistory.length -1; i >=0; i--){
        var btn = document.createElement("button");
        btn.classList.add('history-btn')
        btn.setAttribute('data-search', searchHistory[i]);
        btn.textContent = searchHistory[i];
        historyContainerEl.append(btn)
    }
}

function initSearchHistory(){
    var storedHistory = window.localStorage.getItem("search-history");
    if(storedHistory){
        searchHistory = JSON.parse(storedHistory);
    }
    renderSearchHistory();
}

searchButton.addEventListener("click", handleSearchFormSubmit)
initSearchHistory();


