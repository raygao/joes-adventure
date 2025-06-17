import { useState, useEffect } from 'react';

export default function WeatherForecast({ user }) {
    const [city, setCity] = useState(user.homeCity || '');
    const [latitude, setLatitude] = useState(user.homeLatitude || '');
    const [longitude, setLongitude] = useState(user.homeLongitude || '');
    const [days, setDays] = useState(3);
    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState('');
    const [historyOptions, setHistoryOptions] = useState([]);

    useEffect(() => {
        if (user) {
            fetch(`/api/history?username=${user.username}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.history) {
                        setHistoryOptions(data.history);
                    }
                })
                .catch((err) => console.error(err));
        }
    }, [user]);

    const selectFromHistory = (event) => {
        const selectedIndex = event.target.value;
        if (selectedIndex === '') return;
        const selectedRequest = historyOptions[selectedIndex];
        setCity(selectedRequest.city);
        setLatitude(selectedRequest.latitude);
        setLongitude(selectedRequest.longitude);
        setDays(selectedRequest.days);
    };

    const useHomeCity = () => {
        if (user.homeCity) {
            setCity(user.homeCity);
            setLatitude(user.homeLatitude);
            setLongitude(user.homeLongitude);
        }
    };

    const fetchForecast = async () => {
        if (!latitude || !longitude) {
            setError("Latitude and Longitude are required.");
            return;
        }
        setError("");
        const res = await fetch(
            `/api/weather?latitude=${latitude}&longitude=${longitude}&days=${days}`
        );
        const data = await res.json();
        if (res.ok) {
            setForecast(data.forecast);
            // Log the successful request
            await fetch("/api/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.username, city, latitude, longitude, days }),
            });
        } else {
            setError(data.error);
        }
    };

    return (
        <div>
            <h2>Get Weather Forecast</h2>
            {user.homeCity && (
                <div>
                    <button 
                        onClick={useHomeCity}
                        style={{ backgroundColor: 'blue', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Use Home City ({user.homeCity})
                    </button>
                </div>
            )}
            <div>
                <label>
                    City:
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Latitude:
                    <input
                        type="text"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Longitude:
                    <input
                        type="text"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Days:
                    <input
                        type="number"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        min="1"
                        max="7"
                    />
                </label>
            </div>
            {historyOptions.length > 0 && (
                <div>
                    <label>
                        Select previous request:
                        <select onChange={selectFromHistory}>
                            <option value="">--Select--</option>
                            {historyOptions.map((req, idx) => (
                                <option key={idx} value={idx}>
                                    {req.city} (Lat: {req.latitude}, Lon: {req.longitude}, Days: {req.days}, Date: {req.timestamp})
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            )}
            <button onClick={fetchForecast} 
                style={{
                    backgroundColor: 'brown',
                    color: 'white',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>Fetch Forecast</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {forecast && (
                <div>
                    <h3>Forecast:</h3>
                    {forecast.map((period, idx) => (
                        <div key={idx}>
                            <strong>{period.name}:</strong> {period.temperature}°{period.temperatureUnit} - {period.shortForecast}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}