// src/components/Dashboard/MealCard.jsx
import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Edit2, RotateCcw, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateMealNutrition, getPlannedMealItems } from '../../services/nutritionEngine';

export default function MealCard({
  mealType,
  label,
  icon,
  mealData = {},
  dayType = 'non-chicken',
  chickenQty = 175,
  curryQtyLunch = 60,
  curryQtyDinner = 60,
  foodsDatabase = [],
  mealTemplates = null,
  onLogMeal,
  onUndoMeal,
  onOpenDetail,
  onAddFood
}) {
  const [expanded, setExpanded] = useState(false);

  const isLogged = Boolean(mealData.isLogged);

  const currentItems = mealData.items && mealData.items.length > 0
    ? mealData.items
    : getPlannedMealItems(dayType, mealType, chickenQty, curryQtyLunch, curryQtyDinner, mealTemplates);

  const nutrition = calculateMealNutrition(currentItems, foodsDatabase);

  return (
    <div className={`glass-panel rounded-2xl border transition-all ${
      isLogged
        ? 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/30 shadow-md'
        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
    }`}>
      {/* Header Row */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        
        {/* Left Info */}
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
            isLogged
              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            {icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">{label}</h3>
              {isLogged ? (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 shrink-0">
                  <CheckCircle2 className="w-3 h-3" /> Logged
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 shrink-0">
                  <Circle className="w-3 h-3" /> Pending
                </span>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1 font-mono text-[11px] sm:text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">{nutrition.calories} kcal</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{nutrition.protein}g P</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{nutrition.carbs}g C</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">{nutrition.fat}g F</span>
            </div>
          </div>
        </div>

        {/* Right Primary Buttons (Full-width on mobile if unlogged, or compact row) */}
        <div className="flex items-center justify-end gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/60">
          {!isLogged ? (
            <button
              onClick={() => onLogMeal(mealType)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-indigo-500/20 active:scale-95 transition cursor-pointer text-center"
            >
              Log Meal
            </button>
          ) : (
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
              <button
                onClick={() => onAddFood(mealType)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer"
                title="Add manual food item"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Food</span>
              </button>

              <button
                onClick={() => onOpenDetail(mealType)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                title="View & edit food list"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onUndoMeal(mealType)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                title="Undo log"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Expandable Food List Summary */}
      <div className="border-t border-slate-200/60 dark:border-slate-800/80 px-4 sm:px-5 py-2.5 bg-slate-50/40 dark:bg-slate-900/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 font-medium hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
        >
          <span>{currentItems.length} food items</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenDetail(mealType)}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer text-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Expanded List Items */}
      {expanded && (
        <div className="p-3 sm:p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 space-y-1.5 text-xs">
          {currentItems.map((item, idx) => {
            const foodObj = foodsDatabase.find(f => f.id === item.foodId);
            return (
              <div key={idx} className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                <span className="font-medium text-[11px] sm:text-xs">{foodObj?.name || item.foodId}</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 text-[11px] sm:text-xs">{item.quantity} {item.unit || foodObj?.servingUnit || 'g'}</span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
