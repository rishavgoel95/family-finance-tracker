// ✅ File: pages/index.tsx (with Sign Out button and navigable links)

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        router.push('/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    router.push('/');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Family Finance Tracker</h1>
      {!session ? (
        <>
          <button onClick={handleLogin} style={{ marginBottom: '1rem' }}>Sign in with Google</button>
          <Link href="/invite">
            <button>👥 Go to Invite/Join Page</button>
          </Link>
        </>
      ) : (
        <button onClick={handleLogout} style={{ marginTop: '1rem' }}>🚪 Sign Out</button>
      )}
    </div>
  );
}
