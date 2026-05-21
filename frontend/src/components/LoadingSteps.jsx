import { useState, useEffect } from 'react';

/**
 * Animated step-by-step loading indicator.
 * Each step appears sequentially with a 1.5s delay,
 * creating an impressive visual during the AI processing.
 */

const STEPS = [
  { icon: '📝', text: 'Reading transcript...' },
  { icon: '🧠', text: 'Analyzing with AI...' },
  { icon: '📋', text: 'Generating GitHub issues...' },
  { icon: '🔗', text: 'Creating issues in repository...' },
  { icon: '📁', text: 'Building folder structure...' },
  { icon: '✅', text: 'Done!' },
];

export default function LoadingSteps() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= STEPS.length - 1) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      {/* Outer glow container */}
      <div
        className="w-full max-w-md rounded-2xl p-8 border"
        style={{
          background: 'linear-gradient(145deg, var(--bg-card), var(--bg-secondary))',
          borderColor: 'var(--border-subtle)',
          boxShadow: '0 0 40px rgba(0, 214, 143, 0.05)',
        }}
      >
        {/* Spinner */}
        {currentStep < STEPS.length - 1 && (
          <div className="flex justify-center mb-8">
            <div
              className="w-12 h-12 rounded-full border-2 border-t-transparent"
              style={{
                borderColor: 'var(--accent-green)',
                borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite',
              }}
            />
          </div>
        )}

        {/* Steps list */}
        <div className="space-y-4">
          {STEPS.map((step, index) => {
            let status = 'pending';
            if (index < currentStep) status = 'completed';
            if (index === currentStep) status = 'active';

            return (
              <div
                key={index}
                className="flex items-center gap-3 transition-all duration-500"
                style={{
                  opacity: status === 'pending' ? 0.3 : 1,
                  transform: status === 'pending'
                    ? 'translateX(8px)'
                    : 'translateX(0)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {/* Icon */}
                <span
                  className="text-xl flex-shrink-0"
                  style={{
                    filter: status === 'pending' ? 'grayscale(1)' : 'none',
                    transform: status === 'active' ? 'scale(1.2)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {step.icon}
                </span>

                {/* Text */}
                <span
                  className="text-sm font-medium"
                  style={{
                    color:
                      status === 'completed'
                        ? 'var(--accent-green)'
                        : status === 'active'
                        ? 'var(--text-primary)'
                        : 'var(--text-muted)',
                    fontWeight: status === 'active' ? 600 : 400,
                  }}
                >
                  {step.text}
                </span>

                {/* Checkmark for completed */}
                {status === 'completed' && (
                  <span
                    className="ml-auto text-xs"
                    style={{ color: 'var(--accent-green)' }}
                  >
                    ✓
                  </span>
                )}

                {/* Pulse dot for active */}
                {status === 'active' && (
                  <span className="ml-auto flex h-2 w-2">
                    <span
                      className="absolute inline-flex h-2 w-2 rounded-full opacity-75"
                      style={{
                        backgroundColor: 'var(--accent-green)',
                        animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
                      }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: 'var(--accent-green)' }}
                    />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div
          className="mt-8 h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${((currentStep + 1) / STEPS.length) * 100}%`,
              background: 'linear-gradient(90deg, var(--accent-green), var(--accent-blue))',
            }}
          />
        </div>
      </div>
    </div>
  );
}
