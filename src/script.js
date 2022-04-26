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

function formatDate(date) {
  let currentDate = new Date();
  let day = currentDate.getDay();
  let hour = currentDate.getHours();
  let minutes = ("0" + currentDate.getMinutes()).slice(-2);

  date.innerHTML = `${days[day]}, ${hour}:${minutes}`;
}

let date = document.querySelector(".date");
formatDate(date);

//change hours in today's forecast
function addHours(h) {
  let currentDate = new Date();
  let hour = currentDate.getHours();
  let time = hour + h;
  if (time >= 24) {
    return time - 24;
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

//Change city and temperature to city put in search bar
function handleWeather(response) {
  let city = document.querySelector(".currentCity");
  city.innerHTML = response.data.name;

  let temp = Math.round(response.data.main.temp);
  let tempNumber = document.querySelector(".tempValue");
  tempNumber.innerHTML = `${temp}`;

  let tempMin = Math.round(response.data.main.temp_min);
  let tempMinShowed = document.querySelector(".tempTodayMin");
  tempMinShowed.innerHTML = `Min: ${tempMin}ºC`;

  let tempMax = Math.round(response.data.main.temp_max);
  let tempMaxShowed = document.querySelector(".tempTodayMax");
  tempMaxShowed.innerHTML = `Max: ${tempMax}ºC`;

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

  //console.log(apiUrl);
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

//Standardly shown city
search("Amsterdam");

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
  let temp = document.querySelector(".tempValue");
  let tempUnit = document.querySelector(".units");
  temp.innerHTML = "19";
  tempUnit.innerHTML = "ºC";
}

function handleClickFahrenheit(event) {
  event.preventDefault();
  let temp = document.querySelector(".tempValue");
  let tempUnit = document.querySelector(".units");
  temp.innerHTML = "66";
  tempUnit.innerHTML = "ºF";
}

let celsiusClick = document.querySelector(".tempCelsius");
celsiusClick.addEventListener("click", handleClickCelsius);

let fahrenheitClick = document.querySelector(".tempFahrenheit");
fahrenheitClick.addEventListener("click", handleClickFahrenheit);
