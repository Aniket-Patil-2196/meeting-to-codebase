import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/generate/history';

/**
 * History page — shows last 10 transcript processing results.
 * Displays creation date, transcript preview, and issue counts.
 */
export default function History() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await axios.get(API_URL);
        setProjects(response.data);
      } catch (err) {
        setError('Failed to load history. Is the backend running?');
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <header
        className="border-b"
        style={{
          borderColor: 'var(--border-subtle)',
          background: 'linear-gradient(180deg, var(--bg-secondary), var(--bg-primary))',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                📜 Generation History
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                Your past meeting-to-codebase transformations
              </p>
            </div>
            <a
              href="/"
              className="text-xs font-medium px-4 py-2 rounded-lg border transition-all duration-200"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-card)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-green)';
                e.currentTarget.style.color = 'var(--accent-green)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* ── Content ────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {loading && (
          <div className="flex justify-center py-20">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent"
              style={{
                borderColor: 'var(--accent-green)',
                borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite',
              }}
            />
          </div>
        )}

        {error && (
          <div
            className="rounded-xl border p-4"
            style={{
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              borderColor: 'rgba(248, 113, 113, 0.3)',
              color: 'var(--accent-red)',
            }}
          >
            {error}
          </div>
        )}

        {!loading && projects.length === 0 && !error && (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block opacity-30">📭</span>
            <p style={{ color: 'var(--text-secondary)' }}>
              No generations yet. Go create your first one!
            </p>
          </div>
        )}

        {/* Project cards */}
        <div className="space-y-4">
          {projects.map((project, i) => (
            <div
              key={project._id || i}
              className="rounded-xl border p-5 transition-all duration-300"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
                animation: `fadeInUp 0.4s ease-out ${i * 0.08}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-green)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              {/* Date & stats */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {new Date(project.createdAt).toLocaleString()}
                </span>
                <div className="flex gap-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'rgba(78, 168, 222, 0.15)',
                      color: 'var(--accent-blue)',
                    }}
                  >
                    {project.issues?.length || 0} issues
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'rgba(167, 139, 250, 0.15)',
                      color: 'var(--accent-purple)',
                    }}
                  >
                    {project.userStories?.length || 0} stories
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'rgba(0, 214, 143, 0.15)',
                      color: 'var(--accent-green)',
                    }}
                  >
                    {project.apiSchema?.length || 0} endpoints
                  </span>
                </div>
              </div>

              {/* Transcript preview */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {project.transcript?.substring(0, 200)}
                {project.transcript?.length > 200 ? '...' : ''}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
