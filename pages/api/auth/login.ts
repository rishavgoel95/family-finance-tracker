import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase'; // optional: use frontend client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const redirectTo = `${req.headers.origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Redirect the user to the Supabase-provided URL (server-side)
  res.writeHead(302, { Location: data.url });
  res.end();
}
