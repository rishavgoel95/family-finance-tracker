import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useActiveTracker } from '../lib/useActiveTracker';

export default function CategoriesPage() {
  const { trackerId } = useActiveTracker();
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [emoji, setEmoji] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      if (!trackerId) return;
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('profile_id', trackerId)
        .order('created_at', { ascending: true });
      setCategories(data || []);
    };

    fetchCategories();
  }, [trackerId]);

  const handleAdd = async () => {
    if (!newCat || !trackerId) return;
    const { error } = await supabase.from('categories').insert({
      profile_id: trackerId,
      name: newCat,
      emoji,
    });
    if (!error) {
      setNewCat('');
      setEmoji('');
      alert('Category added!');
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('categories').delete().eq('id', id);
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🗂 Manage Categories</h1>
      <div>
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

      <ul style={{ marginTop: '1rem' }}>
        {categories.map((cat) => (
          <li key={cat.id} style={{ marginBottom: '0.5rem' }}>
            {cat.emoji || '🟦'} {cat.name}
            <button onClick={() => handleDelete(cat.id)} style={{ marginLeft: '1rem' }}>
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
