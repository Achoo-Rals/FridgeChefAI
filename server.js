import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // images can be large as base64

const GEMINI_MODEL = 'gemini-2.5-flash';

app.post('/api/invoke-llm', async (req, res) => {
  const { prompt, imageBase64, schema } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not set. Add it to your .env file.' });
  }
  if (!prompt) {
    return res.status(400).json({ error: 'Missing "prompt" in request body.' });
  }

  try {
    const parts = [{ text: prompt }];
    if (imageBase64) {
      parts.push({ inline_data: { mime_type: 'image/jpeg', data: imageBase64 } });
    }

    const requestBody = {
      contents: [{ parts }],
    };

    // If a schema was provided, force Gemini to return structured JSON matching it
    if (schema) {
      requestBody.generationConfig = {
        responseMimeType: 'application/json',
        responseSchema: schema,
      };
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API error:', errText);
      return res.status(502).json({ error: 'Gemini API request failed.' });
    }

    const data = await geminiResponse.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('Unexpected Gemini response shape:', JSON.stringify(data));
      return res.status(502).json({ error: 'Gemini returned an unexpected response.' });
    }

    const parsed = schema ? JSON.parse(text) : { text };
    res.json(parsed);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'LLM call failed.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
