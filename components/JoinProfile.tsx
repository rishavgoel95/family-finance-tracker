// ✅ File: components/JoinProfile.tsx

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function JoinProfile() {
  const [code, setCode] = useState('');

  const handleJoin = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { error } = await supabase.from('user_profiles').insert({
      user_id: user.id,
      profile_id: code,
      role: 'editor',
    });

    if (error) alert('Could not join profile: ' + error.message);
    else alert('Joined successfully!');
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>🔑 Enter Invite Code</h2>
      <input
        type="text"
        placeholder="Paste invite code here"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ padding: '0.5rem', width: '100%' }}
      />
      <button onClick={handleJoin} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
        Join Profile
      </button>
    </div>
  );
}

