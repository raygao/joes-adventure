import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking localStorage
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('currentUser');
    // Redirect to home page
    router.push('/');
  };

  return (
    <nav style={{
      background: '#3498db',
      padding: '15px 20px',
      marginBottom: '20px',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
        Weather App
      </Link>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {isLoggedIn ? (
          <>
            <span style={{ color: 'white' }}>
              Hello, {JSON.parse(localStorage.getItem('currentUser'))?.username}
            </span>
            <button 
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: 'inherit'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Login
            </Link>
            <Link href="/register" style={{ color: 'white', textDecoration: 'none' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}