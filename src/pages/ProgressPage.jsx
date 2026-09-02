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
import { useTrackcal } from '../context/TrackcalContext';
import { getLastNDays, getDisplayDate } from '../services/dateService';
import { calculateDailyTotals } from '../services/nutritionEngine';
import ProgressBar from '../components/Shared/ProgressBar';

export default function ProgressPage() {
  const { profile, targets, dailyLogs, foods, logWeight, latestWeight, theme } = useTrackcal();

  const currentWeight = latestWeight || profile.currentWeightKg || 57.5;
  const [newWeightInput, setNewWeightInput] = useState(currentWeight);

  useEffect(() => {
    setNewWeightInput(currentWeight);
  }, [currentWeight]);

  const startWeight = 57.5;
  const goalWeight = profile.goalWeightKg || 70.0;
  const remainingWeight = (goalWeight - currentWeight).toFixed(1);

  const totalGainGoal = goalWeight - startWeight;
  const achievedGain = Math.max(0, currentWeight - startWeight).toFixed(1);
  const progressPercent = totalGainGoal > 0 ? Math.min(Math.round((Number(achievedGain) / totalGainGoal) * 100), 100) : 0;

  const isDark = theme === 'dark';
  const gridStroke = isDark ? '#1e293b' : '#e2e8f0';
  const axisStroke = isDark ? '#64748b' : '#94a3b8';
  const tooltipStyle = isDark
    ? { backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', fontSize: '12px' }
    : { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' };

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
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
          <span>Progress & Analytics</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
          Track your weight progression from 57.5 kg toward your 70.0 kg goal, calorie trends, and macro adherence.
        </p>
      </div>

      {/* Main Weight Progress Hero Card */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Bulking Journey</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono mt-1 flex items-baseline gap-2 flex-wrap">
              <span>{currentWeight} kg</span>
              <span className="text-xs sm:text-sm font-normal text-slate-400">→ Goal:</span>
              <span className="text-emerald-600 dark:text-emerald-400">{goalWeight} kg</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              {remainingWeight > 0 ? `${remainingWeight} kg to gain` : 'Goal reached! 🎉'} • Started at 57.5 kg
            </p>
          </div>

          <form onSubmit={handleWeightSubmit} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input
                type="number"
                step="0.1"
                min="30"
                max="150"
                value={newWeightInput}
                onChange={(e) => setNewWeightInput(e.target.value)}
                className="w-full md:w-28 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900"
              />
              <span className="absolute right-2.5 top-2.5 text-xs text-slate-400 dark:text-slate-500 font-mono pointer-events-none">kg</span>
            </div>
            <button
              type="submit"
              className="px-3.5 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow-md shadow-indigo-500/20 whitespace-nowrap cursor-pointer"
            >
              Log Weight
            </button>
          </form>
        </div>

        <ProgressBar
          value={achievedGain}
          max={totalGainGoal || 1}
          colorClass="bg-indigo-500"
          height="h-2.5 sm:h-3"
          showPercent
        />
      </div>

      {/* Weight Progression Chart */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Weight Progress (kg)</span>
          </h3>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">14 Days Trend</span>
        </div>

        <div className="h-56 sm:h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="date" stroke={axisStroke} tick={{ fontSize: 10 }} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke={axisStroke} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={3} dot={{ r: 3, fill: '#6366f1' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calorie Intake Chart */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Calorie Intake (kcal)</span>
          </h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">Goal: {targets.calories || 2725}</span>
        </div>

        <div className="h-56 sm:h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="date" stroke={axisStroke} tick={{ fontSize: 10 }} />
              <YAxis stroke={axisStroke} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="calories" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="targetCalories" stroke="#f59e0b" strokeDasharray="5 5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Macro Breakdown Chart */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Macro Intake Trends (g)</h3>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">P / C / F</span>
        </div>

        <div className="h-56 sm:h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="date" stroke={axisStroke} tick={{ fontSize: 10 }} />
              <YAxis stroke={axisStroke} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line type="monotone" dataKey="protein" name="Protein" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="carbs" name="Carbs" stroke="#06b6d4" strokeWidth={2} />
              <Line type="monotone" dataKey="fat" name="Fat" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
