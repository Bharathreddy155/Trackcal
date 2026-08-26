// src/components/Dashboard/MacroCards.jsx
import React from 'react';
import ProgressBar from '../Shared/ProgressBar';

export default function MacroCards({ consumed = {}, targets = {} }) {
  const macros = [
    {
      id: 'protein',
      label: 'Protein',
      icon: '🥩',
      consumed: consumed.protein || 0,
      target: targets.protein || 105,
      unit: 'g',
      color: 'bg-emerald-500',
      badgeColor: 'text-emerald-700 border-emerald-200 bg-emerald-50',
      borderHover: 'hover:border-emerald-300'
    },
    {
      id: 'carbs',
      label: 'Carbs',
      icon: '🌾',
      consumed: consumed.carbs || 0,
      target: targets.carbs || 395,
      unit: 'g',
      color: 'bg-cyan-500',
      badgeColor: 'text-cyan-700 border-cyan-200 bg-cyan-50',
      borderHover: 'hover:border-cyan-300'
    },
    {
      id: 'fat',
      label: 'Fat',
      icon: '🥑',
      consumed: consumed.fat || 0,
      target: targets.fat || 77,
      unit: 'g',
      color: 'bg-amber-500',
      badgeColor: 'text-amber-700 border-amber-200 bg-amber-50',
      borderHover: 'hover:border-amber-300'
    },
    {
      id: 'fiber',
      label: 'Fiber',
      icon: '🥬',
      consumed: consumed.fiber || 0,
      target: targets.fiber || 33,
      unit: 'g',
      color: 'bg-violet-500',
      badgeColor: 'text-violet-700 border-violet-200 bg-violet-50',
      borderHover: 'hover:border-violet-300'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {macros.map((m) => {
        const remaining = Math.max(0, m.target - m.consumed);
        const percent = m.target > 0 ? Math.min(Math.round((m.consumed / m.target) * 100), 100) : 0;
        
        let statusText = 'On Target';
        if (m.consumed === 0) statusText = 'Not Started';
        else if (m.consumed < m.target * 0.8) statusText = 'Slightly Below';
        else if (m.consumed > m.target * 1.1) statusText = 'Above Target';

        return (
          <div
            key={m.id}
            className={`glass-panel p-4 rounded-2xl border border-slate-200 transition-all ${m.borderHover} flex flex-col justify-between`}
          >
            <div>
              {/* Header Icon + Label */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{m.icon}</span>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{m.label}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${m.badgeColor}`}>
                  {statusText}
                </span>
              </div>

              {/* Values */}
              <div className="flex items-baseline justify-between mt-2">
                <div className="text-xl font-black text-slate-900 font-mono">
                  {m.consumed} <span className="text-xs text-slate-400 font-normal">/ {m.target} {m.unit}</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 mt-1 font-mono">
                {remaining > 0 ? `${remaining.toFixed(1)} ${m.unit} remaining` : 'Target met 🎉'}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <ProgressBar
                value={m.consumed}
                max={m.target}
                colorClass={m.color}
                height="h-1.5"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
