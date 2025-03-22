import { useState } from 'react';
import { supabase } from '../lib/supabase';
import * as XLSX from 'xlsx';

export default function ExportData() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const trackerId = localStorage.getItem('activeTracker');
    if (!trackerId) {
      alert('Please select a tracker first.');
      return;
    }

    const tables = ['income', 'expenses', 'goals', 'investments'];
    const allData: any = {};

    for (const table of tables) {
      const { data } = await supabase
        .from(table)
        .select('*')
        .eq('profile_id', trackerId);
      allData[table] = data || [];
    }

    const wb = XLSX.utils.book_new();
    tables.forEach((table) => {
      const ws = XLSX.utils.json_to_sheet(allData[table]);
      XLSX.utils.book_append_sheet(wb, ws, table);
    });

    XLSX.writeFile(wb, 'finance_export.xlsx');
    setLoading(false);
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
