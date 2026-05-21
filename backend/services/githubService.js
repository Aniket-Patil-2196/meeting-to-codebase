const axios = require('axios');

const GITHUB_API = 'https://api.github.com';

/**
 * Creates GitHub issues from the AI-generated issues array.
 * For each issue, posts to the GitHub API and collects the resulting URLs.
 * Handles rate limiting and individual failures gracefully — a single
 * failed issue won't crash the entire batch.
 *
 * @param {Array} issues - Array of { title, description, labels }
 * @returns {Array} Updated issues array with githubIssueUrl populated
 */
async function createGitHubIssues(issues) {
  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = process.env;

  // If GitHub credentials are missing, skip issue creation
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    console.warn('⚠️  GitHub credentials not configured — skipping issue creation');
    return issues.map((issue) => ({ ...issue, githubIssueUrl: null }));
  }

  const url = `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`;

  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  const results = [];

  for (const issue of issues) {
    try {
      const response = await axios.post(
        url,
        {
          title: issue.title,
          body: issue.description,
          labels: issue.labels || [],
        },
        { headers }
      );

      results.push({
        ...issue,
        githubIssueUrl: response.data.html_url,
      });

      console.log(`✅  Created issue: "${issue.title}" → ${response.data.html_url}`);

      // Respect GitHub rate limits — small delay between requests
      await sleep(500);
    } catch (err) {
      // Handle rate limiting (HTTP 403 with retry-after)
      if (err.response && err.response.status === 403) {
        const retryAfter = err.response.headers['retry-after'];
        if (retryAfter) {
          console.warn(`⏳  Rate limited. Waiting ${retryAfter}s before retry...`);
          await sleep(parseInt(retryAfter, 10) * 1000);

          // Retry once after waiting
          try {
            const retryResponse = await axios.post(
              url,
              {
                title: issue.title,
                body: issue.description,
                labels: issue.labels || [],
              },
              { headers }
            );

            results.push({
              ...issue,
              githubIssueUrl: retryResponse.data.html_url,
            });
            console.log(`✅  Retry succeeded: "${issue.title}"`);
            continue;
          } catch (retryErr) {
            console.error(`❌  Retry failed for "${issue.title}":`, retryErr.message);
          }
        }
      }

      // Log the error but don't crash — mark URL as null
      console.error(
        `❌  Failed to create issue "${issue.title}":`,
        err.response?.data?.message || err.message
      );
      results.push({ ...issue, githubIssueUrl: null });
    }
  }

  return results;
}

/**
 * Simple sleep helper for rate limiting.
 * @param {number} ms - Milliseconds to wait
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { createGitHubIssues };
