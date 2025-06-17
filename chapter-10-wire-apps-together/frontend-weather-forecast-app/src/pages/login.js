import { useRouter } from 'next/router';
import AuthForm from '@/components/AuthForm';
import { useEffect } from 'react';

export default function Login() {
  const router = useRouter();

  const handleLoginSuccess = async (userData) => {
    // Store complete user data in localStorage
    const userToStore = {
      username: userData.username,
      homeCity: userData.homeCity,
      homeLatitude: userData.homeLatitude,
      homeLongitude: userData.homeLongitude,
      token: userData.token // If using JWT
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userToStore));
    
    // Trigger Navbar update
    window.dispatchEvent(new Event('auth-change'));
    window.dispatchEvent(new Event('storage'));
    
    // Add a small delay to ensure state propagation
    await new Promise(resolve => setTimeout(resolve, 50));
    
    router.push('/weather');
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (!data.user || !data.user.username) {
          throw new Error('Invalid user data received');
        }

        await handleLoginSuccess({
          ...data.user,
          token: data.token // Include token if using JWT
        });
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Login failed');
      }
    } catch (error) {
      alert('An error occurred during login');
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    
    if (user) {
      // Add delay to ensure proper initialization
      setTimeout(() => {
        router.push('/weather');
      }, 50);
    }
  }, [router]);

  return (
    <div className="container">
      <h1>Login</h1>
      <AuthForm onSubmit={handleLogin} isLogin={true} />
    </div>
  );
}