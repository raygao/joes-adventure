import { useState } from 'react';

export default function RegisterForm({ onRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [homeCity, setHomeCity] = useState('');
    const [homeLatitude, setHomeLatitude] = useState('');
    const [homeLongitude, setHomeLongitude] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'register', username, password, homeCity, homeLatitude, homeLongitude })
        });
        const data = await res.json();
        if (res.ok) {
            onRegister(data);
        } else {
            setError(data.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </label>
            <br />
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <br />
            <label>
                Home City (optional):
                <input type="text" value={homeCity} onChange={(e) => setHomeCity(e.target.value)} />
            </label>
            <br />
            <label>
                Home Latitude:
                <input type="text" value={homeLatitude} onChange={(e) => setHomeLatitude(e.target.value)} />
            </label>
            <br />
            <label>
                Home Longitude:
                <input type="text" value={homeLongitude} onChange={(e) => setHomeLongitude(e.target.value)} />
            </label>
            <br />
            <button type="submit" style={{
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>Register</button>
        </form>
    );
}