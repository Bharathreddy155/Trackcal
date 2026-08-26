// src/components/Layout/Header.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sparkles, Sun, Moon } from 'lucide-react';
import { useBulkTrack } from '../../context/BulkTrackContext';
import { getGreeting, getDisplayDate, getFormattedDateString } from '../../services/dateService';

export default function Header() {
  const {
    currentDate,
    setCurrentDate,
    goToNextDay,
    goToPrevDay,
    goToToday,
    profile,
    currentLog,
    setDayType,
    setChickenQty,
    theme,
    toggleTheme
  } = useBulkTrack();

  const isToday = currentDate === getFormattedDateString();
  const dayType = currentLog?.dayType || 'non-chicken';
  const chickenQty = currentLog?.chickenQuantity || 175;

  return (
    <header className="sticky top-0 z-20 glass-header px-4 py-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Greeting & Date */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {getGreeting()}, {profile.name || 'Bharath'} 👋
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            {getDisplayDate(currentDate)}
          </p>
        </div>

        {/* Right Controls: Date Picker + Day Type Toggle + Theme Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Theme Toggle Button (Night Mode / Normal Mode) */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition active:scale-95"
            title={theme === 'dark' ? 'Switch to Normal (Light) Mode' : 'Switch to Night (Dark) Mode'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline">Normal</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-500" />
                <span className="hidden sm:inline">Night</span>
              </>
            )}
          </button>

          {/* Date Selector Pills */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
            <button
              onClick={goToPrevDay}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={goToToday}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                isToday
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Today
            </button>

            <button
              onClick={goToNextDay}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <input
              type="date"
              value={currentDate}
              onChange={(e) => e.target.value && setCurrentDate(e.target.value)}
              className="bg-transparent text-xs text-slate-500 dark:text-slate-400 px-2 cursor-pointer focus:outline-none"
            />
          </div>

          {/* Day Type Selector (Non-Chicken Day vs Chicken Day) */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setDayType('non-chicken')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                dayType === 'non-chicken'
                  ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <span>🥚</span>
              <span>Non-Chicken Day</span>
            </button>

            <button
              onClick={() => setDayType('chicken')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                dayType === 'chicken'
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <span>🍗</span>
              <span>Chicken Day</span>
            </button>
          </div>

          {/* Chicken Portion Selector (Only shown on Chicken Day) */}
          {dayType === 'chicken' && (
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-1 animate-fade-in">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 px-2 uppercase tracking-wider">Chicken:</span>
              {[150, 175, 200].map((qty) => (
                <button
                  key={qty}
                  onClick={() => setChickenQty(qty)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    chickenQty === qty
                      ? 'bg-amber-500 text-white font-black shadow'
                      : 'text-amber-600/70 dark:text-amber-300/70 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                  }`}
                >
                  {qty}g
                </button>
              ))}
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
