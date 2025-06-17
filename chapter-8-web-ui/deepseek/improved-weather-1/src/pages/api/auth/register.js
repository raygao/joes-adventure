import { auth } from '@lib/auth';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password, homeCity, homeLatitude, homeLongitude } = req.body;
    const hashedPassword = await hash(password, 12);
    
    const user = await auth.createUser({
      username,
      password: hashedPassword,
      homeCity: homeCity || null,
      homeLatitude: homeLatitude || null,
      homeLongitude: homeLongitude || null
    });

    // Return the complete user object
    return res.status(201).json({ 
      message: 'Registration successful',
      user: {
        username: user.username,
        homeCity: user.homeCity,
        homeLatitude: user.homeLatitude,
        homeLongitude: user.homeLongitude
      }
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}