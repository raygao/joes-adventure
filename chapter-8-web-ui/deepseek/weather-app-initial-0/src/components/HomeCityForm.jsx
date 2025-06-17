import { useState } from 'react';

export default function HomeCityForm({ user }) {
  const [city, setCity] = useState(user?.homeCity || '');
  const [latitude, setLatitude] = useState(user?.homeLatitude || '');
  const [longitude, setLongitude] = useState(user?.homeLongitude || '');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeCity: city, homeLatitude: latitude, homeLongitude: longitude }),
      });
      
      if (response.ok) {
        setMessage('Home city updated successfully!');
      } else {
        setMessage('Failed to update home city');
      }
    } catch (err) {
      setMessage('Error updating home city');
    }
  };

  return (
    <div className="home-city-form">
      <h2>Set Home City</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="City name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.0001"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.0001"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />
        <button type="submit">Save Home City</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}