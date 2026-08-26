// src/components/Dashboard/QuickWeight.jsx
import React, { useState } from 'react';
import { Scale, Target, ArrowRight } from 'lucide-react';
import { useBulkTrack } from '../../context/BulkTrackContext';
import ProgressBar from '../Shared/ProgressBar';

export default function QuickWeight() {
  const { profile, currentLog, logWeight } = useBulkTrack();
  const currentWeight = currentLog?.weight || profile.currentWeightKg || 57.5;
  const goalWeight = profile.goalWeightKg || 70.0;
  const startWeight = 57.5; // initial baseline

  const [inputVal, setInputVal] = useState(currentWeight);

  const gainNeeded = (goalWeight - currentWeight).toFixed(1);
  const totalGainGoal = goalWeight - startWeight; // e.g. 12.5 kg
  const achievedGain = Math.max(0, currentWeight - startWeight);
  const percentage = totalGainGoal > 0 ? Math.min(Math.round((achievedGain / totalGainGoal) * 100), 100) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal > 0) {
      logWeight(inputVal);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-5">
      
      {/* Left Info */}
      <div className="flex items-center gap-3.5 w-full md:w-auto">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center text-xl shrink-0">
          <Scale className="w-6 h-6" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Body Weight</span>
            <span className="text-xs font-bold text-indigo-600 font-mono">{percentage}% Goal Achieved</span>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-2xl font-black text-slate-900 font-mono">{currentWeight} <span className="text-xs text-slate-400">kg</span></span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="text-base font-bold text-emerald-600 font-mono">{goalWeight} <span className="text-xs text-slate-400">kg</span></span>
          </div>

          <p className="text-xs text-slate-500 font-mono mt-0.5">
            {gainNeeded > 0 ? `${gainNeeded} kg remaining to reach goal` : 'Goal reached! 🎉'}
          </p>
        </div>
      </div>

      {/* Center Progress Bar */}
      <div className="flex-1 w-full max-w-md px-2">
        <ProgressBar
          value={achievedGain}
          max={totalGainGoal || 1}
          colorClass="bg-indigo-500"
          height="h-2.5"
        />
      </div>

      {/* Right Quick Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative">
          <input
            type="number"
            step="0.1"
            min="30"
            max="150"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono font-bold text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
            placeholder="57.5"
          />
          <span className="absolute right-2.5 top-2.5 text-xs text-slate-400 font-mono pointer-events-none">kg</span>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-sm"
        >
          Update Weight
        </button>
      </form>

    </div>
  );
}
