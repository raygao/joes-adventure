import { auth } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // In a real app, you'd get username from session
      const username = 'current_user'; // Replace with actual user from session
      const user = await auth.getUserByUsername(username);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Don't return password hash
      const { password, ...userData } = user;
      return res.status(200).json(userData);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const { homeCity, homeLatitude, homeLongitude } = req.body;
      // In a real app, you'd get username from session
      const username = 'current_user'; // Replace with actual user from session
      
      await auth.updateUser(username, { 
        homeCity, 
        homeLatitude, 
        homeLongitude 
      });
      
      return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}