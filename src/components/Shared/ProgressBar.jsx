// src/components/Shared/ProgressBar.jsx
import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  colorClass = 'bg-emerald-500',
  height = 'h-2',
  showPercent = false,
  className = ''
}) {
  const percentage = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  const isOver = value > max;

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} transition-all duration-500 ease-out rounded-full ${
            isOver ? 'bg-amber-500' : colorClass
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercent && (
        <span className="text-xs text-slate-400 font-mono mt-1 inline-block">
          {percentage}%
        </span>
      )}
    </div>
  );
}
