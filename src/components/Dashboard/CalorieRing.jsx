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
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* SVG Donut Ring */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="w-44 h-44 transform -rotate-90">
          {/* Track */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            className="stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            className={`transition-all duration-700 ease-out ${
              isAboveMax ? 'stroke-amber-400' : 'stroke-emerald-400'
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
          <Flame className={`w-6 h-6 mb-1 ${isAboveMax ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
          <div className="text-2xl font-black tracking-tight text-white font-mono">
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
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Calorie Target</span>
          <span className="text-xs font-bold text-emerald-400 font-mono">{percentage}% Consumed</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800">
            <span className="text-xs font-medium text-slate-400 block">Consumed</span>
            <span className="text-xl font-bold text-white font-mono">{consumed} <span className="text-xs text-slate-400">kcal</span></span>
          </div>
          <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800">
            <span className="text-xs font-medium text-slate-400 block">Remaining</span>
            <span className={`text-xl font-bold font-mono ${remaining === 0 ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {remaining} <span className="text-xs text-slate-400">kcal</span>
            </span>
          </div>
        </div>

        {/* Target Warning / On Track Badge */}
        {isBelowMin && (
          <div className="flex items-center gap-2 p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-amber-300 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Intake is below your daily bulking target (2,700 kcal). Make sure to log all meals!</span>
          </div>
        )}

        {isAboveMax && (
          <div className="flex items-center gap-2 p-2.5 bg-purple-950/40 border border-purple-500/30 rounded-xl text-purple-300 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Calorie intake exceeded daily goal (+2,750 kcal). Excellent surplus for gain!</span>
          </div>
        )}

        {isOnTrack && (
          <div className="flex items-center gap-2 p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Optimal bulking intake reached! On track for 70 kg goal.</span>
          </div>
        )}

      </div>

    </div>
  );
}
