const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const app = express();

app.use(express.json());

// Free Gemini Key loaded from your Render Environment Settings
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// The Free Phone Gateway Webhook Endpoint
app.post('/api/free-sms-gateway', async (req, res) => {
    const { sender, textContent } = req.body;

    console.log(`📡 [Free Link Cloud] Paused text payload from: ${sender}`);

    try {
        // Whitelist Check: Let official alerts bypass immediately for safety
        const whitelist = ["HDFCBK", "BARODA", "AXISBK", "GOVT"];
        if (whitelist.some(bank => sender.toUpperCase().includes(bank))) {
            return res.status(200).json({ status: "DELIVER" });
        }

        // Ask Free Gemini Flash model to inspect the text link
        const prompt = `
            Analyze this text message for phishing links, money scams, or fraudulent traps:
            "${textContent}"
            Respond with exactly this formatting option structure:
            { "safe": true } or { "safe": false }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt
        });

        const cleanJson = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
        const verdict = JSON.parse(cleanJson);

        if (verdict.safe === true) {
            console.log("✅ Safe. Authorizing device delivery notification.");
            return res.status(200).json({ status: "DELIVER" });
        } else {
            console.warn("❌ Scam link caught! Sending drop command to device memory.");
            return res.status(200).json({ status: "DROP_AND_DELETE" });
        }

    } catch (error) {
        console.error("System glitch:", error);
        return res.status(200).json({ status: "DELIVER" }); // Fallback safe deliver
    }
});

app.listen(3000, () => console.log("Free TrueLink Server Node Active!"));