import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();

app.use(cors());
app.use(express.json());

// Initialize the Google Gen AI SDK safely
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey }); 

// 1. Base Core Test Route
app.get('/', (req, res) => {
    res.json({ status: "success", message: "TrueLink Security Core API is active." });
});

// 2. Gemini AI Chat Endpoint with Deep Logging
app.post('/api/chat', async (req, res) => {
    console.log("--- New Incoming Request ---");
    console.log("Received Payload body:", req.body);
    
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            console.log("Error: Prompt parameter missing from request.");
            return res.status(400).json({ success: false, error: "Prompt is required." });
        }

        if (!apiKey) {
            console.log("Error: GEMINI_API_KEY is not configured in Render Environment.");
            return res.status(500).json({ success: false, error: "API Key missing on server configuration." });
        }

        console.log("Forwarding to Gemini AI Engine using prompt:", prompt);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        console.log("Gemini response generated successfully.");
        res.json({ success: true, text: response.text });

    } catch (error) {
        // This prints the EXACT reason for the 500 crash directly into your Render Logs console!
        console.error("CRITICAL BACKEND CRASH LOG:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. Dynamic Port Allocation for Render Cloud Hosting
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`TrueLink Security Core running seamlessly on port ${PORT}`);
});