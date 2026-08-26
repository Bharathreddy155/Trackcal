// src/components/Dashboard/SupplementBar.jsx
import React, { useState } from 'react';
import { Pill, CheckCircle2, Circle, AlertCircle, Plus, Sparkles } from 'lucide-react';
import { useBulkTrack } from '../../context/BulkTrackContext';

export default function SupplementBar() {
  const { currentLog, logWhey, undoWhey, logCreatine, undoCreatine } = useBulkTrack();
  const [scoopCount, setScoopCount] = useState(1);

  const wheyState = currentLog?.supplements?.whey || { taken: false, scoops: 1 };
  const creatineState = currentLog?.supplements?.creatine || { taken: false, grams: 3 };

  const snackLogged = currentLog?.meals?.snack?.isLogged;
  const snackHasWhey = currentLog?.meals?.snack?.items?.some(i => i.foodId === 'food_whey_leanfit');
  const wheyInSnackCounted = snackLogged && snackHasWhey;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pill className="w-5 h-5 text-indigo-500" />
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Today's Supplements</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Daily Stacks</span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Whey Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          wheyState.taken || wheyInSnackCounted
            ? 'bg-cyan-50 border-cyan-200 shadow-sm'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🥛</span>
              <div>
                <h4 className="text-sm font-bold text-slate-800">LeanFit Whey Protein</h4>
                <p className="text-xs text-slate-500 font-mono">1 scoop (35g) • 140 kcal • 24g P • 4.8g BCAAs</p>
              </div>
            </div>

            {wheyState.taken || wheyInSnackCounted ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-700 border border-cyan-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Taken
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-400">
                <Circle className="w-3.5 h-3.5" /> Pending
              </span>
            )}
          </div>

          {/* Smart Double Counting Warning */}
          {wheyInSnackCounted && (
            <div className="mt-3 p-2 bg-white border border-cyan-200 rounded-lg flex items-center gap-2 text-xs text-cyan-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-cyan-500" />
              <span>Included in logged <strong>Snack</strong> meal. Nutrition is counted in daily macros.</span>
            </div>
          )}

          {/* Action Row */}
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60">
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500 mr-1 font-semibold">Scoops:</span>
              {[0.5, 1, 1.5].map((sc) => (
                <button
                  key={sc}
                  onClick={() => setScoopCount(sc)}
                  className={`px-2 py-0.5 text-xs font-bold rounded-lg transition ${
                    scoopCount === sc
                      ? 'bg-cyan-500 text-white font-black'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>

            {wheyState.taken ? (
              <button
                onClick={undoWhey}
                className="text-xs font-bold text-slate-400 hover:text-rose-500 transition"
              >
                Undo Log
              </button>
            ) : (
              <button
                onClick={() => logWhey(scoopCount, wheyInSnackCounted)}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 text-white font-bold text-xs hover:brightness-110 transition shadow"
              >
                Log Whey
              </button>
            )}
          </div>
        </div>

        {/* Creatine Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          creatineState.taken
            ? 'bg-emerald-50 border-emerald-200 shadow-sm'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">⚡</span>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Creatine Monohydrate</h4>
                <p className="text-xs text-slate-500 font-mono">Daily Target: 3 g • 0 kcal</p>
              </div>
            </div>

            {creatineState.taken ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Taken
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-400">
                <Circle className="w-3.5 h-3.5" /> Pending
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60">
            <span className="text-xs text-slate-500 font-mono">3g / day boost</span>

            {creatineState.taken ? (
              <button
                onClick={undoCreatine}
                className="text-xs font-bold text-slate-400 hover:text-rose-500 transition"
              >
                Undo Log
              </button>
            ) : (
              <button
                onClick={() => logCreatine(3)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-white font-bold text-xs hover:brightness-110 transition shadow"
              >
                Log Creatine (3g)
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
