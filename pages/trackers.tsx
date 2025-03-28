import React from 'react';
import TrackersList from '../components/TrackersList';
import BottomNavBar from '../components/BottomNavBar'; // ✅ This import was missing

export default function TrackersPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">📂 Your Trackers</h1>
      <TrackersList />
      <BottomNavBar />
    </div>
  );
}
