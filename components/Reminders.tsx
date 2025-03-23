import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useActiveTracker } from '../lib/useActiveTracker';

export default function Reminders() {
  const { trackerId } = useActiveTracker();
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    const fetchReminders = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user || !trackerId) return;

      const { data } = await supabase
        .from('reminders')
        .select('*')
        .eq('profile_id', trackerId)
        .gte('due_date', new Date().toISOString().split('T')[0])
        .order('due_date', { ascending: true });

      setReminders(data || []);
    };

    fetchReminders();
  }, [trackerId]);

  const handleAddReminder = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user || !trackerId || !title || !dueDate) return;

    const { error } = await supabase.from('reminders').insert({
      profile_id: trackerId,
      user_id: user.id,
      title,
      due_date: dueDate,
    });

    if (!error) {
      setTitle('');
      setDueDate('');
      alert('Reminder added!');
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>⏰ Upcoming Reminders</h2>
      {reminders.map((r) => (
        <div key={r.id} style={{ marginBottom: '0.5rem' }}>
          📌 <strong>{r.title}</strong> — due on {r.due_date}
        </div>
      ))}
      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Reminder title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={handleAddReminder} style={{ marginLeft: '0.5rem' }}>
          Add
        </button>
      </div>
    </div>
  );
}
