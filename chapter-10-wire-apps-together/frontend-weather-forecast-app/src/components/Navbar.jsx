import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized auth check function
  const checkAuthStatus = useCallback(() => {
    const user = localStorage.getItem('currentUser');
    setIsLoggedIn(!!user);
    setIsLoading(false);
    console.log('Auth status checked. Logged in:', !!user);
  }, []);

  useEffect(() => {
    // Initial check
    checkAuthStatus();

    // Event listeners
    const handleAuthUpdate = () => {
      console.log('Auth update event received');
      checkAuthStatus();
    };

    // System events
    const handleStorage = () => {
      console.log('Storage event detected');
      checkAuthStatus();
    };

    // Custom events
    window.addEventListener('auth-change', handleAuthUpdate);
    // Storage events (cross-tab)
    window.addEventListener('storage', handleStorage);
    // Route changes
    router.events.on('routeChangeComplete', checkAuthStatus);

    // Cleanup
    return () => {
      window.removeEventListener('auth-change', handleAuthUpdate);
      window.removeEventListener('storage', handleStorage);
      router.events.off('routeChangeComplete', checkAuthStatus);
    };
  }, [checkAuthStatus, router.events]);

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('currentUser');
    // Force immediate update
    checkAuthStatus();
    // Notify other components
    window.dispatchEvent(new Event('auth-change'));
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand">
          Weather App
        </Link>
        
        <div className="navbar-links">
          {isLoading ? (
            <div className="loading-indicator">Loading...</div>
          ) : (
            <>
              {isLoggedIn ? (
                <>
                  <button 
                    onClick={handleLogout} 
                    className="nav-button logout-button"
                    aria-label="Log out"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="nav-link">Login</Link>
                  <Link href="/register" className="nav-link">Register</Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}