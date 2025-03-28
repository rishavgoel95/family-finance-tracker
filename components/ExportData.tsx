import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useActiveTracker } from '../lib/useActiveTracker';

export default function ExportData() {
  const { trackerId } = useActiveTracker();
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user || !trackerId) {
      alert('No user or tracker selected');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracker_id: trackerId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to export');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'finance_export.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Export failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📤 Export Your Data</h2>
      <button onClick={handleExport} disabled={loading} style={{ padding: '0.5rem 1rem' }}>
        {loading ? 'Exporting...' : 'Export to Excel'}
      </button>
    </div>
  );
}
