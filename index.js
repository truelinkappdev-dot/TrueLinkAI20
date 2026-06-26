const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const KEY_STRING = process.env.GEMINI_API_KEY || "AQ.Ab8RN6JuqpJgPMTs8GSQFV668iKRTEaS6GPIGBp4bvDYQ1KcYA";
const ai = new GoogleGenAI({ apiKey: KEY_STRING });

// 🚀 Expose a crystal-clear, clean POST route directly on the server root
app.post("/analyzeSMS", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Missing message body" });
        }

        const cleanMessage = String(message).trim();
        if (!cleanMessage) {
            return res.status(400).json({ error: "Message body is empty" });
        }

        console.log(`Analyzing text message body safely via Render Framework API.`);

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: `Analyze this SMS message. Reply with exactly one word: SPAM if it is a fraudulent link, phishing attempt, scam, credential theft attempt, or financial fraud. Reply SAFE if it is normal. Message: "${cleanMessage}"`,
        });

        const classification = response.text?.trim().toUpperCase() || "SAFE";
        console.log(`Gemini Engine response matrix outcome: ${classification}`);

        return res.status(200).json({ isSpam: classification.includes("SPAM") });

    } catch (error) {
        console.error("Gemini Engine Analysis Core Error:", error);
        return res.status(500).json({ error: "Internal analysis failure" });
    }
});

// Bind to Render's dynamic application port environment layout array
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`TrueLink Security Core running seamlessly on port ${PORT}`);
});