import Link from 'next/link';

export default function Start() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">👋 Welcome!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/trackers">
          <div className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition">
            <h2 className="text-xl">📂 View My Trackers</h2>
            <p className="mt-2 text-gray-500">Manage your existing finance trackers.</p>
          </div>
        </Link>

        <Link href="/invite">
          <div className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition">
            <h2 className="text-xl">🔗 Join a Tracker</h2>
            <p className="mt-2 text-gray-500">Join a family member’s or friend's tracker using their invite code.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
