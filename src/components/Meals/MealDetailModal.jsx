// src/components/Meals/MealDetailModal.jsx
import React from 'react';
import Modal from '../Shared/Modal';
import { Trash2, Plus, Save, RotateCcw, Edit3 } from 'lucide-react';
import { useBulkTrack } from '../../context/BulkTrackContext';
import { calculateFoodItemNutrition, calculateMealNutrition, getFoodById } from '../../services/nutritionEngine';

export default function MealDetailModal({ isOpen, onClose, mealType, onOpenAddFood }) {
  const {
    currentLog,
    foods,
    updateFoodInMeal,
    removeFoodFromMeal,
    saveMealAsDefault,
    logMeal
  } = useBulkTrack();

  if (!mealType) return null;

  const mealData = currentLog?.meals?.[mealType] || {};
  const items = mealData.items || [];
  const mealTitle = mealType.charAt(0).toUpperCase() + mealType.slice(1);
  const mealNutrition = calculateMealNutrition(items, foods);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${mealTitle} Details`} maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Status Bar */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Meal Status:</span>
            <span className={`ml-2 text-xs font-bold px-2.5 py-0.5 rounded-full ${
              mealData.isLogged
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {mealData.isLogged ? `Logged at ${mealData.loggedAt || 'today'}` : 'Not Logged Yet'}
            </span>
          </div>

          {!mealData.isLogged && (
            <button
              onClick={() => {
                logMeal(mealType);
                onClose();
              }}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-lg uppercase tracking-wider transition shadow-sm"
            >
              Log Meal Now
            </button>
          )}
        </div>

        {/* Nutrition Summary */}
        <div className="grid grid-cols-5 gap-2 text-center p-3 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 font-mono">
          <div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-sans">Calories</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{mealNutrition.calories}</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-sans">Protein</div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{mealNutrition.protein}g</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-sans">Carbs</div>
            <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">{mealNutrition.carbs}g</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-sans">Fat</div>
            <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">{mealNutrition.fat}g</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-sans">Fiber</div>
            <div className="text-sm font-bold text-violet-600 dark:text-violet-400 mt-0.5">{mealNutrition.fiber}g</div>
          </div>
        </div>

        {/* Food Items Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
            <span>Food Item</span>
            <span>Quantity & Macros</span>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
              No items in this meal yet. Tap "+ Add Food" below!
            </div>
          ) : (
            items.map((item, idx) => {
              const food = getFoodById(foods, item.foodId);
              if (!food) return null;

              const itemNutr = calculateFoodItemNutrition(food, item.quantity, item.unit);

              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                      <span>{food.name}</span>
                      {food.brand && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">({food.brand})</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      {itemNutr.calories} kcal • {itemNutr.protein}g P • {itemNutr.carbs}g C • {itemNutr.fat}g F
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quantity edit input */}
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateFoodInMeal(mealType, idx, e.target.value, item.unit)}
                      className="w-20 px-2.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900"
                    />

                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{item.unit || food.servingUnit}</span>

                    <button
                      onClick={() => removeFoodFromMeal(mealType, idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition ml-1"
                      title="Remove food from meal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              onClose();
              onOpenAddFood(mealType);
            }}
            className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800/60"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Manual Food</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                saveMealAsDefault(mealType);
                onClose();
              }}
              className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800/60"
              title="Save current foods as new default template"
            >
              <Save className="w-4 h-4" />
              <span>Save as Default</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
}
