// ✅ File: pages/create-tracker.tsx (create a new tracker)

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function CreateTracker() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user || !name.trim()) return;

    const { data: profile, error: createError } = await supabase
      .from('profiles')
      .insert({ name, created_by: user.id })
      .select()
      .single();

    if (createError || !profile) {
      alert('Failed to create tracker');
      return;
    }

    await supabase.from('user_profiles').insert({
      user_id: user.id,
      profile_id: profile.id,
      role: 'owner',
    });

    router.push('/trackers');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🆕 Create New Tracker</h1>
      <input
        type="text"
        placeholder="Enter tracker name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: '0.5rem', width: '100%', maxWidth: '400px' }}
      />
      <br />
      <button onClick={handleCreate} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
        Create Tracker
      </button>
    </div>
  );
}

