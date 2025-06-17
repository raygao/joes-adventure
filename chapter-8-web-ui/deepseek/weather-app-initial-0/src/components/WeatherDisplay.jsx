export default function WeatherDisplay({ forecast }) {
    if (!forecast || forecast.length === 0) {
      return <p>No forecast data available.</p>;
    }
  
    return (
      <div className="forecast">
        <h2>Forecast</h2>
        <div className="forecast-items">
          {forecast.map((period) => (
            <div key={period.number} className="forecast-item">
              <h3>{period.name}</h3>
              <p>Temperature: {period.temperature}°{period.temperatureUnit}</p>
              <p>Forecast: {period.shortForecast}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }