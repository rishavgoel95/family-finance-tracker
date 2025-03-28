import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AddForm from '../components/AddForm';
import Charts from '../components/Charts';
import Trends from '../components/Trends';
import ExportData from '../components/ExportData';
import Comments from '../components/Comments';
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
    return (
      <div className="p-4">
        <p className="text-center text-red-500">⚠️ No tracker selected. Go to <Link href="/trackers" className="underline">Trackers</Link> to select one.</p>
      </div>
    );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📊 Family Dashboard</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link href="/settings">
            <button className="bg-gray-200 hover:bg-gray-300 rounded-lg px-4 py-2">⚙️ Settings</button>
          </Link>
          <button onClick={handleLogout} className="bg-red-400 hover:bg-red-500 text-white rounded-lg px-4 py-2">🚪 Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <div className="text-xl font-semibold">💰 Income</div>
          <div className="text-2xl font-bold">₹{income.toLocaleString()}</div>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow">
          <div className="text-xl font-semibold">🧾 Expenses</div>
          <div className="text-2xl font-bold">₹{expenses.toLocaleString()}</div>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <div className="text-xl font-semibold">🏁 Goal: {goal.title}</div>
          <div className="text-2xl font-bold">{Math.round((goal.saved_amount / goal.target_amount) * 100 || 0)}% complete</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <div className="text-xl font-semibold">💼 Net Worth</div>
          <div className="text-2xl font-bold">₹{netWorth.toLocaleString()}</div>
        </div>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2"
      >
        {showForm ? 'Close Form' : '➕ Add New Entry'}
      </button>

      {showForm && <AddForm />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Charts />
        <CalendarView />
        <Trends />
        <Reminders />
        <Comments />
        <ExportData />
      </div>
    </div>
  );
}
