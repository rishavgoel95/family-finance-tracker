import React from 'react';

export interface OverviewCardProps {
  title: string;
  value: string;
  emoji?: string;
}

export default function OverviewCard({ title, value, emoji = '📌' }: OverviewCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-2xl">{emoji}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
