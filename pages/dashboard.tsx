import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AddForm from '../components/AddForm';
import Charts from '../components/Charts';
import Trends from '../components/Trends';
import ExportData from '../components/ExportData';
import Reminders from '../components/Reminders';
import CalendarView from '../components/CalendarView';
import { useActiveTracker } from '../lib/useActiveTracker';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Dashboard() {
  const { trackerId } = useActiveTracker();
  const router = useRouter();
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [goal, setGoal] = useState({ title: '', target_amount: 0, saved_amount: 0 });
  const [netWorth, setNetWorth] = useState(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user || !trackerId) return;

      const { data: incomeData } = await supabase
        .from('income')
        .select('amount')
        .eq('profile_id', trackerId);

      const { data: expenseData } = await supabase
        .from('expenses')
        .select('amount')
        .eq('profile_id', trackerId);

      const { data: goalData } = await supabase
        .from('goals')
        .select('*')
        .eq('profile_id', trackerId)
        .limit(1)
        .single();

      const incomeTotal = incomeData?.reduce((acc, item) => acc + Number(item.amount), 0) || 0;
      const expenseTotal = expenseData?.reduce((acc, item) => acc + Number(item.amount), 0) || 0;
      const saved = goalData?.saved_amount || 0;

      setIncome(incomeTotal);
      setExpenses(expenseTotal);
      setGoal(goalData || { title: '', target_amount: 0, saved_amount: 0 });
      setNetWorth(incomeTotal - expenseTotal + saved);
    };

    fetchData();
  }, [showForm, trackerId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('activeTracker');
    router.push('/');
  };

  if (!trackerId)
    return <p style={{ padding: '2rem' }}>⚠️ No tracker selected. Go to <Link href="/trackers">/trackers</Link> to select one.</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.8rem' }}>📊 Family Dashboard</h1>
        <div>
          <Link href="/settings">
            <button style={{ marginRight: '1rem' }}>⚙️ Settings</button>
          </Link>
          <button onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>💰 <strong>Income:</strong> ₹{income.toLocaleString()}</div>
      <div style={{ marginBottom: '1rem' }}>🧾 <strong>Expenses:</strong> ₹{expenses.toLocaleString()}</div>
      <div style={{ marginBottom: '1rem' }}>🏁 <strong>Goal:</strong> {goal.title} – {Math.round((goal.saved_amount / goal.target_amount) * 100 || 0)}% complete</div>
      <div style={{ marginBottom: '1rem' }}>💼 <strong>Net Worth:</strong> ₹{netWorth.toLocaleString()}</div>

      <button onClick={() => setShowForm(!showForm)} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
        {showForm ? 'Close' : '➕ Add New Entry'}
      </button>

      {showForm && <AddForm />}
      <Reminders />
      <CalendarView />
<Charts />
      <Trends />
      <ExportData />
    </div>
  );
}
