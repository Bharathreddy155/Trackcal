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

  // If meal is logged, calculate nutrition from actual logged items.
  // If not logged, calculate expected planned nutrition from template!
  const currentItems = mealData.items && mealData.items.length > 0
    ? mealData.items
    : getPlannedMealItems(dayType, mealType, chickenQty, curryQtyLunch, curryQtyDinner, mealTemplates);

  const nutrition = calculateMealNutrition(currentItems, foodsDatabase);

  return (
    <div className={`glass-panel rounded-2xl border transition-all ${
      isLogged ? 'border-emerald-500/40 bg-slate-900/90 shadow-lg' : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Header Row */}
      <div className="p-5 flex items-center justify-between gap-4">
        
        {/* Left Info */}
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
            isLogged ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800/80 text-slate-300'
          }`}>
            {icon}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">{label}</h3>
              {isLogged ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Logged
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  <Circle className="w-3 h-3" /> Not Logged
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1 font-mono text-xs">
              <span className="font-bold text-white">{nutrition.calories} kcal</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-semibold">{nutrition.protein}g P</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-semibold">{nutrition.carbs}g C</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400 font-semibold">{nutrition.fat}g F</span>
            </div>
          </div>
        </div>

        {/* Right Primary Button */}
        <div className="flex items-center gap-2">
          {!isLogged ? (
            <button
              onClick={() => onLogMeal(mealType)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition"
            >
              Log {label}
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onAddFood(mealType)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-emerald-400 text-xs font-bold hover:bg-slate-700 transition flex items-center gap-1"
                title="Add manual food item"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Food</span>
              </button>

              <button
                onClick={() => onOpenDetail(mealType)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                title="View & edit food list"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onUndoMeal(mealType)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition"
                title="Undo log"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Expandable Food List Summary */}
      <div className="border-t border-slate-800/60 px-5 py-2 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 font-medium hover:text-slate-200 transition"
        >
          <span>{currentItems.length} food items</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenDetail(mealType)}
            className="text-cyan-400 hover:underline font-semibold flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Expanded List Items */}
      {expanded && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/80 space-y-2 text-xs">
          {currentItems.map((item, idx) => {
            const foodObj = foodsDatabase.find(f => f.id === item.foodId);
            return (
              <div key={idx} className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-900/60 text-slate-300">
                <span className="font-medium text-slate-200">{foodObj?.name || item.foodId}</span>
                <span className="font-mono text-emerald-400">{item.quantity} {item.unit || foodObj?.servingUnit || 'g'}</span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
