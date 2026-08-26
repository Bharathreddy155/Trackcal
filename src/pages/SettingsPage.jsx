// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { Settings, User, Target, Database, Download, Upload, RefreshCw, Save, AlertTriangle, Cloud, CloudCheck, Wifi, Key } from 'lucide-react';
import { useBulkTrack } from '../context/BulkTrackContext';

export default function SettingsPage() {
  const {
    profile,
    updateProfile,
    targets,
    updateTargets,
    syncCode,
    updateSyncCode,
    isCloudConnected,
    lastSyncTime,
    syncToCloud,
    handleExport,
    handleImport,
    handleReset
  } = useBulkTrack();

  const [profileForm, setProfileForm] = useState({ ...profile });
  const [targetForm, setTargetForm] = useState({ ...targets });
  const [syncCodeInput, setSyncCodeInput] = useState(syncCode);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  const handleTargetSubmit = (e) => {
    e.preventDefault();
    updateTargets(targetForm);
  };

  const handleSyncCodeSubmit = (e) => {
    e.preventDefault();
    updateSyncCode(syncCodeInput);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        handleImport(parsed);
      } catch (err) {
        alert('Failed to parse backup JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          <span>Application Settings & Profile</span>
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Customize your profile, daily bulking calorie and macro targets, real-time cloud sync, and backup options.
        </p>
      </div>

      {/* 1. Real-time Cloud Sync Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-200 space-y-4 bg-gradient-to-r from-white via-white to-indigo-50/40">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Multi-Device Real-Time Cloud Sync</h3>
          </div>

          <div className="flex items-center gap-2">
            {isCloudConnected ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> Cloud Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-500">
                Local Mode
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Enter the same <strong>Sync Code</strong> on your Phone and Laptop. Any meal, workout, or weight logged on one device will automatically sync to all devices in real-time!
        </p>

        <form onSubmit={handleSyncCodeSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
          <div className="relative flex-1">
            <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={syncCodeInput}
              onChange={(e) => setSyncCodeInput(e.target.value)}
              placeholder="e.g. bharath-bulking-70kg"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono font-bold focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5"
          >
            <CloudCheck className="w-4 h-4" />
            <span>Connect & Link Devices</span>
          </button>
        </form>

        {lastSyncTime && (
          <div className="text-[11px] text-slate-500 font-mono pt-1">
            Last Cloud Sync: {lastSyncTime} • Sharing code: <strong className="text-indigo-600">{syncCode}</strong>
          </div>
        )}
      </div>

      {/* 2. Profile Settings Card */}
      <form onSubmit={handleProfileSubmit} className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <User className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">User Profile</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Age</label>
            <input
              type="number"
              value={profileForm.age}
              onChange={(e) => setProfileForm({ ...profileForm, age: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Height (cm)</label>
            <input
              type="number"
              value={profileForm.heightCm}
              onChange={(e) => setProfileForm({ ...profileForm, heightCm: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Current Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={profileForm.currentWeightKg}
              onChange={(e) => setProfileForm({ ...profileForm, currentWeightKg: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Goal Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={profileForm.goalWeightKg}
              onChange={(e) => setProfileForm({ ...profileForm, goalWeightKg: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-emerald-600 font-mono text-sm font-bold focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Body Fat %</label>
            <input
              type="number"
              step="0.1"
              value={profileForm.bodyFatPercentage}
              onChange={(e) => setProfileForm({ ...profileForm, bodyFatPercentage: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* 3. Daily Nutrition Targets Card */}
      <form onSubmit={handleTargetSubmit} className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <Target className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Daily Nutrition Targets</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Calories (kcal)</label>
            <input
              type="number"
              value={targetForm.calories}
              onChange={(e) => setTargetForm({ ...targetForm, calories: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm font-bold focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Protein (g)</label>
            <input
              type="number"
              value={targetForm.protein}
              onChange={(e) => setTargetForm({ ...targetForm, protein: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-emerald-600 font-mono text-sm font-bold focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Carbohydrates (g)</label>
            <input
              type="number"
              value={targetForm.carbs}
              onChange={(e) => setTargetForm({ ...targetForm, carbs: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-cyan-600 font-mono text-sm font-bold focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Fat (g)</label>
            <input
              type="number"
              value={targetForm.fat}
              onChange={(e) => setTargetForm({ ...targetForm, fat: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-amber-600 font-mono text-sm font-bold focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Fiber (g)</label>
            <input
              type="number"
              value={targetForm.fiber}
              onChange={(e) => setTargetForm({ ...targetForm, fiber: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-violet-600 font-mono text-sm font-bold focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Nutrition Targets</span>
          </button>
        </div>
      </form>

      {/* 4. Data Backup, Export & Reset */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <Database className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Data Persistence & Manual Backup</h3>
        </div>

        <p className="text-xs text-slate-500">
          In addition to cloud sync, you can export a full JSON backup file or restore from a previously saved JSON file anytime.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-emerald-700 text-xs font-bold rounded-xl transition flex items-center gap-2 border border-slate-200"
          >
            <Download className="w-4 h-4" />
            <span>Export Data (JSON)</span>
          </button>

          <label className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-indigo-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2 border border-slate-200">
            <Upload className="w-4 h-4" />
            <span>Import Backup (JSON)</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-xl transition flex items-center gap-2 ml-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset All Data</span>
          </button>
        </div>

        {/* Reset Confirmation Box */}
        {showResetConfirm && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Are you sure you want to delete all saved meal logs, custom foods, workouts, and settings?</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 bg-white text-xs font-bold text-slate-700 rounded-lg hover:bg-slate-100 border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleReset();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 bg-rose-600 text-xs font-black text-white rounded-lg hover:bg-rose-700 shadow-sm"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
