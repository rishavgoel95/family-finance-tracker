// ✅ File: lib/useActiveTracker.ts (handles selected tracker)

import { useState, useEffect } from 'react';

export function useActiveTracker() {
  const [trackerId, setTrackerId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('activeTracker');
    if (stored) setTrackerId(stored);
  }, []);

  const selectTracker = (id: string) => {
    localStorage.setItem('activeTracker', id);
    setTrackerId(id);
  };

  return { trackerId, selectTracker };
}
