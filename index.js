const express = require('express');
const app = express();

// Middleware to parse incoming JSON data
app.use(express.json());

// Base test route to verify the server is awake
app.get('/', (req, res) => {
    res.json({ status: "success", message: "TrueLink Security Core API is active." });
});

// Dynamic port allocation for Render, defaulting to 8080 locally
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`TrueLink Security Core running seamlessly on port ${PORT}`);
});