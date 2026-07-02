// backend/services/aiSearchService.js
/**
 * Smart Student Search using OpenAI text-embedding-ada-002
 * Falls back to fuzzy substring search if OPENAI_API_KEY is not set.
 */
const OpenAI = require('openai');
const Student = require('../models/Student');

let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Simple cosine similarity
const cosineSimilarity = (vecA, vecB) => {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return magA && magB ? dot / (magA * magB) : 0;
};

// Embed a text string via OpenAI
const getEmbedding = async (text) => {
  if (!openai) return null;
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text.trim(),
  });
  return response.data[0].embedding;
};

/**
 * Smart search: uses OpenAI embeddings if available, falls back to regex.
 * Returns top 10 matching students.
 */
const smartSearch = async (query) => {
  try {
    const allStudents = await Student.find({}).lean();

    if (!openai || !query || query.length < 2) {
      // Fallback: simple substring + regex search
      const regex = new RegExp(query, 'i');
      const results = allStudents.filter(
        (s) =>
          regex.test(s.name) ||
          regex.test(s.rollNumber) ||
          regex.test(s.email) ||
          regex.test(s.department)
      );
      return results.slice(0, 10);
    }

    // Build corpus strings for each student
    const corpusStrings = allStudents.map(
      (s) => `${s.name} ${s.rollNumber} ${s.email} ${s.department} ${s.year} ${s.section}`
    );

    // Get query embedding
    const queryEmbedding = await getEmbedding(query);
    if (!queryEmbedding) {
      // Fallback if embedding failed
      const regex = new RegExp(query, 'i');
      return allStudents.filter((s) => regex.test(s.name) || regex.test(s.rollNumber)).slice(0, 10);
    }

    // Get all corpus embeddings in one batch (up to 2048 per call)
    const batchSize = 50;
    const scores = [];

    for (let i = 0; i < corpusStrings.length; i += batchSize) {
      const batch = corpusStrings.slice(i, i + batchSize);
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: batch,
      });
      const batchEmbeddings = response.data.map((d) => d.embedding);
      batchEmbeddings.forEach((emb, j) => {
        scores.push({ index: i + j, score: cosineSimilarity(queryEmbedding, emb) });
      });
    }

    // Sort by similarity descending
    scores.sort((a, b) => b.score - a.score);

    // Return top 10 students
    return scores.slice(0, 10).map((s) => ({
      ...allStudents[s.index],
      _aiScore: parseFloat(s.score.toFixed(4)),
    }));
  } catch (error) {
    console.error('AI search error:', error.message);
    // Graceful fallback
    const regex = new RegExp(query, 'i');
    const all = await Student.find({}).lean();
    return all.filter((s) => regex.test(s.name) || regex.test(s.rollNumber)).slice(0, 10);
  }
};

module.exports = { smartSearch };
