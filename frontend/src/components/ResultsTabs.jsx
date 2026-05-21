import { useState } from 'react';
import IssueCard from './IssueCard';
import ApiSchemaCard from './ApiSchemaCard';
import FolderTree from './FolderTree';

/**
 * 4-tab component that displays the full AI-generated result.
 * Tabs: Issues | User Stories | API Schema | Folder Structure
 */

const TABS = [
  { id: 'issues', label: 'Issues', icon: '🎯' },
  { id: 'stories', label: 'User Stories', icon: '👤' },
  { id: 'api', label: 'API Schema', icon: '⚡' },
  { id: 'folders', label: 'Folder Structure', icon: '📁' },
];

export default function ResultsTabs({ result }) {
  const [activeTab, setActiveTab] = useState('issues');

  const { issues = [], userStories = [], apiSchema = [], folderStructure = {} } = result;

  return (
    <div className="animate-fade-in">
      {/* Tab headers */}
      <div
        className="flex gap-1 p-1 rounded-xl mb-6"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          let count = 0;
          if (tab.id === 'issues') count = issues.length;
          if (tab.id === 'stories') count = userStories.length;
          if (tab.id === 'api') count = apiSchema.length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer border-none"
              style={{
                backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                color: isActive ? 'var(--accent-green)' : 'var(--text-muted)',
                boxShadow: isActive
                  ? '0 2px 10px rgba(0, 0, 0, 0.3)'
                  : 'none',
              }}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
              {count > 0 && (
                <span
                  className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
                  style={{
                    backgroundColor: isActive
                      ? 'var(--glow-green)'
                      : 'var(--bg-card)',
                    color: isActive
                      ? 'var(--accent-green)'
                      : 'var(--text-muted)',
                    fontSize: '10px',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {/* ── Issues Tab ──────────────────────────────── */}
        {activeTab === 'issues' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-sm font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                {issues.length} Issues Created
              </span>
              {issues.some((i) => i.githubIssueUrl) && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: 'rgba(0, 214, 143, 0.15)',
                    color: 'var(--accent-green)',
                  }}
                >
                  ✓ Pushed to GitHub
                </span>
              )}
            </div>
            <div className="space-y-3">
              {issues.map((issue, i) => (
                <IssueCard key={i} issue={issue} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── User Stories Tab ────────────────────────── */}
        {activeTab === 'stories' && (
          <div className="space-y-3">
            {userStories.map((story, i) => (
              <div
                key={i}
                className="rounded-xl border p-5 transition-all duration-300"
                style={{
                  backgroundColor:
                    i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)',
                  animation: `fadeInUp 0.4s ease-out ${i * 0.1}s both`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-purple)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="text-lg flex-shrink-0 mt-0.5"
                    style={{ opacity: 0.8 }}
                  >
                    👤
                  </span>
                  <div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      As a{' '}
                      <span
                        className="font-semibold"
                        style={{ color: 'var(--accent-blue)' }}
                      >
                        {story.role}
                      </span>
                      , I want to{' '}
                      <span
                        className="font-semibold"
                        style={{ color: 'var(--accent-green)' }}
                      >
                        {story.goal}
                      </span>{' '}
                      so that{' '}
                      <span
                        className="font-semibold"
                        style={{ color: 'var(--accent-purple)' }}
                      >
                        {story.reason}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── API Schema Tab ─────────────────────────── */}
        {activeTab === 'api' && (
          <div className="space-y-3">
            {apiSchema.map((endpoint, i) => (
              <ApiSchemaCard key={i} endpoint={endpoint} index={i} />
            ))}
          </div>
        )}

        {/* ── Folder Structure Tab ────────────────────── */}
        {activeTab === 'folders' && (
          <div>
            <FolderTree structure={folderStructure} />
            <p
              className="text-xs mt-4 text-center"
              style={{ color: 'var(--text-muted)' }}
            >
              📌 This structure was auto-generated based on your meeting transcript
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
