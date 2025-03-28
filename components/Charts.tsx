import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import { useActiveTracker } from '../lib/useActiveTracker';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#8dd1e1'];

export default function Charts() {
  const { trackerId } = useActiveTracker();
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user || !trackerId) return;

      const [expensesRes, incomeRes] = await Promise.all([
        supabase.from('expenses').select('amount, category, date').eq('profile_id', trackerId),
        supabase.from('income').select('amount, date').eq('profile_id', trackerId),
      ]);

      const expenses = expensesRes.data || [];
      const income = incomeRes.data || [];

      // 📊 Group by category (for Pie Chart)
      const categoryMap: any = {};
      expenses.forEach((e) => {
        categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount);
      });

      const pieData = Object.keys(categoryMap).map((cat) => ({
        name: cat || 'Other',
        value: categoryMap[cat],
      }));

      // 📈 Group by month (for Bar/Line Chart)
      const trendMap: Record<string, { month: string; income: number; expense: number }> = {};

      expenses.forEach((e) => {
        const month = e.date.slice(0, 7);
        if (!trendMap[month]) trendMap[month] = { month, income: 0, expense: 0 };
        trendMap[month].expense += Number(e.amount);
      });

      income.forEach((i) => {
        const month = i.date.slice(0, 7);
        if (!trendMap[month]) trendMap[month] = { month, income: 0, expense: 0 };
        trendMap[month].income += Number(i.amount);
      });

      const barData = Object.values(trendMap).sort((a, b) => a.month.localeCompare(b.month));

      setCategoryData(pieData);
      setMonthlyData(barData);
    };

    fetchData();
  }, [trackerId]);

  return (
    <div style={{ marginTop: '3rem' }}>
      <h2>📊 Category Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={100} label>
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: '3rem' }}>📈 Income vs Expenses (Monthly)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#82ca9d" />
          <Bar dataKey="expense" fill="#ff8042" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
