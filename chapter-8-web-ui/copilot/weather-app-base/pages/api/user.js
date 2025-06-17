import bcrypt from 'bcrypt';
import Datastore from '@seald-io/nedb';

const usersDb = new Datastore({ filename: "weather-users.db", autoload: true });

export default async function handler(req, res) {
    const { method } = req;
    if (method === 'POST') {
        const { action, username, password, homeCity, homeLatitude, homeLongitude } = req.body;
        if (action === 'register') {
            // Registration
            usersDb.findOne({ username }, async (err, user) => {
                if (user) {
                    res.status(400).json({ error: "Username already exists." });
                } else {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    usersDb.insert({ username, password: hashedPassword, homeCity, homeLatitude, homeLongitude }, (err, newDoc) => {
                        if (err) {
                            res.status(500).json({ error: "Error registering user." });
                        } else {
                            res.status(200).json({ username });
                        }
                    });
                }
            });
        } else if (action === 'login') {
            // Login
            usersDb.findOne({ username }, async (err, user) => {
                if (!user || !(await bcrypt.compare(password, user.password))) {
                    res.status(400).json({ error: "Invalid credentials." });
                } else {
                    res.status(200).json(user);
                }
            });
        } else {
            res.status(405).json({ error: "Method not allowed." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
}