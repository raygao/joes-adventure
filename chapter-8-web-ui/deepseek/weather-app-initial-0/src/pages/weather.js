import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import WeatherDisplay from '@/components/WeatherDisplay';
import HistoryList from '@/components/HistoryList';
import HomeCityForm from '@/components/HomeCityForm';

export default function WeatherPage() {
  const [forecast, setForecast] = useState(null);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch('/api/user');
        const userData = await userRes.json();
        setUser(userData);
        
        const historyRes = await fetch('/api/history');
        const historyData = await historyRes.json();
        setHistory(historyData);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const fetchWeather = async (latitude, longitude, days, city) => {
    setLoading(true);
    try {
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude, days, city }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setForecast(data.forecast);
        setHistory(prev => [data.logEntry, ...prev]);
      } else {
        setError('Failed to fetch weather');
      }
    } catch (err) {
      setError('Weather fetch failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <div className="container">
      <h1>Weather Forecast</h1>
      <button onClick={() => router.push('/')} style={{ marginBottom: '20px' }}>
        Back to Home
      </button>
      
      <HomeCityForm user={user} />
      
      <div className="weather-section">
        <div className="weather-input">
          <h2>Get Forecast</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            fetchWeather(
              form.latitude.value,
              form.longitude.value,
              form.days.value,
              form.city.value
            );
          }}>
            <input name="city" placeholder="City name" required />
            <input name="latitude" placeholder="Latitude" type="number" step="0.0001" required />
            <input name="longitude" placeholder="Longitude" type="number" step="0.0001" required />
            <select name="days" defaultValue="3">
              <option value="1">1 day</option>
              <option value="3">3 days</option>
              <option value="7">7 days</option>
            </select>
            <button type="submit">Get Forecast</button>
          </form>
        </div>
        
        {forecast && <WeatherDisplay forecast={forecast} />}
      </div>
      
      <HistoryList history={history} onSelect={fetchWeather} />
    </div>
  );
}