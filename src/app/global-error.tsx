'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: 48, textAlign: 'center' }}>
        <h2>Something went wrong</h2>
        <p style={{ color: '#666', maxWidth: 420, margin: '12px auto' }}>
          {error.message || 'A critical application error occurred.'}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
