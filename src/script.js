//show current day and time
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatDate(timestamp) {
  let currentDate = new Date(timestamp);

  let day = currentDate.getDay();
  let hour = ("0" + currentDate.getHours()).slice(-2);
  let minutes = ("0" + currentDate.getMinutes()).slice(-2);

  return `${days[day]}, ${hour}:${minutes}`;
}

function formatForecastDays(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  days[1] = "Today";
  return days[day];
}

function formatForecastHours(timestamp) {
  let date = new Date(timestamp * 1000);
  let hour = ("0" + date.getHours()).slice(-2) + ":00";

  return hour;
}

//forecast Hourly display
function handleForecastHourly(response) {
  let forecastHourly = response.data.hourly;
  let forecastHourlyElement = document.querySelector("#forecastTodayHourly");

  let forecastHTML = `<div class="row forecastSymbols"> <div class="col-2">
        <div class="forecastHour" id="time">Now
        </div>
        <img src="https://openweathermap.org/img/wn/${
          forecastHourly[0].weather[0].icon
        }@2x.png" id="icon" alt="" />
         <div class=forecastHourlyTemp> <span id="hourTemp">${Math.round(
           forecastHourly[0].temp
         )}</span><span id="unit">º</span></div>
        </div>`;

  forecastHourly.forEach(function (forecastHour, index) {
    if (index < 5 && index > 0) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
        <div class="forecastHour" id="time">${formatForecastHours(
          forecastHour.dt
        )}</div>
        <img src="https://openweathermap.org/img/wn/${
          forecastHour.weather[0].icon
        }@2x.png" id="icon" alt="" />
         <div class=forecastHourlyTemp> <span id="hourTemp">${Math.round(
           forecastHour.temp
         )}</span><span>º</span></div>
        </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastHourlyElement.innerHTML = forecastHTML;
}

//forecast display
function handleForecast(response) {
  let forecastDaily = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = "";
  forecastDaily.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="row align-items-center forecastEl">
    <div class="col-2 day">${formatForecastDays(forecastDay.dt)}</div>
      <div class="col-1 weather"><img src="https://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png" id="icon" alt="" /></div>
        <div class="col-2 tempMinMax">
          Min: <span id="min-value">${Math.round(
            forecastDay.temp.min
          )}</span><span id="units">ºC</span>
          <br />
          Max: <span id="max-value">${Math.round(
            forecastDay.temp.max
          )}</span><span id="units">ºC</span>
        </div>
      <div class="col-6 description">${forecastDay.weather[0].description}</div>
    </div>
  </div>`;
    }
  });

  forecastElement.innerHTML = forecastHTML;

  celsiusTempMin = response.data.daily[0].temp.min;
  let tempMin = Math.round(celsiusTempMin);
  let tempMinShowed = document.querySelector(".tempTodayMin #min-value");
  tempMinShowed.innerHTML = `${tempMin}`;

  celsiusTempMax = response.data.daily[0].temp.max;
  let tempMax = Math.round(celsiusTempMax);
  let tempMaxShowed = document.querySelector(".tempTodayMax #max-value");
  tempMaxShowed.innerHTML = `${tempMax}`;

  let uvIndex = Math.round(response.data.current.uvi);
  document.querySelector(".uvindex").innerHTML = `UV-index: ${uvIndex}`;

  let tempUnits = document.querySelectorAll("#units");

  if (unit === "metric") {
    for (var i = 0; i < tempUnits.length; i++) {
      tempUnits[i].innerHTML = `${unitCelsius}`;
    }
  } else {
    for (var i = 0; i < tempUnits.length; i++) {
      tempUnits[i].innerHTML = `${unitFahrenheit}`;
    }
  }
}

//get the location coordinates and apicall for the forecast
function getForecast(coordinates) {
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiKey = "a68381d4faf2a13b11b7dc8945964fc7";

  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(handleForecast);
  axios.get(apiUrl).then(handleForecastHourly);
}

//Change city and temperature to city put in search bar
function handleWeather(response) {
  let date = document.querySelector(".date");
  date.innerHTML = formatDate(response.data.dt * 1000);

  let city = document.querySelector(".currentCity");
  city.innerHTML = response.data.name;

  celsiusTemp = response.data.main.temp;
  let temp = Math.round(celsiusTemp);
  let tempNumber = document.querySelector(".tempValue");
  tempNumber.innerHTML = `${temp}`;
  tempUnit.innerHTML = `${unitCelsius}`;

  let humidity = Math.round(response.data.main.humidity);
  let humidityShown = document.querySelector(".humidity");
  humidityShown.innerHTML = `Humidity: ${humidity}%`;

  let wind = response.data.wind.speed;

  if (unit === "metric") {
    tempUnit.innerHTML = `${unitCelsius}`;
    document.querySelector(".wind").innerHTML = `Wind: ${Math.round(
      3.6 * wind
    )} km/h`;
    for (var i = 0; i < tempUnits.length; i++) {
      tempUnits[i].innerHTML = `${unitCelsius}`;
    }
  } else {
    tempUnit.innerHTML = `${unitFahrenheit}`;
    document.querySelector(".wind").innerHTML = `Wind: ${Math.round(wind)} mph`;
    for (var i = 0; i < tempUnits.length; i++) {
      tempUnits[i].innerHTML = `${unitFahrenheit}`;
    }
  }

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "a68381d4faf2a13b11b7dc8945964fc7";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(handleWeather);
}

// Show temperature and stats for city typed in search bar
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#inputCity").value;
  search(city);
}

// Add also 'search city' if clicked on search icon
function handleSearchButton(response) {
  response.preventDefault();
  let city = document.querySelector("#inputCity").value;
  search(city);
}

// Show temperature for current location
function showLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "a68381d4faf2a13b11b7dc8945964fc7";

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(handleWeather);
}

function handleLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showLocation);
}

// Chose which unit for temperature to use
function handleClickCelsius(event) {
  event.preventDefault();
  fahrenheitClick.classList.remove("active");
  celsiusClick.classList.add("active");

  unit = "metric";
  let apiKey = "a68381d4faf2a13b11b7dc8945964fc7";
  let city = document.querySelector(".currentCity").innerHTML;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(handleWeather);
}

function handleClickFahrenheit(event) {
  event.preventDefault();
  celsiusClick.classList.remove("active");
  fahrenheitClick.classList.add("active");

  unit = "imperial";
  let apiKey = "a68381d4faf2a13b11b7dc8945964fc7";
  let city = document.querySelector(".currentCity").innerHTML;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(handleWeather);
}

let tempUnit = document.querySelector("#units");
let unitCelsius = "ºC";
let unitFahrenheit = "ºF";

//try to change all units
let tempUnits = document.querySelectorAll("#units");

// for (var i = 0; i < tempUnits.length; i++) {
//   tempUnits[i].innerHTML = `${unitCelsius}`;
// }

let celsiusTemp = null;
let celsiusTempMin = null;
let celsiusTempMax = null;
let unit = "metric";

let celsiusClick = document.querySelector(".tempCelsius");
celsiusClick.addEventListener("click", handleClickCelsius);

let fahrenheitClick = document.querySelector(".tempFahrenheit");
fahrenheitClick.addEventListener("click", handleClickFahrenheit);

let currentLocationButton = document.querySelector(".currentLoc");
currentLocationButton.addEventListener("click", handleLocation);

let searchForm = document.querySelector("#search-bar");
searchForm.addEventListener("submit", handleSubmit);

let searchButton = document.querySelector("#searchButton");
searchButton.addEventListener("click", handleSearchButton);
//Standardly shown city
search("Leiden");
