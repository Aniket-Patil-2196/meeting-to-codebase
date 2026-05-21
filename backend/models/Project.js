const mongoose = require('mongoose');

/**
 * Project schema — stores each transcript processing result.
 * Fields: transcript, issues (with GitHub URLs), user stories,
 * API schema, folder structure, and creation timestamp.
 */
const ProjectSchema = new mongoose.Schema({
  transcript: {
    type: String,
    required: [true, 'Transcript is required'],
  },
  issues: [
    {
      title: { type: String },
      description: { type: String },
      labels: [{ type: String }],
      githubIssueUrl: { type: String, default: null },
    },
  ],
  userStories: [
    {
      role: { type: String },
      goal: { type: String },
      reason: { type: String },
    },
  ],
  apiSchema: [
    {
      method: { type: String },
      endpoint: { type: String },
      description: { type: String },
      body: { type: mongoose.Schema.Types.Mixed },
    },
  ],
  folderStructure: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', ProjectSchema);
