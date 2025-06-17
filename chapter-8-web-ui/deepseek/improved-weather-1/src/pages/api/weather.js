import { fetchWeather } from '@/lib/api';
import { logRequest } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { latitude, longitude, days, city } = req.body;
    const forecast = await fetchWeather(latitude, longitude, days);
    
    // In a real app, you'd get username from session
    const username = 'current_user'; // Replace with actual user from session
    const logEntry = await logRequest(username, city, latitude, longitude, days);

    return res.status(200).json({ forecast, logEntry });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}