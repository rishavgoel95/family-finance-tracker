import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error.message);
        return;
      }

      if (data.session) {
        // ✅ Logged in successfully
        router.push('/start');
      } else {
        // ⏳ Wait and retry once in case session isn't ready yet
        setTimeout(handleCallback, 1000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>🔐 Logging you in...</h2>
    </div>
  );
}
