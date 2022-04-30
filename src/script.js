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
  //console.log(currentDate);
  let day = currentDate.getDay();
  let hour = ("0" + currentDate.getHours()).slice(-2);
  let minutes = ("0" + currentDate.getMinutes()).slice(-2);

  return `${days[day]}, ${hour}:${minutes}`;
}

//change hours in today's forecast
function addHours(h) {
  let currentDate = new Date();
  let hour = currentDate.getHours();
  let time = hour + h;
  if (time >= 24) {
    let newTime = time - 24;
    if (newTime < 10) {
      return `0${newTime}`;
    } else {
      return time - 24;
    }
  } else {
    return time;
  }
}

function formatDateForecastHours() {
  document.querySelector("#timeOne").innerHTML = `${addHours(1)}`;
  document.querySelector("#timeTwo").innerHTML = `${addHours(2)}`;
  document.querySelector("#timeThree").innerHTML = `${addHours(3)}`;
  document.querySelector("#timeFour").innerHTML = `${addHours(4)}`;
}

formatDateForecastHours();

// change days in week's forecast
function addDays(d) {
  let currentDate = new Date();
  let day = currentDate.getDay();
  let addDay = day + d;
  if (addDay > 6) {
    return days[addDay - 7];
  }
  return days[addDay];
}

function formatDateForecastWeekdays() {
  document.querySelector("#dayOne .day").innerHTML = `${addDays(1)}`;
  document.querySelector("#dayTwo .day").innerHTML = `${addDays(2)}`;
  document.querySelector("#dayThree .day").innerHTML = `${addDays(3)}`;
  document.querySelector("#dayFour .day").innerHTML = `${addDays(4)}`;
}

formatDateForecastWeekdays();

//Change city and temperature to city put in search bar
function handleWeather(response) {
  let date = document.querySelector(".date");
  date.innerHTML = formatDate(response.data.dt * 1000);

  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);

  let city = document.querySelector(".currentCity");
  city.innerHTML = response.data.name;

  celsiusTemp = response.data.main.temp;
  let temp = Math.round(celsiusTemp);
  let tempNumber = document.querySelector(".tempValue");
  tempNumber.innerHTML = `${temp}`;
  tempUnit.innerHTML = `${unitCelsius}`;

  celsiusTempMin = response.data.main.temp_min;
  let tempMin = Math.round(celsiusTempMin);
  let tempMinShowed = document.querySelector(".tempTodayMin #min-value");
  tempMinShowed.innerHTML = `${tempMin}`;
  document.querySelector("#dayCurrent #min-value").innerHTML = `${tempMin}`;

  celsiusTempMax = response.data.main.temp_max;
  let tempMax = Math.round(celsiusTempMax);
  let tempMaxShowed = document.querySelector(".tempTodayMax #max-value");
  tempMaxShowed.innerHTML = `${tempMax}`;
  document.querySelector("#dayCurrent #max-value").innerHTML = `${tempMax}`;

  let humidity = Math.round(response.data.main.humidity);
  let humidityShown = document.querySelector(".humidity");
  humidityShown.innerHTML = `Humidity: ${humidity}%`;

  let wind = Math.round(3.6 * response.data.wind.speed);
  let windShown = document.querySelector(".wind");
  windShown.innerHTML = `Wind: ${wind} km/h`;

  let pressure = response.data.main.pressure;
  let pressureShown = document.querySelector(".pressure");
  pressureShown.innerHTML = `Pressure: ${pressure}`;

  let description = response.data.weather[0].description;
  document.querySelector(".today .description").innerHTML = description;
}

function search(city) {
  let apiKey = "a68381d4faf2a13b11b7dc8945964fc7";
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  console.log(apiUrl);
  axios.get(apiUrl).then(handleWeather);
}

// Show temperature and stats for city typed in search bar
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#inputCity").value;
  search(city);
}

let searchForm = document.querySelector("#search-bar");
searchForm.addEventListener("submit", handleSubmit);

// Add also 'search city' if clicked on search icon
function handleClickButton() {
  let city = document.querySelector("#inputCity").value;
  search(city);
}

// Show temperature for current location
function showLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "a68381d4faf2a13b11b7dc8945964fc7";
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

  //console.log(apiUrl);
  axios.get(apiUrl).then(handleWeather);
}

function handleLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showLocation);
}

let currentLocationButton = document.querySelector(".currentLoc");
currentLocationButton.addEventListener("click", handleLocation);

// Chose which unit for temperature to use
function handleClickCelsius(event) {
  event.preventDefault();
  fahrenheitClick.classList.remove("active");
  celsiusClick.classList.add("active");

  let temp = document.querySelector(".tempValue");
  temp.innerHTML = Math.round(celsiusTemp);
  document.querySelector(".tempTodayMin #min-value").innerHTML = `${Math.round(
    celsiusTempMin
  )}`;
  document.querySelector(".tempTodayMax #max-value").innerHTML = `${Math.round(
    celsiusTempMax
  )}`;
  document.querySelector(
    ".today .tempMinMax #min-value"
  ).innerHTML = `${Math.round(celsiusTempMin)}`;
  document.querySelector(
    ".today .tempMinMax #max-value"
  ).innerHTML = `${Math.round(celsiusTempMax)}`;
  tempUnit.innerHTML = `${unitCelsius}`;
}

function handleClickFahrenheit(event) {
  event.preventDefault();
  celsiusClick.classList.remove("active");
  fahrenheitClick.classList.add("active");

  let temp = document.querySelector(".tempValue");
  let tempFahrenheit = (celsiusTemp * 9) / 5 + 32;
  temp.innerHTML = `${Math.round(tempFahrenheit)}`;

  let tempFahrenheitMax = (celsiusTempMax * 9) / 5 + 32;
  let tempFahrenheitMin = (celsiusTempMin * 9) / 5 + 32;
  document.querySelector(".tempTodayMax #max-value").innerHTML = `${Math.round(
    tempFahrenheitMax
  )}`;
  document.querySelector(".tempTodayMin #min-value").innerHTML = `${Math.round(
    tempFahrenheitMin
  )}`;
  document.querySelector(
    ".today .tempMinMax #min-value"
  ).innerHTML = `${Math.round(tempFahrenheitMin)}`;
  document.querySelector(
    ".today .tempMinMax #max-value"
  ).innerHTML = `${Math.round(tempFahrenheitMax)}`;
  tempUnit.innerHTML = `${unitFahrenheit}`;
}

let tempUnit = document.querySelector("#units");
//let tempUnitAll = document.querySelectorAll("#units");
let unitCelsius = "ºC";
let unitFahrenheit = "ºF";
//tempUnitAll.forEach();
//let tempUnitsAll = document.querySelectorAll("#units");
//console.log(tempUnitsAll);
//console.log(tempUnitsAll.length);
//tempUnitsAll[2].innerHTML = `${unitFahrenheit}`;

let celsiusTemp = null;
let celsiusTempMin = null;
let celsiusTempMax = null;

let celsiusClick = document.querySelector(".tempCelsius");
celsiusClick.addEventListener("click", handleClickCelsius);

let fahrenheitClick = document.querySelector(".tempFahrenheit");
fahrenheitClick.addEventListener("click", handleClickFahrenheit);

//Standardly shown city
search("Leiden");
