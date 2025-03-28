import React from 'react';

interface GoalProgressProps {
  title: string;
  saved: number;
  target: number;
}

export default function GoalProgress({ title, saved, target }: GoalProgressProps) {
  const percentage = Math.min(Math.round((saved / target) * 100), 100);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">🎯 {title}</h2>
      <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-green-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-2 text-gray-600">
        {percentage}% ({`₹${saved.toLocaleString()} of ₹${target.toLocaleString()}`})
      </p>
    </div>
  );
}
