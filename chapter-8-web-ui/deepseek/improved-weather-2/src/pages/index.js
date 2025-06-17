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
        <div className="auth-section">
          <h2>Login</h2>
          <AuthForm onSubmit={handleLogin} isLogin={true} />
        </div>
        
        <div className="divider">or</div>
        
        <div className="auth-section">
          <h2>Register</h2>
          <button 
            onClick={() => router.push('/register')}
            className="register-button"
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
}