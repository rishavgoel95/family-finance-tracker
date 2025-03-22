// ✅ File: components/TrackersList.tsx (updated to support switching trackers)

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useActiveTracker } from '../lib/useActiveTracker';

export default function TrackersList() {
  const [trackers, setTrackers] = useState([]);
  const { trackerId, selectTracker } = useActiveTracker();

  useEffect(() => {
    const fetchTrackers = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('profile_id, profiles(name), role')
        .eq('user_id', user.id);

      if (!error) setTrackers(data);
    };

    fetchTrackers();
  }, []);

  return (
    <div style={{ marginTop: '1rem' }}>
      {trackers.map((tracker) => (
        <div key={tracker.profile_id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <h3>{tracker.profiles?.name || 'Unnamed Tracker'}</h3>
          <p>Role: {tracker.role}</p>
          <p>ID: {tracker.profile_id}</p>
          <button
            onClick={() => selectTracker(tracker.profile_id)}
            style={{ marginTop: '0.5rem' }}
          >
            {trackerId === tracker.profile_id ? '✅ Selected' : '🎯 Select This Tracker'}
          </button>
        </div>
      ))}
    </div>
  );
}
