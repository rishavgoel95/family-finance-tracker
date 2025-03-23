import Link from 'next/link';

export default function Start() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Welcome 👋</h1>
      <p>What would you like to do?</p>

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Link href="/trackers">
          <button>📂 View My Trackers</button>
        </Link>

        <Link href="/invite">
          <button>🔗 Join a Tracker</button>
        </Link>

        <Link href="/create-tracker">
          <button>🆕 Create New Tracker</button>
        </Link>

        <Link href="/categories">
          <button>🗂 Manage Categories</button>
        </Link>

        <Link href="/calendar">
          <button>📅 View Calendar</button>
        </Link>

        <Link href="/settings">
          <button>⚙️ Settings</button>
        </Link>
      </div>
    </div>
  );
}
