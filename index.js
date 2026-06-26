const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const app = express();

// Tells our program to understand JSON data packets
app.use(express.json());

// Load your free Gemini AI key safely
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// This is our digital Castle Gate endpoint
app.post('/api/network-interceptor', async (req, res) => {
    const { senderId, messageBody } = req.body;

    console.log(`📡 [Gatekeeper] Paused message from: ${senderId}`);

    try {
        // RULE 1: If the sender is an official Bank, let it pass instantly!
        const banksList = ["HDFCBK", "BARODA", "AXISBK", "GOVT"];
        const isOfficial = banksList.some(bank => senderId.toUpperCase().includes(bank));

        if (isOfficial) {
            console.log(`✅ Safe Bank message. Delivering to user.`);
            return res.status(200).json({ action: "DELIVER" });
        }

        // RULE 2: Ask Gemini AI if the text contains a link or a scam trick
        const aiRules = `
            You are a security guard. Check this message text for fake links or spam traps like "10k prize":
            "${messageBody}"
            Reply with exactly this JSON formatting structure:
            { "safe": false } OR { "safe": true }
        `;

        const aiOutput = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: aiRules
        });

        const cleanJson = aiOutput.text.replace(/```json/g, "").replace(/```/g, "").trim();
        const verdict = JSON.parse(cleanJson);

        // RULE 3: If Gemini says it's unsafe, drop it in the trash!
        if (verdict.safe === true) {
            console.log(`✅ AI approved. Delivering message.`);
            return res.status(200).json({ action: "DELIVER" });
        } else {
            console.warn(`❌ ALERT: Scam link caught! Dropping text in the trash.`);
            return res.status(200).json({ action: "DROP_AND_DELETE_PERMANENTLY" });
        }

    } catch (error) {
        // If the server glitches, just deliver the message so nothing important breaks
        return res.status(200).json({ action: "DELIVER" });
    }
});

app.listen(3000, () => console.log(`🚀 Code simulator is running!`));