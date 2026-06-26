import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();

// Initialize the SDK by passing the API key explicitly
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

// Middleware to parse incoming JSON bodies from your frontend app
app.use(express.json());

// 1. Base Test Route (To check if your server is awake)
app.get('/', (req, res) => {
    res.json({ status: "success", message: "TrueLink Security Core API is active." });
});

// 2. Gemini AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ success: false, error: "Prompt is required." });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ success: true, text: response.text });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. Dynamic Port Allocation for Render Deployment
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`TrueLink Security Core running seamlessly on port ${PORT}`);
});