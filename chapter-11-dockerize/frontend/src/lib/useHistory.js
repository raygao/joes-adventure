import { useState, useEffect } from 'react';

export default function useHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/history');
        if (res.ok) {
          setHistory(await res.json());
        }
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return { history, loading };
}