// ✅ File: pages/index.tsx (redirects to /start instead of /dashboard)

import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/start');
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Family Finance Tracker</h1>
      <button onClick={handleLogin} style={{ marginBottom: '1rem' }}>Sign in with Google</button>
    </div>
  );
}
