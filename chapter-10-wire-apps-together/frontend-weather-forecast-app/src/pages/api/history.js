import { getHistoryByUser } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = await getCurrentUser(req);
    if (!user) return res.status(401).json([]);
    
    const history = await getHistoryByUser(user.username);
    return res.status(200).json(history);
  } catch (error) {
    console.error('History fetch error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}