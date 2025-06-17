const NOAA_BASE_URL = "https://api.weather.gov/points/";
const HEADERS = {
  "User-Agent": "WeatherApp (your@email.com)"
};

export async function fetchWeather(latitude, longitude, days) {
  try {
    const response = await fetch(`${NOAA_BASE_URL}${latitude},${longitude}`, { 
      headers: HEADERS 
    });
    
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const locationData = await response.json();
    const forecastUrl = locationData.properties.forecast;

    const forecastResponse = await fetch(forecastUrl, { headers: HEADERS });
    if (!forecastResponse.ok) throw new Error(`HTTP error! Status: ${forecastResponse.status}`);

    const forecastData = await forecastResponse.json();
    return forecastData.properties.periods.slice(0, days);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    throw error;
  }
}