const express = require('express');
const router = express.Router();
const { generateFromTranscript, getHistory } = require('../controllers/generateController');

// POST /api/generate — process a meeting transcript
router.post('/', generateFromTranscript);

// GET /api/generate/history — fetch last 10 processed projects
router.get('/history', getHistory);

module.exports = router;
