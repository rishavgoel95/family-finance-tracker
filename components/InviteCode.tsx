// ✅ File: components/InviteCode.tsx

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function InviteCode() {
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    const getCode = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data } = await supabase
        .from('user_profiles')
        .select('profile_id')
        .eq('user_id', user.id)
        .single();

      setInviteCode(data?.profile_id || '');
    };

    getCode();
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>🔗 Invite Family Member</h2>
      <p>Share this code with your family member so they can join your profile:</p>
      <input type="text" readOnly value={inviteCode} style={{ width: '100%', padding: '0.5rem' }} />
    </div>
  );
}
