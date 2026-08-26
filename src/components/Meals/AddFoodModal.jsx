// src/components/Meals/AddFoodModal.jsx
import React, { useState, useMemo } from 'react';
import Modal from '../Shared/Modal';
import { Search, Star, Plus, Check, ArrowRight } from 'lucide-react';
import { useBulkTrack } from '../../context/BulkTrackContext';
import { calculateFoodItemNutrition } from '../../services/nutritionEngine';

export default function AddFoodModal({ isOpen, onClose, targetMealType, onOpenCustomFood }) {
  const { foods, toggleFavoriteFood, addFoodToMeal } = useBulkTrack();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'fixed' | 'custom' | 'favorites'
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('g');

  // Filter food items
  const filteredFoods = useMemo(() => {
    return foods.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (f.brand && f.brand.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;

      if (activeTab === 'fixed') return f.category === 'Fixed' || f.category === 'Supplement';
      if (activeTab === 'custom') return f.isCustom;
      if (activeTab === 'favorites') return f.isFavorite;
      return true;
    });
  }, [foods, searchQuery, activeTab]);

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setQuantity(food.servingSize || 100);
    setUnit(food.servingUnit || 'g');
  };

  const handleAdd = () => {
    if (!selectedFood || !targetMealType) return;
    addFoodToMeal(targetMealType, selectedFood.id, quantity, unit);
    setSelectedFood(null);
    onClose();
  };

  const previewNutrition = selectedFood
    ? calculateFoodItemNutrition(selectedFood, quantity, unit)
    : { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Food to ${targetMealType?.toUpperCase() || 'Meal'}`} maxWidth="max-w-xl">
      <div className="space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food name or brand..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'All Foods' },
            { id: 'fixed', label: 'Fixed Diet' },
            { id: 'custom', label: 'My Foods' },
            { id: 'favorites', label: '⭐ Favorites' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                activeTab === t.id
                  ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Food List Container */}
        <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
          {filteredFoods.length === 0 ? (
            <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">
              No matching foods found. Create a custom food below!
            </div>
          ) : (
            filteredFoods.map((food) => {
              const isSelected = selectedFood?.id === food.id;
              return (
                <div
                  key={food.id}
                  onClick={() => handleSelectFood(food)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-500 text-slate-900 dark:text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{food.name}</span>
                      {food.brand && <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">({food.brand})</span>}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      Per {food.servingSize} {food.servingUnit}: {food.calories} kcal • {food.protein}g P • {food.carbs}g C • {food.fat}g F
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteFood(food.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-amber-500 transition"
                    title="Toggle Favorite"
                  >
                    <Star className={`w-4 h-4 ${food.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Food Quantity & Macro Preview Panel */}
        {selectedFood && (
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-indigo-200 dark:border-indigo-800/60 rounded-xl space-y-3 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">Configure Serving</span>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{selectedFood.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1 font-medium">Quantity</label>
                <input
                  type="number"
                  step="1"
                  min="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono text-sm font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="w-28">
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1 font-medium">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-indigo-500"
                >
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="piece">piece</option>
                  <option value="slice">slice</option>
                  <option value="serving">serving</option>
                  <option value="scoop">scoop</option>
                </select>
              </div>
            </div>

            {/* Macro Calculation Live Result */}
            <div className="grid grid-cols-5 gap-1 text-center p-2 bg-white dark:bg-slate-900 rounded-lg text-xs font-mono border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-sans">Calories</span>
                <span className="font-bold text-slate-900 dark:text-white">{previewNutrition.calories}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-sans">Protein</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{previewNutrition.protein}g</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-sans">Carbs</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">{previewNutrition.carbs}g</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-sans">Fat</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{previewNutrition.fat}g</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-sans">Fiber</span>
                <span className="font-bold text-violet-600 dark:text-violet-400">{previewNutrition.fiber}g</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              onClose();
              onOpenCustomFood();
            }}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Create Custom Food</span>
          </button>

          <button
            disabled={!selectedFood}
            onClick={handleAdd}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              selectedFood
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            + Add to {targetMealType}
          </button>
        </div>

      </div>
    </Modal>
  );
}
