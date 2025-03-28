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
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

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

  const filteredEntries = entries.filter(entry =>
    entry.date.startsWith(selectedMonth)
  );

  const grouped = filteredEntries.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);

  const toggleDate = (date: string) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📅 Calendar View</h2>

      <label style={{ marginBottom: '1rem', display: 'block' }}>
        📆 Select Month:{' '}
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </label>

      {Object.keys(grouped).map(date => {
        const dailyIncome = grouped[date]
          .filter(e => e.type === 'income')
          .reduce((sum, e) => sum + e.amount, 0);
        const dailyExpense = grouped[date]
          .filter(e => e.type === 'expense')
          .reduce((sum, e) => sum + e.amount, 0);

        return (
          <div key={date} style={{ marginBottom: '1rem' }}>
            <strong
              onClick={() => toggleDate(date)}
              style={{
                cursor: 'pointer',
                color: '#0070f3',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>
                {expandedDates[date] ? '▼' : '▶'} {date}
              </span>
              <span>
                💰 ₹{dailyIncome.toLocaleString()} | 🧾 ₹{dailyExpense.toLocaleString()}
              </span>
            </strong>

            {expandedDates[date] && (
              <div style={{ marginTop: '0.5rem' }}>
                {grouped[date].map((e, idx) => (
                  <div key={idx} style={{ paddingLeft: '1.5rem' }}>
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
            )}
          </div>
        );
      })}
    </div>
  );
}
