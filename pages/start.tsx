import Link from 'next/link';

export default function Start() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">👋 Welcome to Family Finance Tracker</h1>
      <p className="mb-6 text-gray-600">Choose your next action:</p>

      <div className="space-y-4">
        <Link href="/trackers">
          <div className="p-4 rounded-xl shadow bg-white cursor-pointer hover:bg-gray-100 transition">
            📂 View My Trackers
          </div>
        </Link>

        <Link href="/invite">
          <div className="p-4 rounded-xl shadow bg-white cursor-pointer hover:bg-gray-100 transition">
            🔗 Join Existing Tracker
          </div>
        </Link>

        <Link href="/create-tracker">
          <div className="p-4 rounded-xl shadow bg-white cursor-pointer hover:bg-gray-100 transition">
            🆕 Create New Tracker
          </div>
        </Link>
      </div>
    </div>
  );
}
