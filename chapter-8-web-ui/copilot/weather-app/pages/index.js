import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import WeatherForecast from '../components/WeatherForecast';

export default function Home() {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('login'); // 'home', 'login', or 'register'

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Weather App</h1>
            {!user && (
                <>
                    <div>
                        <button
                            onClick={() => setView('login')}
                            style={{
                                backgroundColor: 'blue',
                                color: 'white',
                                padding: '8px 12px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '8px'
                            }}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => setView('register')}
                            style={{
                                backgroundColor: 'purple',
                                color: 'white',
                                padding: '8px 12px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '8px'
                            }}
                        >
                            Register
                        </button>
                    </div>

                    {view === 'home' && (
                        <div style={{ marginTop: '1rem' }}>
                            <p>Welcome to the Home Page. Please choose an option above.</p>
                        </div>
                    )}

                    {view === 'login' && (
                        <LoginForm onLogin={(userData) => { setUser(userData); setView('weather'); }} />
                    )}
                    {view === 'register' && (
                        <RegisterForm onRegister={(userData) => { setUser(userData); setView('weather'); }} />
                    )}
                </>
            )}
            {user && <WeatherForecast user={user} />}
        </div>
    );
}