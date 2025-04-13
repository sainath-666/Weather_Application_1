// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Event listener for the get weather button
    document.getElementById('getWeather').addEventListener('click', fetchWeather);
    
    // Event listener for the Enter key in the input field
    document.getElementById('cityInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchWeather();
        }
    });
    
    // Try to get user's location on page load for initial weather
    getCurrentLocationWeather();
});

// Function to get weather based on user's current location
function getCurrentLocationWeather() {
    const apiKey = '19eb8295ddabbe7aec1dcfb11a8f6daa';
    
    if (navigator.geolocation) {
        document.getElementById('loadingMessage').classList.remove('hidden');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
                fetchWeatherData(url);
            },
            (error) => {
                console.error('Error getting location:', error);
                document.getElementById('loadingMessage').classList.add('hidden');
            }
        );
    }
}

// Function to fetch weather data based on user input
async function fetchWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = '19eb8295ddabbe7aec1dcfb11a8f6daa';
    let url = '';

    // Check if the city input is empty (fetch location-based weather)
    if (city.trim() === '') {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
                    fetchWeatherData(url);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    document.getElementById('errorMessage').textContent = 'Please enter a city name';
                    document.getElementById('errorMessage').classList.remove('hidden');
                }
            );
        } else {
            document.getElementById('errorMessage').textContent = 'Geolocation not supported. Please enter a city name.';
            document.getElementById('errorMessage').classList.remove('hidden');
        }
    } else {
        // Fetch weather by city
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        fetchWeatherData(url);
    }
}

// Function to fetch and display weather data
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

            // Format temperature with one decimal place
            const temperature = Math.round(data.main.temp * 10) / 10;
            
            // Display the weather data
            document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
            document.getElementById('temperature').textContent = `${temperature}°C`;
            document.getElementById('description').textContent = `${data.weather[0].description}`;
            document.querySelector('#humidity span').textContent = `Humidity: ${data.main.humidity}%`;
            document.querySelector('#windSpeed span').textContent = `Wind: ${data.wind.speed} m/s`;

            // Display the weather icon
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
            document.getElementById('weatherIcon').src = iconUrl;
            
            // Clear the input field after successful search
            document.getElementById('cityInput').value = '';
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('loadingMessage').classList.add('hidden');
        document.getElementById('errorMessage').classList.remove('hidden');
        document.getElementById('weatherResult').classList.add('hidden');
    }
}
