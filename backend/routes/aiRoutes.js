// backend/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { smartSearch } = require('../services/aiSearchService');

// @desc    AI-powered smart student search
// @route   GET /api/ai/search?q=<query>
// @access  Private
router.get('/search', protect, async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length === 0) {
    return res.status(400).json({ message: 'Query parameter "q" is required' });
  }
  try {
    const results = await smartSearch(q.trim());
    return res.json({ results, powered_by: process.env.OPENAI_API_KEY ? 'openai-embeddings' : 'fuzzy-regex' });
  } catch (error) {
    console.error('AI search route error:', error);
    return res.status(500).json({ message: 'Search failed' });
  }
});

module.exports = router;
