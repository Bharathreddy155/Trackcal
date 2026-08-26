// src/pages/ProgressPage.jsx
import React, { useState } from 'react';
import { TrendingUp, Scale, Flame, Dumbbell, Pill } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useBulkTrack } from '../context/BulkTrackContext';
import { getLastNDays, getDisplayDate } from '../services/dateService';
import { calculateDailyTotals } from '../services/nutritionEngine';
import ProgressBar from '../components/Shared/ProgressBar';

export default function ProgressPage() {
  const { profile, targets, dailyLogs, foods, logWeight } = useBulkTrack();

  const [newWeightInput, setNewWeightInput] = useState(profile.currentWeightKg || 57.5);

  const startWeight = 57.5;
  const currentWeight = profile.currentWeightKg || 57.5;
  const goalWeight = profile.goalWeightKg || 70.0;
  const remainingWeight = (goalWeight - currentWeight).toFixed(1);

  const totalGainGoal = goalWeight - startWeight;
  const achievedGain = Math.max(0, currentWeight - startWeight);
  const progressPercent = totalGainGoal > 0 ? Math.min(Math.round((achievedGain / totalGainGoal) * 100), 100) : 0;

  // Prepare chart data for last 14 days
  const last14Days = getLastNDays(14);
  const chartData = last14Days.map((dateStr) => {
    const log = dailyLogs[dateStr] || {};
    const totals = calculateDailyTotals(log, foods);
    const dayName = dateStr.split('-').slice(1).join('/');

    return {
      date: dayName,
      fullDate: dateStr,
      weight: log.weight || currentWeight,
      calories: totals.calories || 0,
      targetCalories: targets.calories || 2725,
      protein: totals.protein || 0,
      carbs: totals.carbs || 0,
      fat: totals.fat || 0,
      workout: log.workout?.completed ? 1 : 0
    };
  });

  const handleWeightSubmit = (e) => {
    e.preventDefault();
    if (newWeightInput > 0) {
      logWeight(newWeightInput);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          <span>Progress & Body Weight Analytics</span>
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Track your weight progression from 57.5 kg toward your 70.0 kg goal, calorie trends, and macro adherence.
        </p>
      </div>

      {/* Main Weight Progress Hero Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Bulking Journey</span>
            <div className="text-3xl font-black text-slate-900 font-mono mt-1 flex items-baseline gap-2">
              <span>{currentWeight} kg</span>
              <span className="text-sm font-normal text-slate-400">→ Goal:</span>
              <span className="text-emerald-600">{goalWeight} kg</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              {remainingWeight > 0 ? `${remainingWeight} kg to gain` : 'Goal reached! 🎉'} • Started at 57.5 kg
            </p>
          </div>

          <form onSubmit={handleWeightSubmit} className="flex items-center gap-2">
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="30"
                max="150"
                value={newWeightInput}
                onChange={(e) => setNewWeightInput(e.target.value)}
                className="w-28 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
              <span className="absolute right-2.5 top-2.5 text-xs text-slate-400 font-mono pointer-events-none">kg</span>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow-md shadow-indigo-500/20"
            >
              Log Today Weight
            </button>
          </form>
        </div>

        <ProgressBar
          value={achievedGain}
          max={totalGainGoal || 1}
          colorClass="bg-indigo-500"
          height="h-3"
          showPercent
        />
      </div>

      {/* Weight Progression Chart */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>Weight Progress Chart (kg)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">14 Days Trend</span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calorie Intake Chart */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Daily Calorie Intake (kcal)</span>
          </h3>
          <span className="text-xs text-emerald-600 font-mono font-bold">Target: {targets.calories || 2725} kcal</span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="calories" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Line type="monotone" dataKey="targetCalories" stroke="#f59e0b" strokeDasharray="5 5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Macro Breakdown Chart */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Macro Intake Trends (g)</h3>
          <span className="text-xs text-slate-400 font-mono">Protein / Carbs / Fat</span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="protein" name="Protein (g)" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="carbs" name="Carbs (g)" stroke="#06b6d4" strokeWidth={2} />
              <Line type="monotone" dataKey="fat" name="Fat (g)" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
