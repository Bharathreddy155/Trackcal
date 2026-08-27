// src/components/Workout/WorkoutLogger.jsx
import React, { useState } from 'react';
import Modal from '../Shared/Modal';
import { Dumbbell, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { useBulkTrack } from '../../context/BulkTrackContext';

export default function WorkoutLogger({ isOpen, onClose }) {
  const { currentLog, logWorkout } = useBulkTrack();

  const existing = currentLog?.workout || {};

  const [name, setName] = useState(existing.name || 'Chest / Triceps');
  const [durationMinutes, setDurationMinutes] = useState(existing.durationMinutes || 45);
  const [notes, setNotes] = useState(existing.notes || '');
  const [exercises, setExercises] = useState(
    existing.exercises && existing.exercises.length > 0
      ? existing.exercises
      : [
          {
            name: 'Bench Press',
            sets: [
              { weight: 40, reps: 10 },
              { weight: 40, reps: 8 },
              { weight: 45, reps: 6 }
            ]
          },
          {
            name: 'Tricep Rope Pushdowns',
            sets: [
              { weight: 20, reps: 12 },
              { weight: 25, reps: 10 }
            ]
          }
        ]
  );

  const handleAddExercise = () => {
    setExercises([...exercises, { name: 'Incline Dumbbell Press', sets: [{ weight: 15, reps: 10 }] }]);
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
    e.preventDefault();
    logWorkout({
      completed: true,
      name,
      durationMinutes: Number(durationMinutes),
      notes,
      exercises
    });
    onClose();
  };

  const footerActions = (
    <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 sm:gap-3 w-full">
      <button
        type="button"
        onClick={onClose}
        className="w-full sm:w-auto px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer text-center"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>Save Workout Session</span>
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Workout Session"
      footer={footerActions}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        
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

        {/* Quick Routine Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mr-1 shrink-0">Routines:</span>
          {['Chest / Triceps', 'Back / Biceps', 'Legs / Abs', 'Shoulders / Arms'].map((routine) => (
            <button
              key={routine}
              type="button"
              onClick={() => setName(routine)}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                name === routine
                  ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500'
              }`}
            >
              {routine}
            </button>
          ))}
        </div>

        {/* Exercises & Sets */}
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Exercises ({exercises.length})</h4>
            <button
              type="button"
              onClick={handleAddExercise}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Exercise
            </button>
          </div>

          {exercises.map((ex, exIdx) => (
            <div key={exIdx} className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={ex.name}
                  onChange={(e) => handleExerciseNameChange(exIdx, e.target.value)}
                  className="bg-transparent text-sm font-bold text-slate-900 dark:text-white focus:outline-none border-b border-transparent focus:border-indigo-500 px-1 py-0.5 flex-1"
                  placeholder="Exercise Name..."
                />

                <button
                  type="button"
                  onClick={() => handleRemoveExercise(exIdx)}
                  className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs p-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Sets Table */}
              <div className="space-y-1.5 font-mono text-xs">
                {ex.sets.map((set, setIdx) => (
                  <div key={setIdx} className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-slate-950/80 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-[11px] sm:text-xs shrink-0">Set {setIdx + 1}</span>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={set.weight}
                          onChange={(e) => handleSetChange(exIdx, setIdx, 'weight', e.target.value)}
                          className="w-12 sm:w-16 px-1.5 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-white text-center font-bold text-xs"
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
                          className="w-11 sm:w-14 px-1.5 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-white text-center font-bold text-xs"
                        />
                        <span className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-[11px]">reps</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSet(exIdx, setIdx)}
                      className="text-slate-400 hover:text-rose-500 text-xs p-1 cursor-pointer"
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
          ))}
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Session Notes</label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Felt good on bench press, progressive overload on set 3..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900"
          />
        </div>

      </form>
    </Modal>
  );
}
