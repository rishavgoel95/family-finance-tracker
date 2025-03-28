import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useActiveTracker } from '../lib/useActiveTracker';

export default function CategoriesPage() {
  const { trackerId } = useActiveTracker();
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [emoji, setEmoji] = useState('');

  const fetchCategories = async () => {
    if (!trackerId) return;

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tracker_id: trackerId }),
    });

    const getRes = await fetch('/api/categories', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tracker_id: trackerId }),
    });

    const data = await getRes.json();
    if (getRes.ok) {
      setCategories(data);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [trackerId]);

  const handleAdd = async () => {
    if (!newCat || !trackerId) return;

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tracker_id: trackerId, name: newCat, emoji }),
    });

    if (res.ok) {
      setNewCat('');
      setEmoji('');
      fetchCategories();
      alert('Category added!');
    } else {
      const err = await res.json();
      alert('Error: ' + err.error);
    }
  };

  const handleDelete = async (id: string) => {
    // optional: secure delete route later
    alert('Deleting via API not implemented yet.');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🗂 Manage Categories</h1>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Category name"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
        />
        <input
          type="text"
          placeholder="Emoji (optional)"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          style={{ marginLeft: '0.5rem', width: '4rem' }}
        />
        <button onClick={handleAdd} style={{ marginLeft: '0.5rem' }}>
          Add
        </button>
      </div>

      <ul>
        {categories.map((cat) => (
          <li key={cat.id} style={{ marginBottom: '0.5rem' }}>
            {cat.emoji || '🟦'} {cat.name}
            <button
              onClick={() => handleDelete(cat.id)}
              style={{ marginLeft: '1rem' }}
            >
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
