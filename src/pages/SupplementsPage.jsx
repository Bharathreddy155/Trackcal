// src/pages/SupplementsPage.jsx
import React from 'react';
import { Pill, CheckCircle2, Circle, Sparkles, Flame } from 'lucide-react';
import { useBulkTrack } from '../context/BulkTrackContext';
import { getLastNDays, getDisplayDate } from '../services/dateService';

export default function SupplementsPage() {
  const { currentLog, dailyLogs, logWhey, undoWhey, logCreatine, undoCreatine } = useBulkTrack();

  const wheyState = currentLog?.supplements?.whey || { taken: false, scoops: 1 };
  const creatineState = currentLog?.supplements?.creatine || { taken: false, grams: 3 };

  // Calculate 7-day adherence history
  const last7Days = getLastNDays(7);
  let wheyCount7 = 0;
  let creatineCount7 = 0;

  last7Days.forEach(dateStr => {
    const log = dailyLogs[dateStr];
    if (log?.supplements?.whey?.taken || log?.meals?.snack?.isLogged) wheyCount7++;
    if (log?.supplements?.creatine?.taken) creatineCount7++;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Pill className="w-6 h-6 text-cyan-400" />
          <span>Supplements Dashboard</span>
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Track LeanFit Whey Protein and Creatine Monohydrate adherence for max muscle growth.
        </p>
      </div>

      {/* 7-Day Adherence Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">7-Day Whey Adherence</span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {wheyCount7} / 7 <span className="text-xs text-cyan-400 font-normal">days logged</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold font-mono text-lg">
            {Math.round((wheyCount7 / 7) * 100)}%
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">7-Day Creatine Adherence</span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {creatineCount7} / 7 <span className="text-xs text-emerald-400 font-normal">days logged</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold font-mono text-lg">
            {Math.round((creatineCount7 / 7) * 100)}%
          </div>
        </div>
      </div>

      {/* Main Stack Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Whey Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🥛</span>
              <div>
                <h3 className="text-lg font-extrabold text-white">LeanFit Chocolate Whey</h3>
                <p className="text-xs text-cyan-400 font-mono">1 scoop = 35g • 24g Protein • 4.8g BCAAs</p>
              </div>
            </div>

            {wheyState.taken ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                <CheckCircle2 className="w-4 h-4" /> Logged Today
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-400">
                Pending
              </span>
            )}
          </div>

          {/* Macro Breakdown */}
          <div className="grid grid-cols-5 gap-2 text-center p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block font-sans">Calories</span>
              <span className="font-bold text-white">140</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-sans">Protein</span>
              <span className="font-bold text-emerald-400">24g</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-sans">Carbs</span>
              <span className="font-bold text-cyan-400">3g</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-sans">Fat</span>
              <span className="font-bold text-amber-400">3.5g</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-sans">BCAAs</span>
              <span className="font-bold text-purple-400">4.8g</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 font-medium">Standard intake: Post-workout or Snack</span>

            {wheyState.taken ? (
              <button
                onClick={undoWhey}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:text-rose-400 transition"
              >
                Undo Whey Log
              </button>
            ) : (
              <button
                onClick={() => logWhey(1)}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow"
              >
                Log 1 Scoop Whey
              </button>
            )}
          </div>
        </div>

        {/* Creatine Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              <div>
                <h3 className="text-lg font-extrabold text-white">Creatine Monohydrate</h3>
                <p className="text-xs text-emerald-400 font-mono">Daily Target: 3g • 0 Calories</p>
              </div>
            </div>

            {creatineState.taken ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" /> Logged Today
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-400">
                Pending
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            Creatine saturates muscle phosphocreatine stores to boost explosive power, strength output on bench press and squats, and cell hydration. Take 3g consistently every day.
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 font-medium">Daily dosage: 3g</span>

            {creatineState.taken ? (
              <button
                onClick={undoCreatine}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:text-rose-400 transition"
              >
                Undo Creatine Log
              </button>
            ) : (
              <button
                onClick={() => logCreatine(3)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow"
              >
                Log 3g Creatine
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
