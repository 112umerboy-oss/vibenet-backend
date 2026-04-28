const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// IMPORTANT: This is the route you need
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'VibeNet API is working!',
    time: new Date().toISOString()
  });
});

// Home route (so you don't get "Not Found")
app.get('/', (req, res) => {
  res.json({ 
    message: 'VibeNet API is running ✅',
    routes: ['GET /api/health', 'GET /']
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
