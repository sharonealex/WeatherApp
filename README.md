# WeatherApp

## Introduction

This is a weather dashboard that allows users to check weather of any city and also get an insight into the forecast for the next 5 days.


## Mockups

The following screenshot demonstrates the application functionality:

![Alt text](./assets/images/weatherDashboard.PNG?raw=true "Title")

## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```

## Technology

* Satisfies all of the above acceptance criteria plus the following:

    * Uses the OpenWeather API to retrieve weather data.

    * Uses `localStorage` to store persistent data.

### Deployment

* Application deployed at live URL  https://sharonealex.github.io/WorkDayScheduler/.




