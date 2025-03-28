// ✅ File: pages/trackers.tsx (lists owned and shared trackers)

import TrackersList from '../components/TrackersList';

export default function TrackersPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📂 Your Trackers</h1>
      <TrackersList />
<BottomNavBar />
    </div>
  );
}
