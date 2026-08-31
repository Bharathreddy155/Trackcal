// src/components/Workout/WorkoutLogger.jsx
import React, { useState } from 'react';
import Modal from '../Shared/Modal';
import { Dumbbell, Plus, Trash2, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useTrackcal } from '../../context/TrackcalContext';

export const WORKOUT_ROUTINES = {
  'Chest / Triceps': {
    name: 'Chest / Triceps',
    muscle1: 'Chest (3 Variations)',
    muscle2: 'Triceps (3 Variations)',
    exercises: [
      // Muscle 1: Chest (3 variations)
      {
        name: 'Pec Deck',
        muscle: 'Chest',
        sets: [
          { weight: 35, reps: 12 },
          { weight: 40, reps: 10 },
          { weight: 45, reps: 8 }
        ]
      },
      {
        name: 'Incline Dumbbell Press',
        muscle: 'Chest',
        sets: [
          { weight: 16, reps: 10 },
          { weight: 18, reps: 8 },
          { weight: 20, reps: 8 }
        ]
      },
      {
        name: 'Cable Chest Flyes',
        muscle: 'Chest',
        sets: [
          { weight: 15, reps: 12 },
          { weight: 17.5, reps: 10 },
          { weight: 20, reps: 10 }
        ]
      },
      // Muscle 2: Triceps (3 variations)
      {
        name: 'Tricep Rope Pushdowns',
        muscle: 'Triceps',
        sets: [
          { weight: 20, reps: 12 },
          { weight: 25, reps: 10 },
          { weight: 27.5, reps: 8 }
        ]
      },
      {
        name: 'Overhead Dumbbell/Cable Extension',
        muscle: 'Triceps',
        sets: [
          { weight: 14, reps: 12 },
          { weight: 16, reps: 10 },
          { weight: 18, reps: 8 }
        ]
      },
      {
        name: 'Tricep Rod Pushdowns',
        muscle: 'Triceps',
        sets: [
          { weight: 22.5, reps: 12 },
          { weight: 25, reps: 10 },
          { weight: 30, reps: 8 }
        ]
      }
    ]
  },
  'Back / Biceps': {
    name: 'Back / Biceps',
    muscle1: 'Back (4 Variations)',
    muscle2: 'Biceps (3 Variations)',
    exercises: [
      // Muscle 1: Back (4 variations)
      {
        name: 'Wide Grip Lat Pulldown',
        muscle: 'Back',
        sets: [
          { weight: 40, reps: 12 },
          { weight: 45, reps: 10 },
          { weight: 50, reps: 8 }
        ]
      },
      {
        name: 'Seated Cable Row',
        muscle: 'Back',
        sets: [
          { weight: 35, reps: 12 },
          { weight: 40, reps: 10 },
          { weight: 45, reps: 8 }
        ]
      },
      {
        name: 'Single Arm Dumbbell Row',
        muscle: 'Back',
        sets: [
          { weight: 16, reps: 10 },
          { weight: 18, reps: 8 },
          { weight: 20, reps: 8 }
        ]
      },
      {
        name: 'Back Extensions',
        muscle: 'Back',
        sets: [
          { weight: 0, reps: 15 },
          { weight: 5, reps: 12 },
          { weight: 10, reps: 10 }
        ]
      },
      // Muscle 2: Biceps (3 variations)
      {
        name: 'Incline Dumbbell Curls',
        muscle: 'Biceps',
        sets: [
          { weight: 10, reps: 12 },
          { weight: 12, reps: 10 },
          { weight: 14, reps: 8 }
        ]
      },
      {
        name: 'Dumbbell Hammer Curls',
        muscle: 'Biceps',
        sets: [
          { weight: 12, reps: 12 },
          { weight: 14, reps: 10 },
          { weight: 16, reps: 8 }
        ]
      },
      {
        name: 'Preacher / Barbell Bicep Curls',
        muscle: 'Biceps',
        sets: [
          { weight: 20, reps: 12 },
          { weight: 25, reps: 10 },
          { weight: 27.5, reps: 8 }
        ]
      }
    ]
  },
  'Legs / Abs': {
    name: 'Legs / Abs',
    muscle1: 'Legs (4 Variations)',
    muscle2: 'Abs (3 Variations)',
    exercises: [
      // Muscle 1: Legs (4 variations)
      {
        name: 'Barbell Squats / Leg Press',
        muscle: 'Legs',
        sets: [
          { weight: 50, reps: 10 },
          { weight: 60, reps: 8 },
          { weight: 70, reps: 6 }
        ]
      },
      {
        name: 'Romanian Deadlifts',
        muscle: 'Legs',
        sets: [
          { weight: 40, reps: 10 },
          { weight: 50, reps: 8 },
          { weight: 55, reps: 8 }
        ]
      },
      {
        name: 'Leg Extensions',
        muscle: 'Legs',
        sets: [
          { weight: 35, reps: 15 },
          { weight: 40, reps: 12 },
          { weight: 45, reps: 10 }
        ]
      },
      {
        name: 'Calf Raises',
        muscle: 'Legs',
        sets: [
          { weight: 30, reps: 15 },
          { weight: 40, reps: 15 },
          { weight: 45, reps: 12 }
        ]
      },
      // Muscle 2: Abs (3 variations)
      {
        name: 'Hanging Leg / Knee Raises',
        muscle: 'Abs',
        sets: [
          { weight: 0, reps: 15 },
          { weight: 0, reps: 15 },
          { weight: 0, reps: 12 }
        ]
      },
      {
        name: 'Cable Woodchoppers / Crunches',
        muscle: 'Abs',
        sets: [
          { weight: 15, reps: 15 },
          { weight: 17.5, reps: 12 },
          { weight: 20, reps: 12 }
        ]
      },
      {
        name: 'Obliques',
        muscle: 'Abs',
        sets: [
          { weight: 10, reps: 15 },
          { weight: 12.5, reps: 15 },
          { weight: 15, reps: 12 }
        ]
      }
    ]
  },
  'Shoulders / Arms & Traps': {
    name: 'Shoulders / Arms & Traps',
    muscle1: 'Shoulders (3 Variations)',
    muscle2: 'Arms / Traps (3 Variations)',
    exercises: [
      // Muscle 1: Shoulders (3 variations)
      {
        name: 'Overhead Dumbbell Shoulder Press',
        muscle: 'Shoulders',
        sets: [
          { weight: 16, reps: 10 },
          { weight: 18, reps: 8 },
          { weight: 20, reps: 6 }
        ]
      },
      {
        name: 'Dumbbell Lateral Raises',
        muscle: 'Shoulders',
        sets: [
          { weight: 8, reps: 15 },
          { weight: 10, reps: 12 },
          { weight: 10, reps: 10 }
        ]
      },
      {
        name: 'Face Pulls / Rear Delt Flyes',
        muscle: 'Shoulders',
        sets: [
          { weight: 15, reps: 15 },
          { weight: 17.5, reps: 12 },
          { weight: 20, reps: 10 }
        ]
      },
      // Muscle 2: Arms / Traps (3 variations)
      {
        name: 'EZ-Bar Bicep Curls',
        muscle: 'Arms / Traps',
        sets: [
          { weight: 20, reps: 12 },
          { weight: 25, reps: 10 },
          { weight: 25, reps: 8 }
        ]
      },
      {
        name: 'Cable Overhead Tricep Extension',
        muscle: 'Arms / Traps',
        sets: [
          { weight: 15, reps: 12 },
          { weight: 17.5, reps: 10 },
          { weight: 20, reps: 8 }
        ]
      },
      {
        name: 'Dumbbell Shrugs (Traps)',
        muscle: 'Arms / Traps',
        sets: [
          { weight: 20, reps: 15 },
          { weight: 22, reps: 12 },
          { weight: 24, reps: 10 }
        ]
      }
    ]
  }
};

