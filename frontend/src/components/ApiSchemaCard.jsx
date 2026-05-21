/**
 * Displays a single API endpoint as a styled card.
 * Shows method badge, endpoint path, description,
 * and request body as formatted JSON.
 */

const METHOD_STYLES = {
  GET: { bg: 'rgba(78, 168, 222, 0.15)', text: '#4ea8de', border: 'rgba(78, 168, 222, 0.4)' },
  POST: { bg: 'rgba(0, 214, 143, 0.15)', text: '#00d68f', border: 'rgba(0, 214, 143, 0.4)' },
  PUT: { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.4)' },
  PATCH: { bg: 'rgba(251, 146, 60, 0.15)', text: '#fb923c', border: 'rgba(251, 146, 60, 0.4)' },
  DELETE: { bg: 'rgba(248, 113, 113, 0.15)', text: '#f87171', border: 'rgba(248, 113, 113, 0.4)' },
};

export default function ApiSchemaCard({ endpoint, index }) {
  const { method, endpoint: path, description, body } = endpoint;
  const methodStyle = METHOD_STYLES[method?.toUpperCase()] || METHOD_STYLES.GET;

  return (
    <div
      className="rounded-xl border p-5 transition-all duration-300"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
        animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = methodStyle.border;
        e.currentTarget.style.boxShadow = `0 4px 20px ${methodStyle.bg}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Method badge + endpoint path */}
      <div className="flex items-center gap-3 mb-3">
        <span
          className="text-xs font-bold px-3 py-1 rounded-md border uppercase tracking-wider"
          style={{
            backgroundColor: methodStyle.bg,
            color: methodStyle.text,
            borderColor: methodStyle.border,
            minWidth: '60px',
            textAlign: 'center',
          }}
        >
          {method}
        </span>
        <code
          className="text-sm font-medium"
          style={{
            color: 'var(--text-primary)',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {path}
        </code>
      </div>

      {/* Description */}
      <p
        className="text-sm mb-4"
        style={{ color: 'var(--text-secondary)' }}
      >
        {description}
      </p>

      {/* Request body */}
      {body && Object.keys(body).length > 0 && (
        <div>
          <span
            className="text-xs font-semibold uppercase tracking-wider mb-2 block"
            style={{ color: 'var(--text-muted)' }}
          >
            Request Body
          </span>
          <pre
            className="text-xs p-3 rounded-lg overflow-x-auto"
            style={{
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--accent-green)',
              fontFamily: "'JetBrains Mono', monospace",
              border: '1px solid var(--border-subtle)',
              lineHeight: '1.6',
            }}
          >
            {JSON.stringify(body, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
