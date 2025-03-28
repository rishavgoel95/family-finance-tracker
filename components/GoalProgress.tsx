interface GoalProgressProps {
  title: string;
  savedAmount: number;
  targetAmount: number;
}

export default function GoalProgress({ title, savedAmount, targetAmount }: GoalProgressProps) {
  const percentage = Math.min((savedAmount / targetAmount) * 100, 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <h3 className="text-md font-semibold mb-2">{title}</h3>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div className="bg-green-400 h-2.5 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
      </div>
      <div className="text-sm text-gray-600">{percentage}% completed</div>
      <div className="text-sm text-gray-600">₹{savedAmount.toLocaleString()} / ₹{targetAmount.toLocaleString()}</div>
    </div>
  );
}
