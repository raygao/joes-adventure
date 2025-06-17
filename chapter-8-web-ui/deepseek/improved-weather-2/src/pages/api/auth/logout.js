export default function handler(req, res) {
    // If using server-side sessions, you would invalidate the session here
    // For JWT-based auth, you would typically handle this client-side
    res.status(200).json({ message: '>>>>> Logged out successfully' });
  }