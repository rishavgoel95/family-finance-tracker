// ✅ File: components/AddForm.tsx

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AddForm() {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('profile_id')
      .eq('user_id', user.id)
      .single();

    const profile_id = profileData?.profile_id;

    if (!profile_id) return;

    const table = type === 'expense' ? 'expenses' : type === 'income' ? 'income' : 'goals';

    const payload: any = {
      profile_id,
      user_id: user.id,
      amount: parseFloat(amount),
      note,
      date: new Date().toISOString().split('T')[0],
    };

    if (type === 'goals') {
      payload.title = note;
      payload.target_amount = parseFloat(amount);
      payload.saved_amount = 0;
    }

    const { error } = await supabase.from(table).insert([payload]);

    if (error) alert('Error saving data: ' + error.message);
    else alert('Saved!');
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <select value={type} onChange={(e) => setType(e.target.value)} style={{ marginBottom: '0.5rem' }}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
        <option value="goals">Goal</option>
      </select>
      <br />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder={type === 'goals' ? 'Goal Title' : 'Note'}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
