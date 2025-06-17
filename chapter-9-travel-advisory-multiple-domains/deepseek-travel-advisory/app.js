require('dotenv').config();
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const app = express();
app.use(express.json());

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Store processed requests in memory (consider using a database in production)
const requests = new Map();

app.post('/recommendations', async (req, res) => {
    try {
        const { city, weather } = req.body;
        const requestId = uuidv4();

        // Validate input
        if (!city || !weather) {
            return res.status(400).json({
                error: 'Both city and weather parameters are required'
            });
        }

        // Store initial request
        requests.set(requestId, {
            status: 'processing',
            city,
            weather,
            createdAt: new Date()
        });

        // Create the prompt for DeepSeek
        const messages = [{
            role: 'user',
            content: `Provide travel recommendations for ${city} considering the following weather: ${weather}. 
            Give me 5-7 suggestions in bullet points. Focus on activities appropriate for the weather conditions.`
        }];

        // Call DeepSeek API
        const deepseekResponse = await axios.post(DEEPSEEK_API_URL, {
            model: process.env.DEEPSEEK_MODEL,
            messages,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Process the response
        const recommendations = deepseekResponse.data.choices[0].message.content
            .split('\n')
            .filter(line => line.trim())
            .map(line => line.replace(/^\s*[\-\*•]\s*/, '').trim());

        // Create response object
        const responseData = {
            requestId,
            recommendations,
            city,
            weather
        };

        // Update request status
        requests.set(requestId, {
            ...requests.get(requestId),
            status: 'completed',
            response: responseData,
            completedAt: new Date()
        });

        res.json(responseData);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

app.get('/requests/:id', (req, res) => {
    const requestId = req.params.id;
    const requestData = requests.get(requestId);

    if (!requestData) {
        return res.status(404).json({ error: 'Request not found' });
    }

    res.json({
        requestId,
        status: requestData.status,
        city: requestData.city,
        weather: requestData.weather,
        createdAt: requestData.createdAt,
        completedAt: requestData.completedAt
    });
});

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});