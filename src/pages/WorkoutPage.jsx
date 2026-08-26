// src/pages/WorkoutPage.jsx
import React, { useState } from 'react';
import { Dumbbell, Plus, Calendar, Clock, CheckCircle2, Trophy, Flame } from 'lucide-react';
import { useBulkTrack } from '../context/BulkTrackContext';
import WorkoutLogger from '../components/Workout/WorkoutLogger';
import { getLastNDays, getDisplayDate } from '../services/dateService';
import ProgressBar from '../components/Shared/ProgressBar';

export default function WorkoutPage() {
  const { dailyLogs, currentLog, profile } = useBulkTrack();
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);

  const weeklyTarget = profile.workoutDaysPerWeek || 4;

  // Calculate workouts completed in last 7 days
  const last7Days = getLastNDays(7);
  let completedThisWeek = 0;
  const recentWorkoutLogs = [];

  // Gather past workout history across stored logs
  Object.keys(dailyLogs).sort().reverse().forEach((dateStr) => {
    const log = dailyLogs[dateStr];
    if (log?.workout?.completed) {
      recentWorkoutLogs.push({
        date: dateStr,
        ...log.workout
      });
    }
  });

  last7Days.forEach((dateStr) => {
    if (dailyLogs[dateStr]?.workout?.completed) {
      completedThisWeek++;
    }
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-indigo-600" />
            <span>Workout Tracker</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Log your 4 days/week bulking workout routine, sets, reps, and heavy progressive overload.
          </p>
        </div>

        <button
          onClick={() => setIsLoggerOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-indigo-500/20 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Workout</span>
        </button>
      </div>

      {/* Weekly Progress Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 font-black flex items-center justify-center text-2xl shadow-sm">
            💪
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Target</div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
              {completedThisWeek} / {weeklyTarget} <span className="text-xs text-emerald-600 font-normal">workouts completed</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {completedThisWeek >= weeklyTarget ? '🎉 Weekly workout target reached!' : `${weeklyTarget - completedThisWeek} more workout needed this week`}
            </p>
          </div>
        </div>

        <div className="w-full md:w-64">
          <ProgressBar
            value={completedThisWeek}
            max={weeklyTarget}
            colorClass="bg-indigo-500"
            height="h-3"
            showPercent
          />
        </div>
      </div>

      {/* Today's Workout Session Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Today's Session</span>
          {currentLog?.workout?.completed ? (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
            </span>
          ) : (
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Not Logged Yet</span>
          )}
        </div>

        {currentLog?.workout?.completed ? (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">{currentLog.workout.name}</h3>
              <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                {currentLog.workout.durationMinutes} mins
              </span>
            </div>

            <div className="space-y-2">
              {currentLog.workout.exercises?.map((ex, idx) => (
                <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{ex.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    {ex.sets?.map((s, sIdx) => (
                      <span key={sIdx} className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-indigo-600 font-bold">
                        {s.weight}kg × {s.reps}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            No workout logged for today. Tap "+ Log Workout" to add your training session!
          </div>
        )}
      </div>

      {/* Workout History List */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider px-1">Workout History</h3>

        {recentWorkoutLogs.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs glass-panel rounded-2xl">
            No workout history recorded yet.
          </div>
        ) : (
          recentWorkoutLogs.map((log, idx) => (
            <div key={idx} className="glass-panel p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{log.name}</h4>
                  <span className="text-xs text-slate-400 font-medium">{getDisplayDate(log.date)}</span>
                </div>
                <span className="text-xs text-indigo-600 font-mono font-bold">{log.durationMinutes} mins</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {log.exercises?.map((ex, exIdx) => (
                  <span key={exIdx} className="text-xs font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700">
                    <strong className="text-slate-900">{ex.name}:</strong> {ex.sets?.length || 0} sets ({ex.sets?.[0]?.weight || 0}kg max)
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <WorkoutLogger
        isOpen={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
      />

    </div>
  );
}
