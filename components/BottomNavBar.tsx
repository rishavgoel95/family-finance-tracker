import Link from 'next/link';
import { useRouter } from 'next/router';

export default function BottomNavBar() {
  const router = useRouter();
  const active = 'text-blue-600';
  const inactive = 'text-gray-500';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t border-gray-200 flex justify-around py-3">
      <Link href="/dashboard">
        <button className={`flex flex-col items-center ${router.pathname === '/dashboard' ? active : inactive}`}>
          📊<span className="text-xs">Dashboard</span>
        </button>
      </Link>
      <Link href="/calendar">
        <button className={`flex flex-col items-center ${router.pathname === '/calendar' ? active : inactive}`}>
          📅<span className="text-xs">Calendar</span>
        </button>
      </Link>
      <Link href="/reminders">
        <button className={`flex flex-col items-center ${router.pathname === '/reminders' ? active : inactive}`}>
          ⏰<span className="text-xs">Reminders</span>
        </button>
      </Link>
      <Link href="/categories">
        <button className={`flex flex-col items-center ${router.pathname === '/categories' ? active : inactive}`}>
          🗂️<span className="text-xs">Categories</span>
        </button>
      </Link>
      <Link href="/settings">
        <button className={`flex flex-col items-center ${router.pathname === '/settings' ? active : inactive}`}>
          ⚙️<span className="text-xs">Settings</span>
        </button>
      </Link>
    </nav>
  );
}
