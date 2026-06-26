// Dynamic port allocation for Render, defaulting to 8080 locally
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`TrueLink Security Core running seamlessly on port ${PORT}`);
});