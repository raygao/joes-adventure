import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import WeatherDisplay from '@components/WeatherDisplay';
import HistoryList from '@components/HistoryList';
import HomeCityForm from '@components/HomeCityForm';

const NOAA_BASE_URL = "https://api.weather.gov/points/";

const initializeFormData = (user) => {
  // Only pre-populate if all home city fields exist
  const hasHomeCity = user?.homeCity && user?.homeLatitude && user?.homeLongitude;
  return {
    city: hasHomeCity ? user.homeCity : '',
    latitude: hasHomeCity ? user.homeLatitude : '',
    longitude: hasHomeCity ? user.homeLongitude : '',
    days: '3'
  };
};

export default function WeatherPage() {
  const [forecast, setForecast] = useState(null);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    city: '',
    latitude: '',
    longitude: '',
    days: '3'
  });
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
  
        // Try to load from localStorage first
        const localUser = JSON.parse(localStorage.getItem('currentUser'));
        if (localUser) {
          setUser(localUser);
          setFormData(initializeFormData(localUser));
        }
  
        // Then fetch from API
        const userRes = await fetch('/api/user');
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
          setFormData(initializeFormData(userData));
          localStorage.setItem('currentUser', JSON.stringify(userData));
        } else {
          console.error('Failed to fetch user:', await userRes.text());
        }
  
        // Load history separately
        const historyRes = await fetch('/api/history');
        if (historyRes.ok) {
          setHistory(await historyRes.json());
        }
      } catch (err) {
        console.error('Data loading error:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    console.log('Loading user data...');
    loadData();
  }, []);

  const fetchWeather = async (lat, lng, days, city) => {
    if (!lat || !lng) {
      setError('Please provide valid coordinates');
      return;
    }
  
    setLoading(true);
    setError('');
    setForecast(null);
  
    try {
      // First get the forecast endpoint
      const pointsRes = await fetch(`${NOAA_BASE_URL}${lat},${lng}`, {
        headers: { 'User-Agent': 'WeatherApp (your@email.com)' }
      });
      
      if (!pointsRes.ok) {
        throw new Error(`Location lookup failed: ${pointsRes.status}`);
      }
  
      const locationData = await pointsRes.json();
      const forecastUrl = locationData.properties?.forecast;
      
      if (!forecastUrl) {
        throw new Error('No forecast URL found');
      }
  
      // Then get the actual forecast
      const forecastRes = await fetch(forecastUrl, {
        headers: { 'User-Agent': 'WeatherApp (your@email.com)' }
      });
      
      if (!forecastRes.ok) {
        throw new Error(`Forecast fetch failed: ${forecastRes.status}`);
      }
  
      const forecastData = await forecastRes.json();
      const periods = forecastData.properties?.periods || [];
      const slicedForecast = periods.slice(0, parseInt(days, 10) || 3); // Fixed this line
  
      // Update state
      setForecast(slicedForecast);
      setHistory(prev => [{
        city,
        latitude: lat,
        longitude: lng,
        days,
        timestamp: new Date().toISOString()
      }, ...prev]);
  
      // Log the request
      try {
        await fetch('/api/weather', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitude: lat, longitude: lng, days, city })
        });
      } catch (logError) {
        console.error('Failed to log request:', logError);
      }
  
    } catch (err) {
      setError(err.message.includes('404') 
        ? 'Location not found. Please check coordinates.'
        : `Error: ${err.message}`);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(
      formData.latitude,
      formData.longitude,
      formData.days,
      formData.city
    );
  };

  const handleHistorySelect = (item) => {
    setFormData({
      city: item.city || '',
      latitude: item.latitude?.toString() || '',
      longitude: item.longitude?.toString() || '',
      days: item.days?.toString() || '3'
    });
    fetchWeather(
      Number(item.latitude),
      Number(item.longitude),
      Number(item.days) || 3,
      item.city || ''
    );
  };

  if (loading) return <div className="container">Loading weather data...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <div className="container">
      <h1>Weather Forecast</h1>
      <button onClick={() => router.push('/')} className="back-button">
        ← Back to Home
      </button>
      
      <HomeCityForm user={user} />
      
      <div className="weather-section">
        <form onSubmit={handleSubmit} className="weather-form">
          <div className="form-group">
            <label>City Name</label>
            <input
              name="city"
              value={formData.city}
              onChange={(e) => setFormData(p => ({...p, city: e.target.value}))}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Latitude</label>
              <input
                name="latitude"
                type="number"
                step="0.0001"
                value={formData.latitude}
                onChange={(e) => setFormData(p => ({...p, latitude: e.target.value}))}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Longitude</label>
              <input
                name="longitude"
                type="number"
                step="0.0001"
                value={formData.longitude}
                onChange={(e) => setFormData(p => ({...p, longitude: e.target.value}))}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Forecast Days</label>
            <select
              name="days"
              value={formData.days}
              onChange={(e) => setFormData(p => ({...p, days: e.target.value}))}
            >
              {[1, 3, 7].map(d => (
                <option key={d} value={d}>{d} day{d > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Fetching...' : 'Get Forecast'}
          </button>
        </form>
        
        {error && <div className="error-message">{error}</div>}
        {forecast && (
          <WeatherDisplay 
            forecast={forecast} 
            city={formData.city}  
          />)}
      </div>
      
      <HistoryList history={history} onSelect={handleHistorySelect} />
    </div>
  );
}