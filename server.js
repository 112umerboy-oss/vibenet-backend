const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Claude
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', message: 'VibeNet AI Ready!' });
});

// AI Matching endpoint
app.post('/api/find-matches', async (req, res) => {
  const { interests } = req.body;
  
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Generate 3 fun Gen Z friend matches for someone who likes: ${interests?.join(', ') || 'music and gaming'}. 
        Return JSON only: [{"username":"name","match":95,"reason":"why they match"}]`
      }]
    });
    
    let text = response.content[0].text;
    text = text.replace(/```json|```/g, '');
    const matches = JSON.parse(text);
    
    res.json({ success: true, matches });
  } catch (error) {
    res.json({ 
      success: true, 
      matches: [
        { username: "vibewave", match: 94, reason: "Similar music taste!" },
        { username: "aurareader", match: 88, reason: "Deep convos!" }
      ]
    });
  }
});

// Login endpoint
app.post('/api/login', (req, res) => {
  res.json({ success: true, user: { id: 1, email: req.body.email } });
});

// Register endpoint
app.post('/api/register', (req, res) => {
  res.json({ success: true, user: { id: 1, email: req.body.email } });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server on port ${PORT}`));
