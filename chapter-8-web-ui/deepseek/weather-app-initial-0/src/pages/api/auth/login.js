import { auth } from '@lib/auth';
import { compare } from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;
    const user = await auth.getUserByUsername(username);

    if (!user || !(await compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // In a real app, you'd set up session cookies here
    return res.status(200).json({ 
      message: 'Login successful',
      user: {
        username: user.username,
        homeCity: user.homeCity,
        homeLatitude: user.homeLatitude,
        homeLongitude: user.homeLongitude
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}