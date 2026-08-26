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
      isLogged ? 'border-emerald-300 bg-emerald-50/30 shadow-md' : 'border-slate-200 hover:border-slate-300'
    }`}>
      {/* Header Row */}
      <div className="p-5 flex items-center justify-between gap-4">
        
        {/* Left Info */}
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
            isLogged ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500'
          }`}>
            {icon}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">{label}</h3>
              {isLogged ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Logged
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">
                  <Circle className="w-3 h-3" /> Not Logged
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1 font-mono text-xs">
              <span className="font-bold text-slate-800">{nutrition.calories} kcal</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-600 font-semibold">{nutrition.protein}g P</span>
              <span className="text-slate-300">•</span>
              <span className="text-cyan-600 font-semibold">{nutrition.carbs}g C</span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-600 font-semibold">{nutrition.fat}g F</span>
            </div>
          </div>
        </div>

        {/* Right Primary Button */}
        <div className="flex items-center gap-2">
          {!isLogged ? (
            <button
              onClick={() => onLogMeal(mealType)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/20 hover:brightness-110 active:scale-95 transition"
            >
              Log {label}
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onAddFood(mealType)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-emerald-600 text-xs font-bold hover:bg-slate-200 transition flex items-center gap-1"
                title="Add manual food item"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Food</span>
              </button>

              <button
                onClick={() => onOpenDetail(mealType)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition"
                title="View & edit food list"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onUndoMeal(mealType)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-rose-500 hover:bg-slate-200 transition"
                title="Undo log"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Expandable Food List Summary */}
      <div className="border-t border-slate-200/60 px-5 py-2 bg-slate-50/40 flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 font-medium hover:text-slate-700 transition"
        >
          <span>{currentItems.length} food items</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenDetail(mealType)}
            className="text-indigo-500 hover:underline font-semibold flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Expanded List Items */}
      {expanded && (
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/60 space-y-2 text-xs">
          {currentItems.map((item, idx) => {
            const foodObj = foodsDatabase.find(f => f.id === item.foodId);
            return (
              <div key={idx} className="flex items-center justify-between py-1 px-2 rounded-lg bg-white text-slate-600 border border-slate-100">
                <span className="font-medium text-slate-700">{foodObj?.name || item.foodId}</span>
                <span className="font-mono text-indigo-600">{item.quantity} {item.unit || foodObj?.servingUnit || 'g'}</span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
