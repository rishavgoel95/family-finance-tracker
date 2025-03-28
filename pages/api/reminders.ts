import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tracker_id, user_id } = req.body;

  if (!tracker_id || !user_id) {
    return res.status(400).json({ error: 'Missing tracker_id or user_id' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('reminders')
      .select('*')
      .eq('profile_id', tracker_id)
      .gte('due_date', new Date().toISOString().split('T')[0])
      .order('due_date', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { title, due_date } = req.body;
    if (!title || !due_date) {
      return res.status(400).json({ error: 'Missing title or due_date' });
    }

    const { error } = await supabaseAdmin.from('reminders').insert({
      profile_id: tracker_id,
      user_id,
      title,
      due_date,
    });

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ message: 'Reminder added successfully' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
