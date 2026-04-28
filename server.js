const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// This makes sure your server works
app.get('/', (req, res) => {
    res.send('VibeNet API is alive! 🚀');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
