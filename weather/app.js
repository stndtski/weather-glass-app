const GEO_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

async function getWeather() {
    const cityInput = document.getElementById("cityInput");
    const city = cityInput.value.trim();
    
    const resultDiv = document.getElementById("result");
    const loader = document.getElementById("loader");
    const errorDiv = document.getElementById("error");

    if (!city) return alert("Please enter a city name");

    resultDiv.classList.add("hidden");
    errorDiv.classList.add("hidden");
    loader.classList.remove("hidden");

    try {
        const geoResponse = await fetch(`${GEO_API_URL}?name=${city}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();

        if (!geoData.results) {
            throw new Error("City not found");
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        const weatherResponse = await fetch(
            `${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
        );
        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        document.getElementById("cityName").innerText = `${name}, ${country}`;
        document.getElementById("temperature").innerText = `${Math.round(current.temperature_2m)}°`;
        document.getElementById("wind").innerText = `${current.wind_speed_10m} km/h`;
        document.getElementById("humidity").innerText = `${current.relative_humidity_2m}%`;

        updateWeatherVisuals(current.weather_code);

        loader.classList.add("hidden");
        resultDiv.classList.remove("hidden");

    } catch (error) {
        console.error(error);
        loader.classList.add("hidden");
        errorDiv.innerText = error.message === "City not found" ? "City not found" : "Something went wrong";
        errorDiv.classList.remove("hidden");
    }
}

function updateWeatherVisuals(code) {
    const body = document.body;
    const conditionText = document.getElementById("condition");
    const iconDiv = document.getElementById("weatherIcon");

    body.className = "";

    if (code === 0) {
        body.classList.add("sunny");
        conditionText.innerText = "Sunny";
        iconDiv.innerText = "☀️";
    } else if (code >= 1 && code <= 3) {
        body.classList.add("cloudy");
        conditionText.innerText = "Cloudy";
        iconDiv.innerText = "☁️";
    } else if (code >= 51 && code <= 67) {
        body.classList.add("rainy");
        conditionText.innerText = "Rainy";
        iconDiv.innerText = "🌧️";
    } else if (code >= 71 && code <= 86) {
        body.classList.add("snowy");
        conditionText.innerText = "Snowy";
        iconDiv.innerText = "❄️";
    } else if (code >= 95) {
        body.classList.add("rainy");
        conditionText.innerText = "Thunderstorm";
        iconDiv.innerText = "⛈️";
    } else {
        body.classList.add("cloudy");
        conditionText.innerText = "Overcast";
        iconDiv.innerText = "🌥️";
    }
}

document.getElementById("cityInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});