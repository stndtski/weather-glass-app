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
    const bg = document.getElementById("dynamic-bg");

    body.className = "";
    bg.innerHTML = "";

    if (code === 0) {
        body.classList.add("sunny");
        conditionText.innerText = "Sunny";
        iconDiv.innerText = "☀️";
        createEffects('sun');
    } else if (code >= 1 && code <= 3) {
        body.classList.add("cloudy");
        conditionText.innerText = "Cloudy";
        iconDiv.innerText = "☁️";
        createEffects('cloud');
    } else if (code >= 51 && code <= 67) {
        body.classList.add("rainy");
        conditionText.innerText = "Rainy";
        iconDiv.innerText = "🌧️";
        createEffects('rain');
    } else if (code >= 71 && code <= 86) {
        body.classList.add("snowy");
        conditionText.innerText = "Snowy";
        iconDiv.innerText = "❄️";
        createEffects('snow');
    } else if (code >= 95) {
        body.classList.add("storm");
        conditionText.innerText = "Thunderstorm";
        iconDiv.innerText = "⛈️";
        createEffects('rain');
        createEffects('storm');
    } else {
        body.classList.add("cloudy");
        conditionText.innerText = "Overcast";
        iconDiv.innerText = "🌥️";
        createEffects('cloud');
    }
}

function createEffects(type) {
    const bg = document.getElementById("dynamic-bg");

    if (type === 'rain') {
        for (let i = 0; i < 50; i++) {
            const drop = document.createElement('div');
            drop.classList.add('weather-element', 'rain-drop');
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = Math.random() * 0.5 + 0.5 + 's';
            drop.style.animationDelay = Math.random() * 2 + 's';
            bg.appendChild(drop);
        }
    } 
    else if (type === 'snow') {
        for (let i = 0; i < 30; i++) {
            const flake = document.createElement('div');
            flake.classList.add('weather-element', 'snowflake');
            flake.style.left = Math.random() * 100 + '%';
            flake.style.width = Math.random() * 5 + 2 + 'px';
            flake.style.height = flake.style.width;
            flake.style.opacity = Math.random();
            flake.style.animationDuration = Math.random() * 3 + 2 + 's';
            flake.style.animationDelay = Math.random() * 5 + 's';
            bg.appendChild(flake);
        }
    }
    else if (type === 'cloud') {
        for (let i = 0; i < 5; i++) {
            const cloud = document.createElement('div');
            cloud.classList.add('weather-element', 'cloud');
            const size = Math.random() * 100 + 100;
            cloud.style.width = size + 'px';
            cloud.style.height = size / 2 + 'px';
            cloud.style.top = Math.random() * 40 + '%';
            cloud.style.left = -200 + 'px';
            cloud.style.animationDuration = Math.random() * 10 + 10 + 's';
            cloud.style.animationDelay = Math.random() * 5 + 's';
            bg.appendChild(cloud);
        }
    }
    else if (type === 'sun') {
        const sun = document.createElement('div');
        sun.classList.add('weather-element', 'sun');
        bg.appendChild(sun);
    }
    else if (type === 'storm') {
        const flash = document.createElement('div');
        flash.classList.add('flash');
        bg.appendChild(flash);
    }
}

document.getElementById("cityInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});
