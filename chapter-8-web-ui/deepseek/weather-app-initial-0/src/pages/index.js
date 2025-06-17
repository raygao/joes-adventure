import { useRouter } from 'next/router';
import AuthForm from '@/components/AuthForm';

export default function Home() {
  const router = useRouter();

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        router.push('/weather');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      alert('An error occurred during login');
    }
  };

  return (
    <div className="container">
      <h1>Welcome to Weather App</h1>
      <div className="auth-options">
        <AuthForm onSubmit={handleLogin} isLogin={true} />
        <p className="or-divider">or</p>
        <button 
          onClick={() => router.push('/register')}
          className="auth-button"
        >
          Register New Account
        </button>
      </div>
    </div>
  );
}