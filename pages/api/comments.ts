import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { trackerId, userId, message } = req.body;

    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert({ tracker_id: trackerId, user_id: userId, message })
      .select();

    if (error) return res.status(400).json({ error });
    return res.status(200).json(data);
  }

  if (req.method === 'GET') {
    const { trackerId } = req.query;

    const { data, error } = await supabaseAdmin
      .from('comments')
      .select('*, users(display_name)')
      .eq('tracker_id', trackerId)
      .order('created_at', { ascending: true });

    if (error) return res.status(400).json({ error });
    return res.status(200).json(data);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
