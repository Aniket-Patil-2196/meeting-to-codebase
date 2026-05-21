const axios = require('axios');
const Project = require('../models/Project');
const { createGitHubIssues } = require('../services/githubService');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Main controller — orchestrates the full transcript processing pipeline:
 * 1. Validates input
 * 2. Calls Python AI service to analyze transcript
 * 3. Creates GitHub issues from AI-generated issues
 * 4. Saves everything to MongoDB
 * 5. Returns the complete result to the frontend
 */
async function generateFromTranscript(req, res) {
  try {
    const { transcript } = req.body;

    // ── Validate input ───────────────────────────────────
    if (!transcript || !transcript.trim()) {
      return res.status(400).json({
        error: 'Transcript is required. Please paste your meeting transcript.',
      });
    }

    console.log(`📝  Received transcript (${transcript.length} chars)`);

    // ── Step 1: Call Python AI service ───────────────────
    console.log('🧠  Calling AI service...');
    let aiResult;
    try {
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/process`, {
        transcript: transcript.trim(),
      });
      aiResult = aiResponse.data;
    } catch (aiErr) {
      const detail = aiErr.response?.data?.detail || aiErr.message;
      console.error('❌  AI service error:', detail);
      return res.status(502).json({
        error: `AI service error: ${detail}`,
      });
    }

    console.log('✅  AI analysis complete');

    // ── Step 2: Create GitHub issues ────────────────────
    console.log('🔗  Creating GitHub issues...');
    let issuesWithUrls;
    try {
      issuesWithUrls = await createGitHubIssues(aiResult.issues || []);
    } catch (ghErr) {
      console.error('⚠️  GitHub service error:', ghErr.message);
      // Don't fail — just use issues without URLs
      issuesWithUrls = (aiResult.issues || []).map((issue) => ({
        ...issue,
        githubIssueUrl: null,
      }));
    }

    console.log(`✅  ${issuesWithUrls.length} issues processed`);

    // ── Step 3: Build final result ──────────────────────
    const result = {
      transcript,
      issues: issuesWithUrls,
      userStories: aiResult.userStories || [],
      apiSchema: aiResult.apiSchema || [],
      folderStructure: aiResult.folderStructure || {},
    };

    // ── Step 4: Save to MongoDB ─────────────────────────
    try {
      const project = new Project(result);
      await project.save();
      console.log('💾  Project saved to MongoDB');
    } catch (dbErr) {
      // Log but don't fail — user still gets their results
      console.error('⚠️  MongoDB save error:', dbErr.message);
    }

    // ── Step 5: Return result ───────────────────────────
    console.log('🚀  Sending result to frontend');
    return res.status(200).json(result);
  } catch (err) {
    console.error('❌  Unexpected error in generateFromTranscript:', err.message);
    return res.status(500).json({
      error: 'An unexpected error occurred. Please try again.',
    });
  }
}

/**
 * Fetches the last 10 processed projects from MongoDB,
 * sorted by creation date (newest first).
 */
async function getHistory(req, res) {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.status(200).json(projects);
  } catch (err) {
    console.error('❌  History fetch error:', err.message);
    return res.status(500).json({
      error: 'Failed to fetch history.',
    });
  }
}

module.exports = { generateFromTranscript, getHistory };
