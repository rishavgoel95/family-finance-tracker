// components/Layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';
import { Home, Calendar, Settings, LogOut, Folder } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <nav className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center p-4">
          <div className="text-xl font-bold">ShigoTrish Finance</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <main className="flex-grow container mx-auto p-4">{children}</main>

      <footer className="fixed bottom-0 w-full bg-white shadow-t">
        <div className="flex justify-around max-w-4xl mx-auto py-2">
          <Link href="/start">
            <div className="flex flex-col items-center text-sm">
              <Home size={20} /> Home
            </div>
          </Link>
          <Link href="/dashboard">
            <div className="flex flex-col items-center text-sm">
              <Folder size={20} /> Dashboard
            </div>
          </Link>
          <Link href="/calendar">
            <div className="flex flex-col items-center text-sm">
              <Calendar size={20} /> Calendar
            </div>
          </Link>
          <Link href="/settings">
            <div className="flex flex-col items-center text-sm">
              <Settings size={20} /> Settings
            </div>
          </Link>
        </div>
      </footer>
    </div>
  );
}