export default function WorkoutLogger({ isOpen, onClose }) {
  const { currentLog, logWorkout } = useTrackcal();

  const existing = currentLog?.workout || {};

  const [name, setName] = useState(existing.name || 'Chest / Triceps');
  const [durationMinutes, setDurationMinutes] = useState(existing.durationMinutes || 50);
  const [notes, setNotes] = useState(existing.notes || '');
  const [exercises, setExercises] = useState(
    existing.exercises && existing.exercises.length > 0
      ? existing.exercises
      : WORKOUT_ROUTINES['Chest / Triceps'].exercises
  );

  const handleSelectRoutine = (routineKey) => {
    const routine = WORKOUT_ROUTINES[routineKey];
    if (routine) {
      setName(routine.name);
      setExercises(JSON.parse(JSON.stringify(routine.exercises)));
    }
  };

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        name: 'Custom Exercise',
        muscle: 'Custom',
        sets: [
          { weight: 20, reps: 10 },
          { weight: 20, reps: 10 },
          { weight: 20, reps: 10 }
        ]
      }
    ]);
  };

  const handleRemoveExercise = (exIdx) => {
    setExercises(exercises.filter((_, idx) => idx !== exIdx));
  };

  const handleAddSet = (exIdx) => {
    const updated = [...exercises];
    const lastSet = updated[exIdx].sets[updated[exIdx].sets.length - 1] || { weight: 20, reps: 10 };
    updated[exIdx].sets.push({ ...lastSet });
    setExercises(updated);
  };

  const handleRemoveSet = (exIdx, setIdx) => {
    const updated = [...exercises];
    updated[exIdx].sets = updated[exIdx].sets.filter((_, idx) => idx !== setIdx);
    setExercises(updated);
  };

  const handleSetChange = (exIdx, setIdx, field, val) => {
    const updated = [...exercises];
    updated[exIdx].sets[setIdx][field] = Number(val);
    setExercises(updated);
  };

  const handleExerciseNameChange = (exIdx, val) => {
    const updated = [...exercises];
    updated[exIdx].name = val;
    setExercises(updated);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    logWorkout({
      completed: true,
      name,
      durationMinutes: Number(durationMinutes),
      notes,
      exercises
    });
    onClose();
  };

  // Fixed footer with prominent Cancel (Close) and Save buttons
  const footerActions = (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 sm:gap-3 w-full">
      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
        {exercises.length} Exercises Selected
      </span>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer text-center border border-slate-200 dark:border-slate-700"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 sm:flex-none px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 cursor-pointer text-center"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Workout Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Workout Session"
      footer={footerActions}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Workout Presets & Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Workout Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 font-bold"
              placeholder="e.g. Chest / Triceps, Back / Biceps..."
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Duration (minutes)</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
              <input
                type="number"
                min="10"
                max="240"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
          </div>
        </div>

        {/* 2-Muscle Split Selector */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Select Routine Preset:</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.keys(WORKOUT_ROUTINES).map((key) => {
              const routine = WORKOUT_ROUTINES[key];
              const isSelected = name === routine.name;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectRoutine(key)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-50 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500'
                  }`}
                >
                  <div className="font-bold text-xs truncate">{routine.name}</div>
                  <div className={`text-[10px] mt-1 font-mono ${isSelected ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'}`}>
                    {routine.exercises.length} Variations
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Exercises List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4" />
              <span>Exercise Variations ({exercises.length} Total)</span>
            </h4>
            <button
              type="button"
              onClick={handleAddExercise}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800/60"
            >
              <Plus className="w-3.5 h-3.5" /> + Add Exercise
            </button>
          </div>

          <div className="space-y-3">
            {exercises.map((ex, exIdx) => {
              return (
                <div key={exIdx} className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase font-mono tracking-wider shrink-0 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                        {ex.muscle || 'Exercise'} • #{exIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={ex.name}
                        onChange={(e) => handleExerciseNameChange(exIdx, e.target.value)}
                        className="bg-transparent text-sm font-bold text-slate-900 dark:text-white focus:outline-none border-b border-transparent focus:border-indigo-500 px-1 py-0.5 flex-1"
                        placeholder="Exercise Name..."
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(exIdx)}
                      className="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 text-xs px-2 py-1 rounded-lg flex items-center gap-1 font-bold shrink-0 cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-900/60 transition"
                      title="Remove exercise"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Remove</span>
                    </button>
                  </div>

                  {/* Sets Table */}
                  <div className="space-y-1.5 font-mono text-xs">
                    {ex.sets.map((set, setIdx) => (
                      <div key={setIdx} className="flex items-center justify-between gap-1.5 sm:gap-2 p-2 bg-white dark:bg-slate-950/80 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-bold text-[11px] sm:text-xs shrink-0">Set {setIdx + 1}</span>

                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              value={set.weight}
                              onChange={(e) => handleSetChange(exIdx, setIdx, 'weight', e.target.value)}
                              className="w-13 sm:w-16 px-1.5 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-white text-center font-bold text-xs"
                            />
                            <span className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-[11px]">kg</span>
                          </div>

                          <span className="text-slate-300 dark:text-slate-600">×</span>

                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="1"
                              value={set.reps}
                              onChange={(e) => handleSetChange(exIdx, setIdx, 'reps', e.target.value)}
                              className="w-12 sm:w-14 px-1.5 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-white text-center font-bold text-xs"
                            />
                            <span className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-[11px]">reps</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveSet(exIdx, setIdx)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded text-xs font-bold shrink-0 cursor-pointer"
                          title="Remove set"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddSet(exIdx)}
                      className="mt-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer"
                    >
                      + Add Set
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Session Notes</label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Felt strong, progressive overload on 3rd sets..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900"
          />
        </div>

      </form>
    </Modal>
  );
}
