// src/pages/WeeklySummaryPage.jsx
import React from 'react';
import { BarChart2, Flame, Dumbbell, Pill, Calendar, ArrowUpRight } from 'lucide-react';
import { useBulkTrack } from '../context/BulkTrackContext';
import { getLastNDays } from '../services/dateService';
import { calculateDailyTotals } from '../services/nutritionEngine';

export default function WeeklySummaryPage() {
  const { dailyLogs, foods, targets, profile } = useBulkTrack();

  const last7Days = getLastNDays(7);

  let totalCal = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let loggedDaysCount = 0;

  let workoutCount = 0;
  let wheyCount = 0;
  let creatineCount = 0;

  const weightsRecorded = [];

  last7Days.forEach((dateStr) => {
    const log = dailyLogs[dateStr];
    if (log) {
      const totals = calculateDailyTotals(log, foods);
      if (totals.calories > 0) {
        totalCal += totals.calories;
        totalProtein += totals.protein;
        totalCarbs += totals.carbs;
        totalFat += totals.fat;
        totalFiber += totals.fiber;
        loggedDaysCount++;
      }

      if (log.workout?.completed) workoutCount++;
      if (log.supplements?.whey?.taken || log.meals?.snack?.isLogged) wheyCount++;
      if (log.supplements?.creatine?.taken) creatineCount++;
      if (log.weight) weightsRecorded.push(log.weight);
    }
  });

  const avgCal = loggedDaysCount > 0 ? Math.round(totalCal / loggedDaysCount) : 0;
  const avgProtein = loggedDaysCount > 0 ? (totalProtein / loggedDaysCount).toFixed(1) : 0;
  const avgCarbs = loggedDaysCount > 0 ? (totalCarbs / loggedDaysCount).toFixed(1) : 0;
  const avgFat = loggedDaysCount > 0 ? (totalFat / loggedDaysCount).toFixed(1) : 0;
  const avgFiber = loggedDaysCount > 0 ? (totalFiber / loggedDaysCount).toFixed(1) : 0;

  const startWeekWeight = weightsRecorded[0] || profile.currentWeightKg || 57.5;
  const endWeekWeight = weightsRecorded[weightsRecorded.length - 1] || profile.currentWeightKg || 57.5;
  const weightDiff = (endWeekWeight - startWeekWeight).toFixed(1);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-indigo-600" />
          <span>Weekly Report & Averages</span>
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          7-day summary of calorie intake, macros, workout consistency, and weight gain progress.
        </p>
      </div>

      {/* Hero Stats Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Weekly Calorie Average</span>
            <div className="text-3xl font-black text-slate-900 font-mono mt-1">
              {avgCal.toLocaleString()} <span className="text-sm font-normal text-slate-400">kcal / day</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Daily Target</span>
            <div className="text-lg font-bold text-indigo-600 font-mono mt-1">
              {targets.calories || 2725} kcal
            </div>
          </div>
        </div>

        {/* 4 Macro Averages Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium block">Avg Protein</span>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-1">
              {avgProtein} <span className="text-xs text-slate-400">g / day</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Target: {targets.protein || 105}g</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium block">Avg Carbs</span>
            <div className="text-2xl font-black text-cyan-600 font-mono mt-1">
              {avgCarbs} <span className="text-xs text-slate-400">g / day</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Target: {targets.carbs || 395}g</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium block">Avg Fat</span>
            <div className="text-2xl font-black text-amber-600 font-mono mt-1">
              {avgFat} <span className="text-xs text-slate-400">g / day</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Target: {targets.fat || 77}g</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium block">Avg Fiber</span>
            <div className="text-2xl font-black text-violet-600 font-mono mt-1">
              {avgFiber} <span className="text-xs text-slate-400">g / day</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Target: {targets.fiber || 33}g</span>
          </div>
        </div>
      </div>

      {/* Adherence & Consistency Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Workouts</span>
              <div className="text-xl font-black text-slate-900 font-mono">{workoutCount} / 4 <span className="text-xs text-slate-400 font-normal font-sans">completed</span></div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Whey Consistency</span>
              <div className="text-xl font-black text-slate-900 font-mono">{wheyCount} / 7 <span className="text-xs text-slate-400 font-normal font-sans">days</span></div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-200 flex items-center justify-center font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Creatine Consistency</span>
              <div className="text-xl font-black text-slate-900 font-mono">{creatineCount} / 7 <span className="text-xs text-slate-400 font-normal font-sans">days</span></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
