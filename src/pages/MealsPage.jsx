// src/pages/MealsPage.jsx
import React, { useState } from 'react';
import { Search, Plus, Star, Trash2, Edit2, Utensils, Check } from 'lucide-react';
import { useBulkTrack } from '../context/BulkTrackContext';
import CustomFoodModal from '../components/Meals/CustomFoodModal';

export default function MealsPage() {
  const { foods, toggleFavoriteFood, deleteFood } = useBulkTrack();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'fixed' | 'custom' | 'favorites'
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const filteredFoods = foods.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (f.brand && f.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (activeTab === 'fixed') return f.category === 'Fixed' || f.category === 'Supplement';
    if (activeTab === 'custom') return f.isCustom;
    if (activeTab === 'favorites') return f.isFavorite;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Utensils className="w-6 h-6 text-emerald-400" />
            <span>Food Database & Library</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Browse fixed bulking diet items, custom foods, favorites, and nutritional values.
          </p>
        </div>

        <button
          onClick={() => setIsCustomModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Food</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by food name, brand, or category..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Foods' },
            { id: 'fixed', label: 'Fixed Diet' },
            { id: 'custom', label: 'My Custom Foods' },
            { id: 'favorites', label: '⭐ Favorites' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-black shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFoods.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 text-sm glass-panel rounded-2xl">
            No foods found matching your search criteria.
          </div>
        ) : (
          filteredFoods.map((food) => (
            <div
              key={food.id}
              className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-slate-100 text-base">{food.name}</h3>
                    {food.brand && <p className="text-xs text-slate-400 font-medium">{food.brand}</p>}
                  </div>

                  <button
                    onClick={() => toggleFavoriteFood(food.id)}
                    className="p-1 text-slate-500 hover:text-amber-400 transition"
                  >
                    <Star className={`w-4 h-4 ${food.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400">Serving:</span>
                  <span className="font-bold text-white">{food.servingSize} {food.servingUnit}</span>
                </div>

                {/* Macro Breakdown */}
                <div className="grid grid-cols-5 gap-1 text-center mt-3 p-2 bg-slate-900/60 rounded-xl border border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">kcal</span>
                    <span className="font-bold text-white">{food.calories}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Prot</span>
                    <span className="font-bold text-emerald-400">{food.protein}g</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Carb</span>
                    <span className="font-bold text-cyan-400">{food.carbs}g</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Fat</span>
                    <span className="font-bold text-amber-400">{food.fat}g</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Fib</span>
                    <span className="font-bold text-violet-400">{food.fiber}g</span>
                  </div>
                </div>
              </div>

              {/* Footer Badge & Delete if Custom */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  food.isCustom
                    ? 'bg-purple-950/80 text-purple-300 border-purple-500/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}>
                  {food.isCustom ? 'My Custom Food' : food.category || 'Fixed Item'}
                </span>

                {food.isCustom && (
                  <button
                    onClick={() => deleteFood(food.id)}
                    className="text-slate-500 hover:text-rose-400 text-xs flex items-center gap-1 font-medium transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      <CustomFoodModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
      />

    </div>
  );
}
