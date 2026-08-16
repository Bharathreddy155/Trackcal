// src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import CalorieRing from '../components/Dashboard/CalorieRing';
import MacroCards from '../components/Dashboard/MacroCards';
import MealCard from '../components/Dashboard/MealCard';
import SupplementBar from '../components/Dashboard/SupplementBar';
import QuickWeight from '../components/Dashboard/QuickWeight';

import MealDetailModal from '../components/Meals/MealDetailModal';
import AddFoodModal from '../components/Meals/AddFoodModal';
import CustomFoodModal from '../components/Meals/CustomFoodModal';
import WorkoutLogger from '../components/Workout/WorkoutLogger';

import { useBulkTrack } from '../context/BulkTrackContext';
import { calculateDailyTotals } from '../services/nutritionEngine';
import { Dumbbell, Plus, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const {
    currentLog,
    targets,
    foods,
    mealTemplates,
    logMeal,
    undoMeal,
    undoWorkout
  } = useBulkTrack();

  const [detailMealType, setDetailMealType] = useState(null);
  const [addFoodMealType, setAddFoodMealType] = useState(null);
  const [isCustomFoodOpen, setIsCustomFoodOpen] = useState(false);
  const [isWorkoutLoggerOpen, setIsWorkoutLoggerOpen] = useState(false);

  const consumed = calculateDailyTotals(currentLog, foods);
  const dayType = currentLog?.dayType || 'non-chicken';
  const chickenQty = currentLog?.chickenQuantity || 175;
  const curryQtyLunch = currentLog?.curryQuantityLunch || 60;
  const curryQtyDinner = currentLog?.curryQuantityDinner || 60;

  const workout = currentLog?.workout || {};

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* 1. Calorie Progress Ring */}
      <CalorieRing
        consumed={consumed.calories}
        target={targets.calories || 2725}
        minTarget={targets.caloriesMin || 2700}
        maxTarget={targets.caloriesMax || 2750}
      />

      {/* 2. Macro Progress Cards */}
      <MacroCards consumed={consumed} targets={targets} />

      {/* 3. Meal Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <span>🍱 Daily Meals</span>
            <span className="text-xs text-slate-400 font-normal">
              ({dayType === 'chicken' ? `Chicken Day ${chickenQty}g` : 'Non-Chicken Day'})
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MealCard
            mealType="breakfast"
            label="Breakfast"
            icon="🥣"
            mealData={currentLog?.meals?.breakfast}
            dayType={dayType}
            chickenQty={chickenQty}
            curryQtyLunch={curryQtyLunch}
            curryQtyDinner={curryQtyDinner}
            foodsDatabase={foods}
            mealTemplates={mealTemplates}
            onLogMeal={logMeal}
            onUndoMeal={undoMeal}
            onOpenDetail={setDetailMealType}
            onAddFood={setAddFoodMealType}
          />

          <MealCard
            mealType="lunch"
            label="Lunch"
            icon="🍚"
            mealData={currentLog?.meals?.lunch}
            dayType={dayType}
            chickenQty={chickenQty}
            curryQtyLunch={curryQtyLunch}
            curryQtyDinner={curryQtyDinner}
            foodsDatabase={foods}
            mealTemplates={mealTemplates}
            onLogMeal={logMeal}
            onUndoMeal={undoMeal}
            onOpenDetail={setDetailMealType}
            onAddFood={setAddFoodMealType}
          />

          <MealCard
            mealType="snack"
            label="Snack (Pre/Post Workout)"
            icon="🥖"
            mealData={currentLog?.meals?.snack}
            dayType={dayType}
            chickenQty={chickenQty}
            curryQtyLunch={curryQtyLunch}
            curryQtyDinner={curryQtyDinner}
            foodsDatabase={foods}
            mealTemplates={mealTemplates}
            onLogMeal={logMeal}
            onUndoMeal={undoMeal}
            onOpenDetail={setDetailMealType}
            onAddFood={setAddFoodMealType}
          />

          <MealCard
            mealType="dinner"
            label="Dinner"
            icon="🍛"
            mealData={currentLog?.meals?.dinner}
            dayType={dayType}
            chickenQty={chickenQty}
            curryQtyLunch={curryQtyLunch}
            curryQtyDinner={curryQtyDinner}
            foodsDatabase={foods}
            mealTemplates={mealTemplates}
            onLogMeal={logMeal}
            onUndoMeal={undoMeal}
            onOpenDetail={setDetailMealType}
            onAddFood={setAddFoodMealType}
          />
        </div>
      </div>

      {/* 4. Supplements Tracker */}
      <SupplementBar />

      {/* 5. Today's Workout Quick Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
            workout.completed
              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-800 text-slate-400'
          }`}>
            <Dumbbell className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Today's Workout</h3>
              {workout.completed ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  ✅ Completed
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  Not Completed
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {workout.completed
                ? `${workout.name || 'Workout'} • ${workout.durationMinutes} mins • ${workout.exercises?.length || 0} exercises`
                : 'Target: 4 workouts per week for bulking'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {workout.completed ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsWorkoutLoggerOpen(true)}
                className="px-3.5 py-2 bg-slate-800 text-xs font-bold text-slate-200 rounded-xl hover:bg-slate-700 transition"
              >
                Edit Workout
              </button>
              <button
                onClick={undoWorkout}
                className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-rose-400 transition"
              >
                Clear
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsWorkoutLoggerOpen(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Log Workout</span>
            </button>
          )}
        </div>
      </div>

      {/* 6. Body Weight Tracker */}
      <QuickWeight />

      {/* Modals */}
      <MealDetailModal
        isOpen={Boolean(detailMealType)}
        onClose={() => setDetailMealType(null)}
        mealType={detailMealType}
        onOpenAddFood={(type) => {
          setDetailMealType(null);
          setAddFoodMealType(type);
        }}
      />

      <AddFoodModal
        isOpen={Boolean(addFoodMealType)}
        onClose={() => setAddFoodMealType(null)}
        targetMealType={addFoodMealType}
        onOpenCustomFood={() => setIsCustomFoodOpen(true)}
      />

      <CustomFoodModal
        isOpen={isCustomFoodOpen}
        onClose={() => setIsCustomFoodOpen(false)}
      />

      <WorkoutLogger
        isOpen={isWorkoutLoggerOpen}
        onClose={() => setIsWorkoutLoggerOpen(false)}
      />

    </div>
  );
}
