import { getHistoryByUser } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // In a real app, you'd get username from session
    const username = 'current_user'; // Replace with actual user from session
    const history = await getHistoryByUser(username);
    
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}