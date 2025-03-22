import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [goal, setGoal] = useState({ title: '', target_amount: 0, saved_amount: 0 });
  const [netWorth, setNetWorth] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('profile_id')
        .eq('user_id', user.id)
        .single();

      if (!profileData) return;

      const profile_id = profileData.profile_id;

      const { data: incomeData } = await supabase
        .from('income')
        .select('amount')
        .eq('profile_id', profile_id);

      const { data: expenseData } = await supabase
        .from('expenses')
        .select('amount')
        .eq('profile_id', profile_id);

      const { data: goalData } = await supabase
        .from('goals')
        .select('*')
        .eq('profile_id', profile_id)
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
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>📊 Family Dashboard</h1>
      <div style={{ marginBottom: '1rem' }}>💰 <strong>Income:</strong> ₹{income.toLocaleString()}</div>
      <div style={{ marginBottom: '1rem' }}>🧾 <strong>Expenses:</strong> ₹{expenses.toLocaleString()}</div>
      <div style={{ marginBottom: '1rem' }}>🏁 <strong>Goal:</strong> {goal.title} – {Math.round((goal.saved_amount / goal.target_amount) * 100 || 0)}% complete</div>
      <div style={{ marginBottom: '1rem' }}>💼 <strong>Net Worth:</strong> ₹{netWorth.toLocaleString()}</div>
    </div>
  );
}
