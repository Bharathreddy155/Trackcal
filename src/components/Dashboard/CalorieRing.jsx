// src/components/Dashboard/CalorieRing.jsx
import React from 'react';
import { Flame, AlertTriangle, CheckCircle } from 'lucide-react';

export default function CalorieRing({ consumed = 0, target = 2725, minTarget = 2700, maxTarget = 2750 }) {
  const remaining = Math.max(0, target - consumed);
  const percentage = target > 0 ? Math.min(Math.round((consumed / target) * 100), 100) : 0;
  
  // Warning flag if intake is significantly lower or higher
  const isBelowMin = consumed > 0 && consumed < minTarget - 300;
  const isAboveMax = consumed > maxTarget + 250;
  const isOnTrack = consumed >= minTarget - 100 && consumed <= maxTarget + 100;

  // SVG Circular Constants
  const radius = 64;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* SVG Donut Ring */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="w-44 h-44 transform -rotate-90">
          {/* Track */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            className="stroke-slate-200"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            className={`transition-all duration-700 ease-out ${
              isAboveMax ? 'stroke-amber-500' : 'stroke-indigo-500'
            }`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Flame className={`w-6 h-6 mb-1 ${isAboveMax ? 'text-amber-500 animate-pulse' : 'text-indigo-500'}`} />
          <div className="text-2xl font-black tracking-tight text-slate-900 font-mono">
            {consumed.toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            / {target.toLocaleString()} kcal
          </div>
        </div>
      </div>

      {/* Detailed Stats Column */}
      <div className="flex-1 space-y-3 w-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Daily Calorie Target</span>
          <span className="text-xs font-bold text-indigo-600 font-mono">{percentage}% Consumed</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-medium text-slate-500 block">Consumed</span>
            <span className="text-xl font-bold text-slate-900 font-mono">{consumed} <span className="text-xs text-slate-400">kcal</span></span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-medium text-slate-500 block">Remaining</span>
            <span className={`text-xl font-bold font-mono ${remaining === 0 ? 'text-emerald-600' : 'text-indigo-600'}`}>
              {remaining} <span className="text-xs text-slate-400">kcal</span>
            </span>
          </div>
        </div>

        {/* Target Warning / On Track Badge */}
        {isBelowMin && (
          <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Intake is below your daily bulking target (2,700 kcal). Make sure to log all meals!</span>
          </div>
        )}

        {isAboveMax && (
          <div className="flex items-center gap-2 p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-700 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Calorie intake exceeded daily goal (+2,750 kcal). Excellent surplus for gain!</span>
          </div>
        )}

        {isOnTrack && (
          <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Optimal bulking intake reached! On track for 70 kg goal.</span>
          </div>
        )}

      </div>

    </div>
  );
}
