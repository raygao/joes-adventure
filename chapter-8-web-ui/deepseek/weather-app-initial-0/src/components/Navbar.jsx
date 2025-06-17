import Link from 'next/link';

export default function Navbar() {
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
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link href="/weather" style={{ color: 'white', textDecoration: 'none' }}>
          Weather
        </Link>
        <Link href="/login" style={{ color: 'white', textDecoration: 'none' }}>
          Login
        </Link>
        <Link href="/register" style={{ color: 'white', textDecoration: 'none' }}>
          Register
        </Link>
      </div>
    </nav>
  );
}