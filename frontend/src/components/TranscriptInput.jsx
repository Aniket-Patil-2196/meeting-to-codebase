/**
 * Textarea component for pasting meeting transcripts.
 * Includes a character count, placeholder text, and
 * a prominent "Generate" button.
 */

export default function TranscriptInput({ transcript, setTranscript, onGenerate, isLoading }) {
  return (
    <div className="flex flex-col h-full">
      {/* Section label */}
      <div className="flex items-center justify-between mb-3">
        <label
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          📋 Meeting Transcript
        </label>
        <span
          className="text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          {transcript.length} characters
        </span>
      </div>

      {/* Textarea */}
      <textarea
        id="transcript-input"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder={`Paste your meeting transcript here...\n\ne.g. "We need a user login system, profile page, and the ability to upload a profile picture. MongoDB for the database, REST API backend."`}
        disabled={isLoading}
        className="flex-1 w-full min-h-[280px] resize-none rounded-xl p-5 text-sm leading-relaxed border outline-none transition-all duration-300 placeholder-opacity-50"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)',
          fontFamily: "'Inter', sans-serif",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--accent-green)';
          e.target.style.boxShadow = '0 0 0 3px var(--glow-green)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border-subtle)';
          e.target.style.boxShadow = 'none';
        }}
      />

      {/* Generate button */}
      <button
        id="generate-button"
        onClick={onGenerate}
        disabled={isLoading || !transcript.trim()}
        className="mt-4 w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border-none"
        style={{
          background:
            isLoading || !transcript.trim()
              ? 'var(--bg-card)'
              : 'linear-gradient(135deg, var(--accent-green), var(--accent-green-dim))',
          color:
            isLoading || !transcript.trim()
              ? 'var(--text-muted)'
              : '#0a0a0f',
          cursor: isLoading || !transcript.trim() ? 'not-allowed' : 'pointer',
          boxShadow:
            isLoading || !transcript.trim()
              ? 'none'
              : '0 4px 20px rgba(0, 214, 143, 0.25)',
        }}
        onMouseEnter={(e) => {
          if (!isLoading && transcript.trim()) {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 30px rgba(0, 214, 143, 0.35)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          if (!isLoading && transcript.trim()) {
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 214, 143, 0.25)';
          }
        }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span
              className="inline-block w-4 h-4 rounded-full border-2 border-t-transparent"
              style={{
                borderColor: 'var(--text-muted)',
                borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite',
              }}
            />
            Processing...
          </span>
        ) : (
          '🚀 Generate from Transcript'
        )}
      </button>
    </div>
  );
}
