/**
 * End-to-end test script — sends demo transcript to the backend
 * and prints the full result.
 */
const axios = require('axios');

const API_URL = 'http://localhost:5000/api/generate';

const transcript = `Okay team, so for this sprint we need to build three main things. First, a user authentication system — signup, login, logout with JWT tokens. Second, a user profile page where people can update their name, bio, and upload a profile picture — store images on Cloudinary. Third, a dashboard that shows the user's recent activity. We'll use MongoDB for the database, Node.js backend with REST API, and React for the frontend. The profile picture upload needs to have file size validation — max 2MB.`;

async function test() {
  console.log('🚀 Sending demo transcript to backend...\n');
  console.log(`Transcript (${transcript.length} chars):\n"${transcript.substring(0, 100)}..."\n`);

  try {
    const start = Date.now();
    const response = await axios.post(API_URL, { transcript }, { timeout: 120000 });
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    console.log(`✅ Response received in ${elapsed}s\n`);
    console.log('--- ISSUES ---');
    response.data.issues?.forEach((issue, i) => {
      console.log(`  ${i + 1}. ${issue.title}`);
      console.log(`     Labels: [${issue.labels?.join(', ')}]`);
      console.log(`     GitHub: ${issue.githubIssueUrl || 'N/A (credentials not set)'}`);
    });

    console.log('\n--- USER STORIES ---');
    response.data.userStories?.forEach((story, i) => {
      console.log(`  ${i + 1}. As a ${story.role}, I want to ${story.goal} so that ${story.reason}`);
    });

    console.log('\n--- API SCHEMA ---');
    response.data.apiSchema?.forEach((ep, i) => {
      console.log(`  ${i + 1}. ${ep.method} ${ep.endpoint} — ${ep.description}`);
    });

    console.log('\n--- FOLDER STRUCTURE ---');
    console.log(JSON.stringify(response.data.folderStructure, null, 2));

    console.log('\n🎉 End-to-end test PASSED!');
  } catch (err) {
    console.error('❌ Test FAILED:', err.response?.data || err.message);
  }
}

test();
