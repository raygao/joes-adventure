import { useRouter } from 'next/router';
import AuthForm from '@/components/AuthForm';

export default function Login() {
  const router = useRouter();

  const handleLogin = async (username, password) => {
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
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <AuthForm onSubmit={handleLogin} isLogin={true} />
    </div>
  );
}