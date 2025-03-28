import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AddForm from '../components/AddForm';
import Charts from '../components/Charts';
import Trends from '../components/Trends';
import ExportData from '../components/ExportData';
import Comments from '../components/Comments';
import Reminders from '../components/Reminders';
import CalendarView from '../components/CalendarView';
import OverviewCard from '../components/OverviewCard';
import GoalProgress from '../components/GoalProgress';
import BottomNavBar from '../components/BottomNavBar';
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

      const [{ data: incomeData }, { data: expenseData }, { data: goalData }] = await Promise.all([
        supabase.from('income').select('amount').eq('profile_id', trackerId),
        supabase.from('expenses').select('amount').eq('profile_id', trackerId),
        supabase.from('goals').select('*').eq('profile_id', trackerId).limit(1).single(),
      ]);

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
    return <p className="p-6">⚠️ No tracker selected. Go to <Link href="/trackers" className="text-blue-500">/trackers</Link> to select one.</p>;

  return (
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📊 Family Dashboard</h1>
        <div>
          <Link href="/settings">
            <button className="px-4 py-2 bg-gray-200 rounded-lg mr-2">⚙️ Settings</button>
          </Link>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <OverviewCard title="Income" amount={income} icon="💰" color="bg-green-100" />
        <OverviewCard title="Expenses" amount={expenses} icon="🧾" color="bg-red-100" />
        <OverviewCard title="Net Worth" amount={netWorth} icon="💼" color="bg-blue-100" />
      </div>

      <GoalProgress title={goal.title} savedAmount={goal.saved_amount} targetAmount={goal.target_amount} />

      <button onClick={() => setShowForm(!showForm)} className="my-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
        {showForm ? 'Close' : '➕ Add New Entry'}
      </button>
      {showForm && <AddForm />}

      <div className="space-y-4">
        <Charts />
        <CalendarView />
        <Reminders />
        <Comments />
        <Trends />
        <ExportData />
      </div>

      <BottomNavBar />
    </div>
  );
}
