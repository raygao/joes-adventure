const readline = require("readline");

const NOAA_BASE_URL = "https://api.weather.gov/points/";
const HEADERS = {
    "User-Agent": "WeatherApp (your@email.com)"
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to get user input
function getUserInput(question) {
    return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

// Function to fetch weather data
async function fetchWeather(latitude, longitude, days) {
    try {
        // Get the gridpoint for the location
        const response = await fetch(`${NOAA_BASE_URL}${latitude},${longitude}`, { headers: HEADERS });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const locationData = await response.json();
        const forecastUrl = locationData.properties.forecast;

        // Fetch the forecast
        const forecastResponse = await fetch(forecastUrl, { headers: HEADERS });
        if (!forecastResponse.ok) throw new Error(`HTTP error! Status: ${forecastResponse.status}`);

        const forecastData = await forecastResponse.json();
        return forecastData.properties.periods.slice(0, days); // Get desired length of forecast
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Function to display weather
function displayWeather(name, forecast) {
    console.log(`\nHello, ${name}! Here is your weather forecast:\n`);
    forecast.forEach(period => {
        console.log(`${period.name}:`);
        console.log(`Temperature: ${period.temperature}°${period.temperatureUnit}`);
        console.log(`Forecast: ${period.shortForecast}\n`);
    });
}

// Main function to run the application
async function main() {
    const name = await getUserInput("Enter your name: ");
    const latitude = await getUserInput("Enter your latitude: ");
    const longitude = await getUserInput("Enter your longitude: ");
    const days = parseInt(await getUserInput("How many days of forecast do you want? "), 10);

    const forecast = await fetchWeather(latitude, longitude, days);
    if (forecast) displayWeather(name, forecast);

    rl.close();
}

main();