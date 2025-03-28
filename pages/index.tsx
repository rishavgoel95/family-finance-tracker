import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      <h1>📊 Family Finance Tracker</h1>

      <a href="/api/auth/login">
        <button style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', marginTop: '1rem' }}>
          🔐 Sign in with Google
        </button>
      </a>

      <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: '#666' }}>
        Powered by Supabase + Vercel
      </p>
    </div>
  );
}
