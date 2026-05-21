/**
 * Displays a single GitHub issue as a styled card.
 * Shows title, description, labels as colored chips,
 * and a clickable link to the GitHub issue if available.
 */

/* Label → color mapping */
const LABEL_COLORS = {
  feature: { bg: 'rgba(78, 168, 222, 0.15)', text: '#4ea8de', border: 'rgba(78, 168, 222, 0.3)' },
  bug: { bg: 'rgba(248, 113, 113, 0.15)', text: '#f87171', border: 'rgba(248, 113, 113, 0.3)' },
  backend: { bg: 'rgba(167, 139, 250, 0.15)', text: '#a78bfa', border: 'rgba(167, 139, 250, 0.3)' },
  frontend: { bg: 'rgba(0, 214, 143, 0.15)', text: '#00d68f', border: 'rgba(0, 214, 143, 0.3)' },
  database: { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' },
  auth: { bg: 'rgba(251, 146, 60, 0.15)', text: '#fb923c', border: 'rgba(251, 146, 60, 0.3)' },
  api: { bg: 'rgba(96, 165, 250, 0.15)', text: '#60a5fa', border: 'rgba(96, 165, 250, 0.3)' },
  ui: { bg: 'rgba(244, 114, 182, 0.15)', text: '#f472b6', border: 'rgba(244, 114, 182, 0.3)' },
  default: { bg: 'rgba(136, 136, 164, 0.15)', text: '#8888a4', border: 'rgba(136, 136, 164, 0.3)' },
};

function getLabelColor(label) {
  const key = label.toLowerCase();
  return LABEL_COLORS[key] || LABEL_COLORS.default;
}

export default function IssueCard({ issue, index }) {
  const { title, description, labels = [], githubIssueUrl } = issue;

  return (
    <div
      className="rounded-xl border p-5 transition-all duration-300"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
        animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-green)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 214, 143, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Header with issue number */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3
          className="text-base font-semibold leading-snug"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h3>
        <span
          className="text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          #{index + 1}
        </span>
      </div>

      {/* Description */}
      <p
        className="text-sm leading-relaxed mb-4"
        style={{ color: 'var(--text-secondary)' }}
      >
        {description}
      </p>

      {/* Labels & GitHub link */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-wrap gap-1.5">
          {labels.map((label, i) => {
            const colors = getLabelColor(label);
            return (
              <span
                key={i}
                className="text-xs font-medium px-2.5 py-1 rounded-full border"
                style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                  borderColor: colors.border,
                }}
              >
                {label}
              </span>
            );
          })}
        </div>

        {githubIssueUrl && (
          <a
            href={githubIssueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium flex items-center gap-1.5 transition-colors duration-200"
            style={{ color: 'var(--accent-blue)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--accent-blue)';
            }}
          >
            View on GitHub
            <span>→</span>
          </a>
        )}
      </div>
    </div>
  );
}
