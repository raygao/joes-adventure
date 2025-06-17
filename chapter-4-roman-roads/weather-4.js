const NOAA_API_URL = "https://api.weather.gov/gridpoints/MPX/116,72/forecast";

async function getWeatherForecast() {
    try {
        const response = await fetch(NOAA_API_URL, {
            headers: {
                "User-Agent": "YourAppName (your@email.com)"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        displayForecast(data.properties.periods);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function displayForecast(forecast) {
    console.log("Weather Forecast for This Week:");
    forecast.forEach(period => {
        console.log(`\n${period.name}:`);
        console.log(`Temperature: ${period.temperature}°${period.temperatureUnit}`);
        console.log(`Forecast: ${period.shortForecast}`);
    });
}

getWeatherForecast();