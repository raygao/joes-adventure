// Add this utility function at the top of the file
const getWeatherIcon = (forecast) => {
  const forecastLower = forecast.toLowerCase();
  
  if (forecastLower.includes('sunny') || forecastLower.includes('clear')) return '☀️';
  if (forecastLower.includes('rain')) return '🌧️';
  if (forecastLower.includes('cloud')) return '☁️';
  if (forecastLower.includes('snow')) return '❄️';
  if (forecastLower.includes('thunder') || forecastLower.includes('storm')) return '⛈️';
  if (forecastLower.includes('fog') || forecastLower.includes('haze')) return '🌫️';
  if (forecastLower.includes('wind')) return '🌬️';
  return '🌈'; // Default icon
};

export default function WeatherDisplay({ forecast, city }) {
  if (!forecast || forecast.length === 0) {
    return <p>No forecast data available.</p>;
  }

  return (
    <div className="forecast-results">
      <h2 className="forecast-location">
        {getWeatherIcon(forecast[0].shortForecast)} Weather Forecast for {city}
      </h2>
      
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