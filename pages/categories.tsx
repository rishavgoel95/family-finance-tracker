import { useEffect, useState } from 'react';
import { useActiveTracker } from '../lib/useActiveTracker';

export default function CategoriesPage() {
  const { trackerId } = useActiveTracker();
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [emoji, setEmoji] = useState('');

  const fetchCategories = async () => {
    const res = await fetch('/api/categories', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) setCategories(await res.json());
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
    } else {
      alert('Could not add category.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">🗂 Manage Categories</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="New Category"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        <input
          type="text"
          placeholder="Emoji"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          className="border rounded px-3 py-2 w-24"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-lg p-3 shadow flex justify-between items-center">
            <span>{cat.emoji || '🟦'} {cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
