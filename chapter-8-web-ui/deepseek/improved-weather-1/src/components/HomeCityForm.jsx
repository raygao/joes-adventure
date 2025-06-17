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
        body: JSON.stringify({ 
          homeCity: city, 
          homeLatitude: latitude, 
          homeLongitude: longitude 
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage('Home city updated successfully!');
        // Update local storage
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      } else {
        setMessage('Failed to update home city');
      }
    } catch (error) {
      setMessage('Error updating home city');
    }
  };

  return (
    <div className="home-city-form">
      <h2>Current Home City: {user?.homeCity || 'Not set'}</h2>
      {user?.homeCity && (
        <p>
          Coordinates: {user.homeLatitude}, {user.homeLongitude}
        </p>
      )}
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