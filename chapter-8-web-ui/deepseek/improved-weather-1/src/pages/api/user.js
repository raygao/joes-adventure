import { auth } from '@lib/auth';

export default async function handler(req, res) {
  try {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    // Get username from query or default to null
    const username = req.query.username || null;
    
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const user = await auth.getUserByUsername(username);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't return password hash
    const { password, ...userData } = user;
    
    return res.status(200).json(userData);
  } catch (error) {
    console.error('User API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}