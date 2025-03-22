import InviteCode from '../components/InviteCode';
import JoinProfile from '../components/JoinProfile';
import Link from 'next/link';

export default function InvitePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>👥 Invite & Join Family Tracker</h1>
      <InviteCode />
      <JoinProfile />
      <div style={{ marginTop: '2rem' }}>
        <Link href="/dashboard">
          <button style={{ padding: '0.5rem 1rem' }}>⬅ Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}
