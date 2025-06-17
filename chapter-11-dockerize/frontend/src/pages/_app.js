import { useEffect } from 'react';
import Navbar from '@components/Navbar';
import '../styles/globals.css';
import { loadConfig } from '@util/config';

// Load My Application
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadConfig();
    }
  }, []);
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;