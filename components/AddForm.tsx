import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { useActiveTracker } from '../lib/useActiveTracker';

export default function AddForm() {
  const { trackerId } = useActiveTracker();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!trackerId || !amount || !category) return;

    let receipt_url = null;

    if (receipt) {
      const compressed = await imageCompression(receipt, { maxSizeMB: 0.5 });
      const formData = new FormData();
      formData.append('file', compressed);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        receipt_url = uploadData.url;
      } else {
        alert('Failed to upload receipt');
        return;
      }
    }

    const res = await fetch('/api/entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tracker_id: trackerId, amount, category, note, receipt_url }),
    });

    if (res.ok) {
      alert('Entry added successfully!');
      setAmount('');
      setCategory('');
      setNote('');
      setReceipt(null);
    } else {
      alert('Failed to add entry.');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow my-4">
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border rounded px-3 py-2 mb-2 w-full"
      />
      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded px-3 py-2 mb-2 w-full"
      />
      <input
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="border rounded px-3 py-2 mb-2 w-full"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setReceipt(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        ✅ Submit
      </button>
    </div>
  );
}
