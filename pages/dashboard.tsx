import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AddForm from '../components/AddForm';
import Charts from '../components/Charts';
import Trends from '../components/Trends';
import ExportData from '../components/ExportData';
import Comments from '../components/Comments';
import Reminders from '../components/Reminders';
import CalendarView from '../components/CalendarView';
import GoalProgress from '../components/GoalProgress';
import BottomNavBar from '../components/BottomNavBar';
import OverviewCard from '../components/OverviewCard';
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
    return <p className="p-8">⚠️ No tracker selected. Go to <Link href="/trackers" className="text-indigo-500 underline">/trackers</Link> to select one.</p>;

  return (
    <div className="bg-gray-100 min-h-screen pb-24">
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📊 Family Dashboard</h1>
          <div>
            <Link href="/settings">
              <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition">⚙️ Settings</button>
            </Link>
            <button onClick={handleLogout} className="ml-2 bg-red-500 text-white py-2 px-4 rounded-lg shadow hover:bg-red-600 transition">🚪 Logout</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <OverviewCard title="💰 Income" amount={income} color="green" />
          <OverviewCard title="🧾 Expenses" amount={expenses} color="red" />
          <OverviewCard title="💼 Net Worth" amount={netWorth} color="blue" />
        </div>

        <GoalProgress goal={goal} />

        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-600 transition"
        >
          {showForm ? 'Close' : '➕ Add New Entry'}
        </button>

        {showForm && <AddForm />}

        <section className="my-6">
          <Charts />
        </section>

        <section className="my-6">
          <Trends />
        </section>

        <section className="my-6">
          <CalendarView />
        </section>

        <section className="my-6">
          <Reminders />
        </section>

        <section className="my-6">
          <Comments />
        </section>

        <section className="my-6">
          <ExportData />
        </section>
      </div>

      <BottomNavBar />
    </div>
  );
}
