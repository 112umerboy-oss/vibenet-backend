const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Claude AI
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', message: 'VibeNet AI Backend Running!' });
});

// REAL AI MATCHING with Claude
app.post('/api/find-matches', async (req, res) => {
  const { interests, mood, vibeStyle, age, location } = req.body;
  
  console.log('Finding matches for interests:', interests);
  
  try {
    const prompt = `You are VibeNet, an AI matchmaker for Gen Z. Find 4-6 perfect friends for this user.

USER PROFILE:
- Interests: ${interests?.join(', ') || 'Music, Gaming, Art'}
- Current Mood: ${mood || 'Chill'}
- Vibe Style: ${vibeStyle || 'Authentic'}
- Age Range: ${age || '18-25'}

Generate REALISTIC matches with:
1. Creative Gen Z usernames (like: vibewave, aurora_beam, chill_pal)
2. Match percentage (75-99%)
3. Specific reason why they connect
4. A conversation starter they can use

Return ONLY valid JSON in this format:
[
  {
    "username": "string",
    "matchPercentage": number,
    "reason": "string", 
    "conversationStarter": "string",
    "sharedInterests": ["interest1", "interest2"]
  }
]

Make it feel authentic and Gen Z friendly. Use emojis naturally.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.8,
      messages: [{ role: 'user', content: prompt }]
    });
    
    let matchesText = response.content[0].text;
    // Clean up the response
    matchesText = matchesText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const matches = JSON.parse(matchesText);
    
    res.json({ success: true, matches, ai: 'claude' });
    
  } catch (error) {
    console.error('Claude API error:', error);
    // Fallback matches if Claude fails
    res.json({ 
      success: true, 
      matches: getFallbackMatches(interests),
      ai: 'fallback'
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  // Simple demo login - in production, check against database
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

// Fallback matches if Claude API has issues
function getFallbackMatches(interests) {
  const allMatches = [
    {
      username: "vibewave",
      matchPercentage: 94,
      reason: "You both have similar music taste and creative energy!",
      conversationStarter: "Hey! Your vibe is immaculate 🔥 What music are you into?",
      sharedInterests: ["Music", "Art"]
    },
    {
      username: "aurareader",
      matchPercentage: 88,
      reason: "You both appreciate deep conversations and authenticity",
      conversationStarter: "Love your perspective on things 💭 Want to chat about life?",
      sharedInterests: ["Deep talks", "Wellness"]
    },
    {
      username: "midnightcreator",
      matchPercentage: 82,
      reason: "Creative souls think alike!",
      conversationStarter: "Your energy is everything 🎨 What do you create?",
      sharedInterests: ["Art", "Photography"]
    },
    {
      username: "chillvibes",
      matchPercentage: 79,
      reason: "Same laid-back energy",
      conversationStarter: "Finally found someone who gets it ✨ How's your day?",
      sharedInterests: ["Gaming", "Music"]
    },
    {
      username: "adventuresoul",
      matchPercentage: 76,
      reason: "You both love exploring new things",
      conversationStarter: "Any travel or adventure plans? 🌍 Let's connect!",
      sharedInterests: ["Travel", "Photography"]
    }
  ];
  
  // Filter based on user interests
  if (interests && interests.length > 0) {
    return allMatches.filter(m => 
      m.sharedInterests.some(i => interests.some(ui => ui.includes(i)))
    );
  }
  return allMatches;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🤖 VibeNet AI Backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
