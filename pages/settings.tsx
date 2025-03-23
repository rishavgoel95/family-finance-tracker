import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SettingsPage() {
  const [digestEnabled, setDigestEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data } = await supabase
        .from('users')
        .select('digest_enabled')
        .eq('id', user.id)
        .single();

      if (data) {
        setDigestEnabled(data.digest_enabled);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const toggleDigest = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const newValue = !digestEnabled;
    setDigestEnabled(newValue);

    await supabase
      .from('users')
      .update({ digest_enabled: newValue })
      .eq('id', user.id);
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading settings...</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>⚙️ Settings</h1>
      <label style={{ display: 'block', marginTop: '1rem' }}>
        <input
          type="checkbox"
          checked={digestEnabled}
          onChange={toggleDigest}
        />
        &nbsp; Receive Email Digest Summary
      </label>
    </div>
  );
}
