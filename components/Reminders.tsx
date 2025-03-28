import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useActiveTracker } from '../lib/useActiveTracker';

export default function Reminders() {
  const { trackerId } = useActiveTracker();
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const fetchReminders = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user || !trackerId) return;

    const res = await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tracker_id: trackerId, user_id: user.id }),
    });

    const getRes = await fetch('/api/reminders', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tracker_id: trackerId, user_id: user.id }),
    });

    const data = await getRes.json();
    if (getRes.ok) {
      setReminders(data);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [trackerId]);

  const handleAddReminder = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user || !trackerId || !title || !dueDate) return;

    const res = await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tracker_id: trackerId,
        user_id: user.id,
        title,
        due_date: dueDate,
      }),
    });

    if (res.ok) {
      setTitle('');
      setDueDate('');
      await fetchReminders();
      alert('Reminder added!');
    } else {
      const err = await res.json();
      alert('Error: ' + err.error);
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
