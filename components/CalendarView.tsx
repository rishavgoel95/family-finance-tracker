import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useActiveTracker } from '../lib/useActiveTracker';

interface Entry {
  type: 'income' | 'expense';
  amount: number;
  date: string;
  note?: string;
  receipt_url?: string;
}

export default function CalendarView() {
  const { trackerId } = useActiveTracker();
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user || !trackerId) return;

      const [incomeRes, expenseRes] = await Promise.all([
        supabase
          .from('income')
          .select('amount, note, date')
          .eq('profile_id', trackerId),

        supabase
          .from('expenses')
          .select('amount, note, date, receipt_url')
          .eq('profile_id', trackerId),
      ]);

      const income = (incomeRes.data || []).map(i => ({ ...i, type: 'income' as const }));
      const expenses = (expenseRes.data || []).map(e => ({ ...e, type: 'expense' as const }));

      setEntries([...income, ...expenses].sort((a, b) => a.date.localeCompare(b.date)));
    };

    fetchEntries();
  }, [trackerId]);

  const grouped = entries.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);

  return (
    <div style={{ marginTop: '3rem' }}>
      <h2>📅 Calendar View</h2>
      {Object.keys(grouped).map(date => (
        <div key={date} style={{ marginBottom: '1rem' }}>
          <strong>{date}</strong>
          {grouped[date].map((e, idx) => (
            <div key={idx} style={{ paddingLeft: '1rem' }}>
              {e.type === 'income' ? '💰' : '🧾'} ₹{e.amount.toLocaleString()} — {e.note || ''}
              {e.type === 'expense' && e.receipt_url && (
                <>
                  {' '}
                  | <a
                    href={`https://kqqzwptkpljqosgtbtlb.supabase.co/storage/v1/object/public/receipts/${e.receipt_url}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📎 View Receipt
                  </a>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
