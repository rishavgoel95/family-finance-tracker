import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tracker_id } = req.body;

  if (!tracker_id) return res.status(400).json({ error: 'Missing tracker_id' });

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('profile_id', tracker_id)
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { name, emoji } = req.body;

    if (!name) return res.status(400).json({ error: 'Missing category name' });

    const { error } = await supabaseAdmin.from('categories').insert({
      profile_id: tracker_id,
      name,
      emoji,
    });

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ message: 'Category added' });
  }

  return res.status(405).end('Method Not Allowed');
}
