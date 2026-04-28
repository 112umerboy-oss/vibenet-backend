const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', message: 'VibeNet API Running!' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  res.json({ 
    success: true, 
    user: { id: Date.now(), email, username: email.split('@')[0] }
  });
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { email, password, username, interests } = req.body;
  res.json({ 
    success: true, 
    user: { id: Date.now(), email, username: username || email.split('@')[0] }
  });
});

// AI Matching endpoint (will work when Claude key is added)
app.post('/api/find-matches', async (req, res) => {
  const { interests } = req.body;
  
  // Return demo matches for now
  res.json({ 
    success: true, 
    matches: [
      { username: "vibewave", matchPercentage: 94, reason: "Similar music taste! 🎵", conversationStarter: "Hey! Your vibe is immaculate 🔥" },
      { username: "aurareader", matchPercentage: 88, reason: "Deep conversations 💭", conversationStarter: "Love your perspective!" },
      { username: "midnightcreator", matchPercentage: 82, reason: "Creative souls 🎨", conversationStarter: "Your energy is everything!" },
      { username: "chillvibes", matchPercentage: 79, reason: "Same laid-back energy ✨", conversationStarter: "Finally someone who gets it!" }
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ VibeNet backend running on port ${PORT}`);
});
