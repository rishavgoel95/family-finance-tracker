import Link from 'next/link';
import BottomNavBar from '../components/BottomNavBar';

export default function Start() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <div className="container mx-auto px-4 pt-12">
        <h1 className="text-3xl font-bold mb-2">👋 Welcome!</h1>
        <p className="mb-8 text-gray-600">Let's get started—choose an option below:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/trackers">
            <div className="bg-white shadow-lg rounded-xl p-6 hover:bg-blue-50 cursor-pointer transition">
              <h2 className="text-2xl">📂 View My Trackers</h2>
              <p className="text-gray-500">Manage and view your trackers</p>
            </div>
          </Link>

          <Link href="/invite">
            <div className="bg-white shadow-lg rounded-xl p-6 hover:bg-green-50 cursor-pointer transition">
              <h2 className="text-2xl">🔗 Join a Tracker</h2>
              <p className="text-gray-500">Use an invite code to join</p>
            </div>
          </Link>

          <Link href="/create-tracker">
            <div className="bg-white shadow-lg rounded-xl p-6 hover:bg-purple-50 cursor-pointer transition">
              <h2 className="text-2xl">🆕 Create Tracker</h2>
              <p className="text-gray-500">Start a new tracker instantly</p>
            </div>
          </Link>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
}
