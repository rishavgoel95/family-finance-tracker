import CalendarView from '../components/CalendarView';
import BottomNavBar from '../components/BottomNavBar';
import { useEffect, useState } from 'react';
import { useActiveTracker } from '../lib/useActiveTracker';
import Link from 'next/link';

export default function CalendarPage() {
  const { trackerId } = useActiveTracker();

  if (!trackerId)
    return (
      <p style={{ padding: '2rem' }}>
        ⚠️ No tracker selected. Go to <Link href="/trackers">/trackers</Link> to select one.
      </p>
    );

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📅 Calendar View</h1>
      <CalendarView />
<BottomNavBar />
    </div>
  );
}
