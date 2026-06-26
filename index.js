import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();

// Enable CORS security middleware for the True Link application ecosystem
app.use(cors());

// Middleware to parse incoming JSON payload data
app.use(express.json());

// Initialize the Google Gen AI SDK with an explicit API key lookup
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

// 1. Base Core Test Route
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

// 3. Dynamic Port Allocation for Render Cloud Hosting
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`TrueLink Security Core running seamlessly on port ${PORT}`);
}); 