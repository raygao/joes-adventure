import Datastore from '@seald-io/nedb';

const historyDb = new Datastore({ filename: "weather-history.db", autoload: true });

export default async function handler(req, res) {
    const { method } = req;
    if (method === 'GET') {
        // Expect query parameter: username
        const { username } = req.query;
        historyDb.find({ username }).sort({ timestamp: -1 }).exec((err, history) => {
            if (err) {
                res.status(500).json({ error: "Error retrieving history" });
            } else {
                res.status(200).json({ history });
            }
        });
    } else if (method === 'POST') {
        const { username, city, latitude, longitude, days } = req.body;
        const timestamp = new Date().toISOString();
        historyDb.insert({ username, city, latitude, longitude, days, timestamp }, (err, doc) => {
            if (err) {
                res.status(500).json({ error: "Error logging request" });
            } else {
                res.status(200).json({ message: "Logged successfully" });
            }
        });
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}