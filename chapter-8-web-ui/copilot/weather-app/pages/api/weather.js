import fetch from 'node-fetch';

const NOAA_BASE_URL = "https://api.weather.gov/points/";
const HEADERS = {
    "User-Agent": "WeatherApp (your@email.com)"
};

export default async function handler(req, res) {
    const { latitude, longitude, days } = req.query;
    try {
        const response = await fetch(`${NOAA_BASE_URL}${latitude},${longitude}`, { headers: HEADERS });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const locationData = await response.json();
        const forecastUrl = locationData.properties.forecast;
        const forecastResponse = await fetch(forecastUrl, { headers: HEADERS });
        if (!forecastResponse.ok) throw new Error(`HTTP error! Status: ${forecastResponse.status}`);
        const forecastData = await forecastResponse.json();
        const forecast = forecastData.properties.periods.slice(0, days);
        res.status(200).json({ forecast });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}