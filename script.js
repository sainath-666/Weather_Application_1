document.getElementById('getWeather').addEventListener('click', fetchWeather);

async function fetchWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = '19eb8295ddabbe7aec1dcfb11a8f6daa';  // Your API key
    let url = '';

    // Check if the city input is empty (fetch location-based weather)
    if (city.trim() === '') {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
                fetchWeatherData(url);
            });
        } else {
            document.getElementById('errorMessage').textContent = 'Geolocation not supported';
            document.getElementById('errorMessage').classList.remove('hidden');
        }
    } else {
        // Fetch weather by city
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        fetchWeatherData(url);
    }
}

async function fetchWeatherData(url) {
    // Show loading message
    document.getElementById('loadingMessage').classList.remove('hidden');
    document.getElementById('errorMessage').classList.add('hidden');
    document.getElementById('weatherResult').classList.add('hidden');

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Hide loading message
        document.getElementById('loadingMessage').classList.add('hidden');

        if (data.cod === '404') {
            document.getElementById('errorMessage').classList.remove('hidden');
            document.getElementById('weatherResult').classList.add('hidden');
        } else {
            document.getElementById('errorMessage').classList.add('hidden');
            document.getElementById('weatherResult').classList.remove('hidden');

            // Display the weather data
            document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
            document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
            document.getElementById('description').textContent = `Condition: ${data.weather[0].description}`;
            document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
            document.getElementById('windSpeed').textContent = `Wind Speed: ${data.wind.speed} m/s`;

            // Display the weather icon
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            document.getElementById('weatherIcon').src = iconUrl;
        }
    } catch (error) {
        document.getElementById('loadingMessage').classList.add('hidden');
        document.getElementById('errorMessage').classList.remove('hidden');
        document.getElementById('weatherResult').classList.add('hidden');
    }
}
