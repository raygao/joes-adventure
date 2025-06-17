// app.js
require('dotenv').config();
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const port = process.env.PORT || 3500;

app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// In-memory storage for demonstration (use database in production)
const recommendationsCache = new Map();

app.post('/recommendations', async (req, res) => {
  try {
    const { city, weather } = req.body;
    if (!city || !weather) {
      return res.status(400).json({ error: 'Missing city or weather data' });
    }

    const requestId = uuidv4();
    const systemPrompt = `You are a travel expert. Generate travel recommendations in JSON format with this structure:
    {
      "recommendations": [
        {
          "time": "daytime/evening/etc",
          "type": "indoor/outdoor",
          "activities": []
        }
      ]
    }
    Include specific venues and safety tips. Use valid JSON only.`;

    const userMessage = `Generate travel recommendations for ${city} with this weather:
    ${JSON.stringify(weather, null, 2)}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userMessage }
      ]
    });

    const responseId = uuidv4();
    const result = {
      requestId,
      responseId,
      city,
      weather,
      recommendations: JSON.parse(response.content[0].text)
    };

    recommendationsCache.set(requestId, result);
    res.json(result);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to generate recommendations',
      details: error.message
    });
  }
});

app.get('/recommendations/:requestId', (req, res) => {
  const result = recommendationsCache.get(req.params.requestId);
  res.json(result || { error: 'Request ID not found' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});