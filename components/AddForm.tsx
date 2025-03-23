import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useActiveTracker } from '../lib/useActiveTracker';
import imageCompression from 'browser-image-compression';

export default function AddForm() {
  const { trackerId } = useActiveTracker();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [categories, setCategories] = useState<{ name: string; emoji: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!trackerId) return;
      const { data } = await supabase
        .from('categories')
        .select('name, emoji')
        .eq('profile_id', trackerId);
      if (data) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    };

    fetchCategories();
  }, [trackerId]);

  const handleSubmit = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user || !trackerId || !amount) return;

    const table = type === 'expense' ? 'expenses' : type === 'income' ? 'income' : 'goals';

    const payload: any = {
      profile_id: trackerId,
      user_id: user.id,
      amount: parseFloat(amount),
      note,
      date: new Date().toISOString().split('T')[0],
    };

    if (type === 'expense') {
      payload.category = category;

      if (receipt) {
        try {
          const compressed = await imageCompression(receipt, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
          });

          const filePath = `receipts/${Date.now()}_${compressed.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('receipts')
            .upload(filePath, compressed);

          if (!uploadError && uploadData?.path) {
            payload.receipt_url = uploadData.path;
          } else {
            alert('Receipt upload failed: ' + uploadError?.message);
          }
        } catch (err) {
          console.error('Compression error:', err);
          alert('Image compression failed.');
        }
      }
    }

    if (type === 'goals') {
      payload.title = note;
      payload.target_amount = parseFloat(amount);
      payload.saved_amount = 0;
    }

    const { error } = await supabase.from(table).insert([payload]);
    if (error) {
      alert('Error saving data: ' + error.message);
    } else {
      alert('Saved!');
      setAmount('');
      setNote('');
      setCategory('');
      setReceipt(null);
    }
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

      {type === 'expense' && (
        <>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ marginTop: '0.5rem' }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.emoji || '🟦'} {cat.name}
              </option>
            ))}
          </select>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setReceipt(e.target.files?.[0] || null)}
            style={{ marginTop: '0.5rem' }}
          />
        </>
      )}

      <br />
      <button onClick={handleSubmit} style={{ marginTop: '1rem' }}>
        Submit
      </button>
    </div>
  );
}
