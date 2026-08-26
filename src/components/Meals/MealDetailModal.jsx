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
        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div>
            <span className="text-xs text-slate-500 font-medium">Meal Status:</span>
            <span className={`ml-2 text-xs font-bold px-2.5 py-0.5 rounded-full ${
              mealData.isLogged
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                : 'bg-slate-200 text-slate-600'
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
        <div className="grid grid-cols-5 gap-2 text-center p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono">
          <div>
            <div className="text-[11px] text-slate-400 font-sans">Calories</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{mealNutrition.calories}</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-sans">Protein</div>
            <div className="text-sm font-bold text-emerald-600 mt-0.5">{mealNutrition.protein}g</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-sans">Carbs</div>
            <div className="text-sm font-bold text-cyan-600 mt-0.5">{mealNutrition.carbs}g</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-sans">Fat</div>
            <div className="text-sm font-bold text-amber-600 mt-0.5">{mealNutrition.fat}g</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-sans">Fiber</div>
            <div className="text-sm font-bold text-violet-600 mt-0.5">{mealNutrition.fiber}g</div>
          </div>
        </div>

        {/* Food Items Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            <span>Food Item</span>
            <span>Quantity & Macros</span>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
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
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition shadow-sm"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      <span>{food.name}</span>
                      {food.brand && (
                        <span className="text-[10px] text-slate-400 font-normal">({food.brand})</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
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
                      className="w-20 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono font-bold focus:outline-none focus:border-indigo-500 focus:bg-white"
                    />

                    <span className="text-xs text-slate-500 font-mono">{item.unit || food.servingUnit}</span>

                    <button
                      onClick={() => removeFoodFromMeal(mealType, idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition ml-1"
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
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              onClose();
              onOpenAddFood(mealType);
            }}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-emerald-200"
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
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-indigo-200"
              title="Save current foods as new default template"
            >
              <Save className="w-4 h-4" />
              <span>Save as Default</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
}
