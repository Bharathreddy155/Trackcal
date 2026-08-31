// src/pages/WorkoutPage.jsx
import React, { useState } from 'react';
import { Dumbbell, Plus, Calendar, Clock, CheckCircle2, Trophy, Flame, Layers, Sparkles } from 'lucide-react';
import { useTrackcal } from '../context/TrackcalContext';
import WorkoutLogger, { WORKOUT_ROUTINES } from '../components/Workout/WorkoutLogger';
import { getLastNDays, getDisplayDate } from '../services/dateService';
import ProgressBar from '../components/Shared/ProgressBar';

export default function WorkoutPage() {
  const { dailyLogs, currentLog, profile } = useTrackcal();
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
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Workout Tracker</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            4-Day Bulking Split • 2 Muscles per Session with Targeted Exercise Variations.
          </p>
        </div>

        <button
          onClick={() => setIsLoggerOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-indigo-500/20 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Workout</span>
        </button>
      </div>

      {/* Weekly Progress Banner */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 font-black flex items-center justify-center text-2xl shadow-sm">
            💪
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Weekly Target</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
              {completedThisWeek} / {weeklyTarget} <span className="text-xs text-emerald-600 dark:text-emerald-400 font-normal">workouts completed</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Today's Session</span>
          {currentLog?.workout?.completed ? (
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
            </span>
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Not Logged Yet</span>
          )}
        </div>

        {currentLog?.workout?.completed ? (
          <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{currentLog.workout.name}</h3>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                  {currentLog.workout.exercises?.length || 0} Exercises Completed
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                {currentLog.workout.durationMinutes} mins
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentLog.workout.exercises?.map((ex, idx) => (
                <div key={idx} className="p-2.5 bg-white dark:bg-slate-900/80 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="truncate pr-2">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mr-1.5 font-mono">#{idx + 1}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{ex.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono shrink-0">
                    {ex.sets?.map((s, sIdx) => (
                      <span key={sIdx} className="bg-slate-50 dark:bg-slate-950 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 font-bold text-[11px]">
                        {s.weight}k×{s.reps}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">
            No workout logged for today. Tap "+ Log Workout" to log your training session!
          </div>
        )}
      </div>

      {/* 2-Muscle Split Workout Routines */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Workout Split Routines</span>
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">4 Routines Available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(WORKOUT_ROUTINES).map((key) => {
            const routine = WORKOUT_ROUTINES[key];
            const muscle1Exercises = routine.exercises.filter(e => e.muscle === routine.muscle1.split(' ')[0] || e.muscle === 'Chest' || e.muscle === 'Back' || e.muscle === 'Legs' || e.muscle === 'Shoulders');
            const muscle2Exercises = routine.exercises.filter(e => !muscle1Exercises.includes(e));

            return (
              <div key={key} className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{routine.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{routine.exercises.length} Targeted Exercises (3 Sets each)</p>
                    </div>
                    <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 font-mono">
                      {routine.exercises.length} Exercises
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                    {/* Muscle 1 */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-2">
                      <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                        {routine.muscle1}
                      </span>
                      <div className="space-y-1.5 text-xs font-mono">
                        {muscle1Exercises.map((ex, i) => (
                          <div key={i} className="text-slate-700 dark:text-slate-300 flex items-start gap-1">
                            <span className="text-slate-400 shrink-0">#{i + 1}</span>
                            <span className="font-semibold text-slate-900 dark:text-white truncate">{ex.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Muscle 2 */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-2">
                      <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                        {routine.muscle2}
                      </span>
                      <div className="space-y-1.5 text-xs font-mono">
                        {muscle2Exercises.map((ex, i) => (
                          <div key={i} className="text-slate-700 dark:text-slate-300 flex items-start gap-1">
                            <span className="text-slate-400 shrink-0">#{i + 1}</span>
                            <span className="font-semibold text-slate-900 dark:text-white truncate">{ex.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsLoggerOpen(true)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 dark:bg-slate-800 dark:hover:bg-indigo-600 dark:text-slate-200 dark:hover:text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log {routine.name}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workout History List */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider px-1">Workout History</h3>

        {recentWorkoutLogs.length === 0 ? (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs glass-panel rounded-2xl">
            No workout history recorded yet.
          </div>
        ) : (
          recentWorkoutLogs.map((log, idx) => (
            <div key={idx} className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{log.name}</h4>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{getDisplayDate(log.date)}</span>
                </div>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-bold">{log.durationMinutes} mins</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {log.exercises?.map((ex, exIdx) => (
                  <span key={exIdx} className="text-xs font-mono bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">{ex.name}:</strong> {ex.sets?.length || 0} sets ({ex.sets?.[0]?.weight || 0}kg max)
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
