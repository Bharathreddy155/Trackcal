// src/components/Meals/CustomFoodModal.jsx
import React, { useState } from 'react';
import Modal from '../Shared/Modal';
import { useBulkTrack } from '../../context/BulkTrackContext';

export default function CustomFoodModal({ isOpen, onClose }) {
  const { saveCustomFood } = useBulkTrack();

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    servingSize: 100,
    servingUnit: 'g',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    saveCustomFood(formData);
    setFormData({
      name: '',
      brand: '',
      servingSize: 100,
      servingUnit: 'g',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Custom Food" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Food Name *</label>
          <input
            type="text"
            required
            placeholder="e.g., Homemade Paneer Curry, Apple, Whey..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Brand / Source (Optional)</label>
          <input
            type="text"
            placeholder="e.g., Local Market, Amul, Homemade"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Serving Size</label>
            <input
              type="number"
              step="1"
              min="1"
              value={formData.servingSize}
              onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Serving Unit</label>
            <select
              value={formData.servingUnit}
              onChange={(e) => setFormData({ ...formData, servingUnit: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-sm focus:outline-none focus:border-indigo-500"
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

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Calories (kcal)</label>
            <input
              type="number"
              step="1"
              min="0"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Protein (g)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.protein}
              onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-emerald-600 font-mono text-sm font-bold focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Carbohydrates (g)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.carbs}
              onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-cyan-600 font-mono text-sm font-bold focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Fat (g)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.fat}
              onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-amber-600 font-mono text-sm font-bold focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div className="col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">Fiber (g)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.fiber}
              onChange={(e) => setFormData({ ...formData, fiber: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-violet-600 font-mono text-sm font-bold focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow-sm"
          >
            Save Custom Food
          </button>
        </div>
      </form>
    </Modal>
  );
}
