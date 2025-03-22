import { supabase } from '../lib/supabase'

export default function Home() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column'}}>
      <h1>Family Finance Tracker</h1>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
}
