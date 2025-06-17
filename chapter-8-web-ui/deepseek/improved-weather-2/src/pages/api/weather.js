import { logRequest } from '@/lib/db'; // Fixed import
import { getCurrentUser } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = await getCurrentUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    
    const { latitude, longitude, days, city } = req.body;
    
    // Log request to database
    await logRequest(
      user.username,
      city,
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(days, 10)
    );
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('History save error:', error);
    res.status(500).json({ error: 'Failed to save history' });
  }
}