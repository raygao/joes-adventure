import { useState } from 'react';

export default function HomeCityForm({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    city: user?.homeCity || '',
    latitude: user?.homeLatitude?.toString() || '',
    longitude: user?.homeLongitude?.toString() || ''
  });

  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate user exists
    if (!user || !user.username) {
      setMessage('User not authenticated');
      return;
    }
    
    // Validate coordinates
    if (isNaN(parseFloat(formData.latitude))) {
      setMessage('Invalid latitude value');
      return;
    }
    
    if (isNaN(parseFloat(formData.longitude))) {
      setMessage('Invalid longitude value');
      return;
    }

    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-auth-user': JSON.stringify(user)
      };

      const response = await fetch(`/api/user?username=${user.username}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ 
          homeCity: formData.city,
          homeLatitude: parseFloat(formData.latitude),
          homeLongitude: parseFloat(formData.longitude)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      const updatedUserData = await response.json();
      
      const updatedUser = {
        ...user,
        ...updatedUserData,
        token: user.token
      };

      onUpdate(updatedUser);
      setMessage('Home city updated successfully!');
      
    } catch (error) {
      setMessage(error.message || 'Error updating home city');
      console.error('Update error:', error);
    }
  };

  return (
    <div className="home-city-form">
      <div className="Welcome"><h1>Welcome {user?.username || 'Not set'},</h1></div>
      <h3>Your Home City is: {user?.homeCity || 'Not set'}</h3>
      {user?.homeCity && (
        <p>
          Coordinates: {user.homeLatitude}, {user.homeLongitude}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="City name"
          value={formData.city}
          onChange={e => setFormData({...formData, city: e.target.value})}
          required
        />
        <input
          type="number"
          step="0.0001"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={e => setFormData({...formData, latitude: e.target.value})}
          required
        />
        <input
          type="number"
          step="0.0001"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={e => setFormData({...formData, longitude: e.target.value})}
          required
        />
        <button type="submit">Update Home City</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}