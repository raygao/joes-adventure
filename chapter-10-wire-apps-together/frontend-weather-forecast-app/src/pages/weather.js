import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import WeatherDisplay from '@components/WeatherDisplay';
import HistoryList from '@components/HistoryList';
import HomeCityForm from '@components/HomeCityForm';

const NOAA_BASE_URL = "https://api.weather.gov/points/";

const initializeFormData = (user) => {
  const hasValidHomeCity = user?.homeCity && 
                         !isNaN(user.homeLatitude) && 
                         !isNaN(user.homeLongitude);

  return {
    city: hasValidHomeCity ? user.homeCity : '',
    latitude: hasValidHomeCity ? user.homeLatitude : '',
    longitude: hasValidHomeCity ? user.homeLongitude : '',
    days: '3'
  };
};

export default function WeatherPage() {
  const [user, setUser] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    city: '',
    latitude: '',
    longitude: '',
    days: '3'
  });
  const router = useRouter();

  const handleHomeCityUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setFormData(initializeFormData(updatedUser));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const localUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        
        if (localUser?.username) {
          setUser(localUser);
          setFormData(initializeFormData(localUser));

          try {
            const userRes = await fetch(`/api/user?username=${localUser.username}`, {
              headers: {
                'x-auth-user': JSON.stringify(localUser)
              }
            });

            if (userRes.ok) {
              const userData = await userRes.json();
              if (userData.username) {
                   // Preserve existing token while updating user data
    const updatedUser = { 
      ...userData, 
      token: localUser.token  // Keep original token
    };
                setUser(userData);
                setFormData(initializeFormData(userData));
                localStorage.setItem('currentUser', JSON.stringify(userData));
              }
            } else {
              console.warn('User API response:', await userRes.text());
            }
          } catch (apiError) {
            console.error('User API fetch failed:', apiError);
          }
        }

        // Add authentication to history request
        try {
          const historyRes = await fetch('/api/history', {
            headers: {
              'x-auth-user': JSON.stringify(localUser)
            }
          });
          if (historyRes.ok) {
            const historyData = await historyRes.json();
            setHistory(historyData);
          }   else {
            console.error('History load failed:', historyRes.status);
          }
        } catch (historyError) {
          console.error('History load failed:', historyError);
        }

      } catch (err) {
        console.error('Data loading error:', err);
        setError('Failed to load data. Please try again.');
        localStorage.removeItem('currentUser');
        window.dispatchEvent(new Event('auth-change'));
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
  
      const forecastRes = await fetch(forecastUrl, {
        headers: { 'User-Agent': 'WeatherApp (your@email.com)' }
      });
      
      if (!forecastRes.ok) {
        throw new Error(`Forecast fetch failed: ${forecastRes.status}`);
      }
  
      const forecastData = await forecastRes.json();
      const periods = forecastData.properties?.periods || [];
      const slicedForecast = periods.slice(0, parseInt(days, 10) || 3);
  
      setForecast(slicedForecast);
      
      // Optimistically update UI
      const newHistoryItem = {
        city,
        latitude: lat,
        longitude: lng,
        days,
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [newHistoryItem, ...prev]);
  
      // Save to database via API
      try {
        await fetch('/api/weather', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-auth-user': JSON.stringify(user)  // Add user context
          },
          body: JSON.stringify({ 
            latitude: lat, 
            longitude: lng, 
            days, 
            city 
          })
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
      <button onClick={() => router.push('/')} className="back-button">
        ← Back to Home
      </button>
      
      <HomeCityForm 
        user={user} 
        onUpdate={handleHomeCityUpdate}
      />
      
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