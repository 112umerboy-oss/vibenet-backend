const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', message: 'VibeNet API is working!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
