import {
  auth
} from '@/lib/auth';
import {
  getCurrentUser
} from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'PUT') {
      const {
        username
      } = req.query;
      if (!username) return res.status(400).json({
        message: 'Username is required'
      });

      const currentUser = await getCurrentUser(req);
      if (!currentUser || currentUser.username !== username) {
        return res.status(403).json({
          message: 'Forbidden'
        });
      }

      const {
        homeCity,
        homeLatitude,
        homeLongitude
      } = req.body;
      if (isNaN(homeLatitude) || isNaN(homeLongitude)) {
        return res.status(400).json({
          message: 'Invalid coordinates'
        });
      }

      const updatedUser = await auth.updateUser(username, {
        homeCity,
        homeLatitude: parseFloat(homeLatitude),
        homeLongitude: parseFloat(homeLongitude)
      });

      if (!updatedUser) return res.status(404).json({
        message: 'User not found'
      });

      const {
        password,
        ...safeUser
      } = updatedUser;
      return res.status(200).json(safeUser);
    }

    if (req.method === 'GET') {
      const username = req.query.username;
      if (!username) return res.status(400).json({
        message: 'Username is required'
      });

      const currentUser = await getCurrentUser(req);
      if (!currentUser || currentUser.username !== username) {
        return res.status(401).json({
          message: 'Unauthorized'
        });
      }

      const user = await auth.getUserByUsername(username);
      if (!user) return res.status(404).json({
        message: 'User not found'
      });

      const {
        password,
        ...userData
      } = user;
      return res.status(200).json(userData);
    }

    return res.status(405).json({
      message: 'Method not allowed'
    });
  } catch (error) {
    console.error('User API error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}