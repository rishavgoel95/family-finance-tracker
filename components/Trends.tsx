// ✅ File: components/Trends.tsx

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

export default function Trends() {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('profile_id')
        .eq('user_id', user.id)
        .single();

      const profile_id = profileData?.profile_id;
      if (!profile_id) return;

      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount, category, date')
        .eq('profile_id', profile_id);

      const { data: income } = await supabase
        .from('income')
        .select('amount, date')
        .eq('profile_id', profile_id);

      const categoryMap: any = {};
      const trendMap: any = {};

      expenses?.forEach((exp) => {
        categoryMap[exp.category] = (categoryMap[exp.category] || 0) + Number(exp.amount);
        const month = exp.date.slice(0, 7);
        if (!trendMap[month]) trendMap[month] = { month, income: 0, expense: 0 };
        trendMap[month].expense += Number(exp.amount);
      });

      income?.forEach((inc) => {
        const month = inc.date.slice(0, 7);
        if (!trendMap[month]) trendMap[month] = { month, income: 0, expense: 0 };
        trendMap[month].income += Number(inc.amount);
      });

      setCategoryData(Object.keys(categoryMap).map((cat) => ({ name: cat, value: categoryMap[cat] })));
      setMonthlyData(Object.values(trendMap).sort((a: any, b: any) => a.month.localeCompare(b.month)));
    };

    fetchData();
  }, []);

  return (
    <div style={{ marginTop: '3rem' }}>
      <h2>📊 Expense Breakdown by Category</h2>
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

      <h2 style={{ marginTop: '2rem' }}>📈 Income vs Expenses (Monthly)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#82ca9d" />
          <Line type="monotone" dataKey="expense" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
