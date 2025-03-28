import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    user_id,
    tracker_id,
    type,
    amount,
    note,
    category,
    receipt_url,
    title,
    target_amount,
  } = req.body;

  if (!user_id || !tracker_id || !type || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const table = type === 'expense' ? 'expenses' : type === 'income' ? 'income' : 'goals';

  let payload: any = {
    profile_id: tracker_id,
    user_id,
    amount,
    note,
    date: new Date().toISOString().split('T')[0],
  };

  if (type === 'expense') {
    payload.category = category;
    payload.receipt_url = receipt_url;
  }

  if (type === 'goals') {
    payload.title = title || note;
    payload.target_amount = target_amount || amount;
    payload.saved_amount = 0;
  }

  const { error } = await supabaseAdmin.from(table).insert([payload]);

  if (error) {
    console.error('Insert failed:', error.message);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Saved successfully' });
}
