// src/components/Layout/Navigation.jsx
import React from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Dumbbell, 
  TrendingUp, 
  Settings, 
  Pill, 
  BarChart2, 
  Zap
} from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'meals', label: 'Meals', icon: UtensilsCrossed },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'supplements', label: 'Supplements', icon: Pill },
    { id: 'summary', label: 'Report', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const primaryNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'meals', label: 'Meals', icon: UtensilsCrossed },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const secondaryNav = [
    { id: 'supplements', label: 'Supplements', icon: Pill },
    { id: 'summary', label: 'Weekly Report', icon: BarChart2 },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shrink-0 fixed inset-y-0 left-0 z-30 shadow-sm transition-colors duration-200">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Trackcal</h1>
          </div>
        </div>

        {/* Primary Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">Main Menu</div>
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mt-6 mb-2">Analytics & Extra</div>
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Target Card */}
        <div className="mt-auto pt-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bulking Target</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">2,725 kcal • 105g P</div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-mono">4 Days/Wk Training</div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (Safe area insets & smooth horizontal scrolling) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-xl px-1 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-2xl transition-colors duration-200 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-around min-w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                <span className="text-[9px] font-medium leading-tight whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
