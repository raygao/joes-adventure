import { useState } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '@components/AuthForm';

export default function Register() {
  const router = useRouter();
  const [homeCity, setHomeCity] = useState('');
  const [homeLatitude, setHomeLatitude] = useState('');
  const [homeLongitude, setHomeLongitude] = useState('');

  const handleRegister = async (username, password) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username, 
        password,
        homeCity,
        homeLatitude,
        homeLongitude 
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      // Store user data including home city
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      router.push('/weather');
    } else {
      const error = await response.json();
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <AuthForm onSubmit={handleRegister} isLogin={false} />
      
      <div style={{ marginTop: '20px' }}>
        <h3>Set Home City (Optional)</h3>
        <input
          type="text"
          placeholder="City name"
          value={homeCity}
          onChange={(e) => setHomeCity(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <input
          type="number"
          step="0.0001"
          placeholder="Latitude"
          value={homeLatitude}
          onChange={(e) => setHomeLatitude(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <input
          type="number"
          step="0.0001"
          placeholder="Longitude"
          value={homeLongitude}
          onChange={(e) => setHomeLongitude(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
      </div>
    </div>
  );
}