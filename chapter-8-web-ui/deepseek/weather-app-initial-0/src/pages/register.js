import { useRouter } from 'next/router';
import AuthForm from '@/components/AuthForm';

export default function Register() {
  const router = useRouter();

  const handleRegister = async (username, password) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (response.ok) {
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
    </div>
  );
}