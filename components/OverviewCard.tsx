interface OverviewCardProps {
  title: string;
  amount: number;
  icon: string;
  color?: string;
}

export default function OverviewCard({ title, amount, icon, color = 'bg-blue-100' }: OverviewCardProps) {
  return (
    <div className={`flex items-center p-4 rounded-2xl shadow-md ${color}`}>
      <span className="text-3xl mr-4">{icon}</span>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xl font-bold">₹{amount.toLocaleString()}</p>
      </div>
    </div>
  );
}
