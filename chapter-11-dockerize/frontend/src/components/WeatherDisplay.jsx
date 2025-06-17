import React, { useState } from "react";
import { getConfig } from '@util/config';
const BACKEND_URL = getConfig('NEXT_PUBLIC_BACKEND_URL');

const getWeatherIcon = (forecast) => {
  const forecastLower = forecast.toLowerCase();

  if (forecastLower.includes("sunny") || forecastLower.includes("clear")) return "☀️";
  if (forecastLower.includes("rain")) return "🌧️";
  if (forecastLower.includes("cloud")) return "☁️";
  if (forecastLower.includes("snow")) return "❄️";
  if (forecastLower.includes("thunder") || forecastLower.includes("storm")) return "⛈️";
  if (forecastLower.includes("fog") || forecastLower.includes("haze")) return "🌫️";
  if (forecastLower.includes("wind")) return "🌬️";
  return "🌈"; // Default icon
};

export default function WeatherDisplay({ forecast, city }) {
  const [recommendation, setRecommendation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!forecast || forecast.length === 0) {
    return <p>No forecast data available.</p>;
  }

  const handleRecommendationClick = async () => {
    const shortForecast = forecast[0].shortForecast;
    setLoading(true);
    setError(null);
    setRecommendation([]);

    try {
      // must have NEXT_PUBLIC_ prefix to expose env variable in Next.js, 
      // see https://nextjs.org/docs/pages/guides/environment-variables#bundling-environment-variables-for-the-browser
      const apiUrl = BACKEND_URL || "http://backend.local:3500";

      const response = await fetch(`${apiUrl}/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, weather: shortForecast }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      console.log("Server response:", data);

      const recs = data.recommendations?.recommendations;
      if (!recs || !Array.isArray(recs)) {
        setError("No travel recommendations available.");
      } else {
        setRecommendation(recs);
      }
    } catch (err) {
      setError("Failed to fetch travel recommendation.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forecast-results">
      <h2 className="forecast-location">
        {getWeatherIcon(forecast[0].shortForecast)} Weather Forecast for {city}
      </h2>

      <button onClick={handleRecommendationClick} style={{ marginBottom: "1em" }}>
        Get Travel Recommendation
      </button>

      {loading && <p>Loading recommendation...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {recommendation.length > 0 && (
        <div
          className="travel-recommendation"
          style={{
            backgroundColor: "#e6ffe6",
            border: "1px solid #a3d9a5",
            padding: "1.5em",
            marginBottom: "1.5em",
            borderRadius: "8px",
            maxHeight: "600px",
            overflowY: "auto",
          }}
        >
          <h3>Travel Recommendations for {city}</h3>
          {recommendation.map((rec, index) => (
            <div key={index}>
              <p><strong>{rec.time} - {rec.type}</strong></p>
              <ul>
                {rec.activities.map((activity, i) => (
                  <li key={i}>{activity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="forecast-items">
        {forecast.map((period) => (
          <div key={period.number} className="forecast-item">
            <h3>
              {getWeatherIcon(period.shortForecast)} {period.name}
            </h3>
            <p>Temperature: {period.temperature}°{period.temperatureUnit}</p>
            <p>Forecast: {period.shortForecast}</p>
            {period.detailedForecast && (
              <p className="detailed-forecast">{period.detailedForecast}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
