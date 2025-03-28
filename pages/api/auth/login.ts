import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase'; // client SDK for login

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 🔒 Hardcoded to your actual domain
  const redirectTo = `https://shigotrish.vercel.app/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  });

  if (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      code: 500,
      error_code: 'unexpected_failure',
      msg: 'Unexpected failure during login. Please try again.',
    });
  }

  // 🚀 Redirect user to Google login via Supabase securely
  res.writeHead(302, { Location: data.url });
  res.end();
}
