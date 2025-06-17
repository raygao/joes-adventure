// app.js
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const port = process.env.PORT || 3500;

app.use(cors()); // Allow all origins (for development only)
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// In-memory cache (for demo purposes)
const recommendationsCache = new Map();

app.post('/recommendations', async (req, res) => {
  try {
    console.log("#### Received request:", req.body);
    const { city, weather } = req.body;

    if (!city || !weather) {
      return res.status(400).json({ error: 'Missing city or weather data' });
    }

    const requestId = uuidv4();

    const systemPrompt = `You are a travel expert. Generate travel recommendations in JSON format like this:
{
  "recommendations": [
    {
      "time": "daytime/evening/etc",
      "type": "indoor/outdoor",
      "activities": [
        "Visit the Louvre Museum",
        "Explore Montmartre"
      ]
    }
  ]
}
Include specific venues and safety tips. Respond only with valid JSON. Do not include any explanation or formatting.`;

    const userMessage = `Generate travel recommendations for ${city} with this weather:
${typeof weather === 'string' ? weather : JSON.stringify(weather, null, 2)}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userMessage }
      ]
    });

    const rawContent = response.content?.[0]?.text;

    if (!rawContent) {
      throw new Error('No text content returned from Claude.');
    }

    console.log("Claude raw content:", rawContent);

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (parseErr) {
      console.error('Failed to parse Claude output:', rawContent);
      throw new Error('Claude returned invalid JSON.');
    }

    const responseId = uuidv4();
    const result = {
      requestId,
      responseId,
      city,
      weather,
      recommendations: parsed
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