import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AddForm from '../components/AddForm';
import Charts from '../components/Charts';
import Trends from '../components/Trends';
import ExportData from '../components/ExportData';
import Comments from '../components/Comments';
import Reminders from '../components/Reminders';
import CalendarView from '../components/CalendarView';
import BottomNavBar from '../components/BottomNavBar';
import OverviewCard from '../components/OverviewCard';
import GoalProgress from '../components/GoalProgress';
import { useActiveTracker } from '../lib/useActiveTracker';

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
      <div className="p-6">
        ⚠️ No tracker selected. Go to <Link href="/trackers" className="text-blue-500 underline">Trackers</Link> to select one.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">📊 Family Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/settings">
            <button className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">⚙️ Settings</button>
          </Link>
          <button onClick={handleLogout} className="px-3 py-2 bg-red-200 rounded hover:bg-red-300 transition">
            🚪 Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <OverviewCard title="Income" value={`₹${income.toLocaleString()}`} emoji="💰" />
        <OverviewCard title="Expenses" value={`₹${expenses.toLocaleString()}`} emoji="🧾" />
        <OverviewCard title="Net Worth" value={`₹${netWorth.toLocaleString()}`} emoji="💼" />
        <GoalProgress title={goal.title} saved={goal.saved_amount} target={goal.target_amount} />
      </main>

      <div className="container mx-auto px-4 mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          {showForm ? '❌ Close Form' : '➕ Add New Entry'}
        </button>
        {showForm && <AddForm />}
      </div>

      <section className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Reminders />
        <CalendarView />
        <Charts />
        <Trends />
        <Comments />
        <ExportData />
      </section>

      <BottomNavBar />
    </div>
  );
}
