import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import * as XLSX from 'xlsx';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { tracker_id } = req.body;
  if (!tracker_id) return res.status(400).json({ error: 'Missing tracker_id' });

  const tables = ['income', 'expenses', 'goals', 'investments'];
  const allData: Record<string, any[]> = {};

  for (const table of tables) {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select('*')
      .eq('profile_id', tracker_id);

    if (error) {
      return res.status(500).json({ error: `Failed to fetch ${table}` });
    }

    allData[table] = data || [];
  }

  const workbook = XLSX.utils.book_new();

  tables.forEach((table) => {
    const worksheet = XLSX.utils.json_to_sheet(allData[table]);
    XLSX.utils.book_append_sheet(workbook, worksheet, table);
  });

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Disposition', 'attachment; filename=finance_export.xlsx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
}
