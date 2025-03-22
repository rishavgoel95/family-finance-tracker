// ✅ File: pages/start.tsx (choose to create or join a tracker)

import Link from 'next/link';

export default function Start() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Welcome 👋</h1>
      <p>What would you like to do?</p>
      <div style={{ marginTop: '2rem' }}>
        <Link href="/trackers">
          <button style={{ marginRight: '1rem' }}>📂 View My Trackers</button>
        </Link>
        <Link href="/invite">
          <button style={{ marginRight: '1rem' }}>🔗 Join a Tracker</button>
        </Link>
        <Link href="/create-tracker">
          <button>🆕 Create New Tracker</button>
        </Link>
      </div>
    </div>
  );
}
