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

import { useTrackcal } from '../context/TrackcalContext';
import { calculateDailyTotals } from '../services/nutritionEngine';

export default function DashboardPage() {
  const {
    currentLog,
    targets,
    foods,
    mealTemplates,
    logMeal,
    undoMeal,
  } = useTrackcal();

  const [detailMealType, setDetailMealType] = useState(null);
  const [addFoodMealType, setAddFoodMealType] = useState(null);
  const [isCustomFoodOpen, setIsCustomFoodOpen] = useState(false);
  const [isWorkoutLoggerOpen, setIsWorkoutLoggerOpen] = useState(false);

  const consumed = calculateDailyTotals(currentLog, foods);
  const dayType = currentLog?.dayType || 'non-chicken';
  const chickenQty = currentLog?.chickenQuantity || 175;
  const curryQtyLunch = currentLog?.curryQuantityLunch || 60;
  const curryQtyDinner = currentLog?.curryQuantityDinner || 60;

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
          <h2 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <span>🍱 Daily Meals</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">
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

      {/* 5. Body Weight Tracker */}
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
