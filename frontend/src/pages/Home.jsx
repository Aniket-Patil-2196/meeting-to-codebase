import { useState } from 'react';
import axios from 'axios';
import TranscriptInput from '../components/TranscriptInput';
import LoadingSteps from '../components/LoadingSteps';
import ResultsTabs from '../components/ResultsTabs';

const API_URL = 'http://localhost:5000/api/generate';

/**
 * Main page — two-panel layout.
 * Left: transcript input + generate button
 * Right: loading animation → result tabs
 */
export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  /** Calls the backend to process the transcript */
  async function handleGenerate() {
    if (!transcript.trim()) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await axios.post(API_URL, {
        transcript: transcript.trim(),
      });
      setResult(response.data);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        'Something went wrong. Please check that both the backend and AI service are running.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* ── Header ──────────────────────────────────────── */}
      <header
        className="border-b"
        style={{
          borderColor: 'var(--border-subtle)',
          background: 'linear-gradient(180deg, var(--bg-secondary), var(--bg-primary))',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                Meeting{' '}
                <span style={{ color: 'var(--accent-green)' }}>→</span>{' '}
                Codebase
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                From standup to sprint, in seconds.
              </p>
            </div>
            <a
              href="/history"
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
              📜 History
            </a>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel — Input */}
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <TranscriptInput
              transcript={transcript}
              setTranscript={setTranscript}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* Right Panel — Results */}
          <div>
            {/* Error banner */}
            {error && (
              <div
                className="rounded-xl border p-4 mb-6 animate-fade-in"
                style={{
                  backgroundColor: 'rgba(248, 113, 113, 0.1)',
                  borderColor: 'rgba(248, 113, 113, 0.3)',
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: 'var(--accent-red)' }}
                    >
                      Generation Failed
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading state */}
            {isLoading && <LoadingSteps />}

            {/* Results */}
            {result && !isLoading && <ResultsTabs result={result} />}

            {/* Empty state */}
            {!isLoading && !result && !error && (
              <div
                className="flex flex-col items-center justify-center min-h-[400px] rounded-2xl border"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-subtle)',
                  borderStyle: 'dashed',
                }}
              >
                <span className="text-5xl mb-4 opacity-30">🚀</span>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Ready to transform your meeting
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Paste a transcript and hit Generate
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
