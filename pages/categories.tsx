import { useEffect, useState } from 'react';
import { useActiveTracker } from '../lib/useActiveTracker';
import BottomNavBar from '../components/BottomNavBar';

export default function CategoriesPage() {
  const { trackerId } = useActiveTracker();
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [emoji, setEmoji] = useState('');

  const fetchCategories = async () => {
    if (!trackerId) return;

    const res = await fetch('/api/categories', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'tracker-id': trackerId },
    });

    if (res.ok) {
      const data = await res.json();
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
    const res = await fetch('/api/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tracker_id: trackerId, category_id: id }),
    });

    if (res.ok) {
      fetchCategories();
      alert('Category deleted!');
    } else {
      const err = await res.json();
      alert('Error: ' + err.error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-20 font-sans">
      <h1 className="text-2xl font-bold mb-4">🗂 Manage Categories</h1>

      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Category name"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          className="p-2 border rounded flex-grow"
        />
        <input
          type="text"
          placeholder="Emoji"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          className="p-2 border rounded ml-2 w-20"
        />
        <button onClick={handleAdd} className="ml-2 bg-blue-500 text-white rounded px-4 py-2">
          Add
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <span className="flex items-center space-x-2">
              <span className="text-xl">{cat.emoji || '📌'}</span>
              <span>{cat.name}</span>
            </span>
            <button
              onClick={() => handleDelete(cat.id)}
              className="text-red-500 hover:text-red-700 transition"
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      <BottomNavBar />
    </div>
  );
}
