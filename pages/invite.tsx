// ✅ File: pages/invite.tsx

import InviteCode from '../components/InviteCode';
import JoinProfile from '../components/JoinProfile';

export default function InvitePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>👥 Invite & Join Family Tracker</h1>
      <InviteCode />
      <JoinProfile />
    </div>
  );
}
