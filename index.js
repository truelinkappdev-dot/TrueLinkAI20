const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();

// Initialize the Google Gen AI SDK (it automatically looks for process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI(); 

// Middleware to parse incoming JSON bodies from your frontend
app.use(express.json());

// 1. Base Test Route (to check if server is awake)
app.get('/', (req, res) => {
    res.json({ status: "success", message: "TrueLink Security Core API is active." });
});

// 2. Gemini AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ success: false, error: "Prompt is required in the request body." });
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