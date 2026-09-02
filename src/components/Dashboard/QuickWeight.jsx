// src/components/Dashboard/QuickWeight.jsx
import React, { useState, useEffect } from 'react';
import { Scale, Target, ArrowRight, CheckCircle2, Clock, Plus, Minus } from 'lucide-react';
import { useTrackcal } from '../../context/TrackcalContext';
import ProgressBar from '../Shared/ProgressBar';

export default function QuickWeight() {
  const { profile, currentLog, logWeight, latestWeight } = useTrackcal();
  
  // Use today's weight if logged, otherwise carry forward latest recorded weight
  const isLoggedToday = Boolean(currentLog?.weight && Number(currentLog.weight) > 0);
  const activeWeight = isLoggedToday ? Number(currentLog.weight) : (latestWeight || profile.currentWeightKg || 57.5);
  const goalWeight = profile.goalWeightKg || 70.0;
  const startWeight = 57.5; // baseline

  const [inputVal, setInputVal] = useState(activeWeight);

  // Sync input value whenever activeWeight changes or when navigating dates
  useEffect(() => {
    setInputVal(activeWeight);
  }, [activeWeight, currentLog?.date]);

  const gainNeeded = Math.max(0, goalWeight - activeWeight).toFixed(1);
  const totalGainGoal = goalWeight - startWeight; // 12.5 kg
  const achievedGain = Math.max(0, activeWeight - startWeight).toFixed(1);
  const percentage = totalGainGoal > 0 ? Math.min(Math.round((Number(achievedGain) / totalGainGoal) * 100), 100) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(inputVal);
    if (val && val >= 30 && val <= 150) {
      logWeight(val);
    }
  };

  const adjustWeight = (delta) => {
    const nextVal = Math.round((Number(inputVal || activeWeight) + delta) * 10) / 10;
    if (nextVal >= 30 && nextVal <= 150) {
      setInputVal(nextVal);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5">
      
      {/* Left Info */}
      <div className="flex items-center gap-3.5 w-full md:w-auto">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-xl shrink-0 shadow-xs">
          <Scale className="w-6 h-6" />
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Body Weight</span>
            {isLoggedToday ? (
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3" /> Logged Today
              </span>
            ) : (
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-500/30 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" /> Latest: {latestWeight} kg
              </span>
            )}
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
              {percentage}% Achieved
            </span>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {activeWeight} <span className="text-xs text-slate-400">kg</span>
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {goalWeight} <span className="text-xs text-slate-400">kg</span>
            </span>
            {Number(achievedGain) > 0 && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono">
                +{achievedGain} kg
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            {Number(gainNeeded) > 0 ? `${gainNeeded} kg remaining to reach 70 kg goal` : 'Goal reached! 🎉'} • Baseline 57.5 kg
          </p>
        </div>
      </div>

      {/* Center Progress Bar */}
      <div className="flex-1 w-full max-w-md px-2">
        <ProgressBar
          value={Number(achievedGain)}
          max={totalGainGoal || 1}
          colorClass="bg-indigo-500"
          height="h-2.5"
          showPercent
        />
      </div>

      {/* Right Quick Input Form with Steppers */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full md:w-auto">
        <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5">
          <button
            type="button"
            onClick={() => adjustWeight(-0.1)}
            className="w-7 h-8 flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
            title="Decrease 0.1 kg"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="30"
              max="150"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-20 px-2 py-1.5 text-center bg-transparent text-slate-900 dark:text-white font-mono font-black text-sm focus:outline-none"
              placeholder="58.2"
            />
          </div>

          <button
            type="button"
            onClick={() => adjustWeight(0.1)}
            className="w-7 h-8 flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
            title="Increase 0.1 kg"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow-md shadow-indigo-500/20 cursor-pointer shrink-0"
        >
          {isLoggedToday ? 'Update' : 'Log Today'}
        </button>
      </form>

    </div>
  );
}
