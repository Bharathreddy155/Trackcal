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
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const secondaryNav = [
    { id: 'supplements', label: 'Supplements', icon: Pill },
    { id: 'summary', label: 'Weekly Report', icon: BarChart2 },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white p-5 shrink-0 fixed inset-y-0 left-0 z-30 shadow-sm">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">BulkTrack</h1>
            <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">70kg Goal</span>
          </div>
        </div>

        {/* Primary Links */}
        <nav className="flex-1 space-y-1.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Main Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 font-semibold shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mt-6 mb-2">Analytics & Extra</div>
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 font-semibold shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info card */}
        <div className="mt-auto p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Bulking Target</div>
          <div className="text-sm font-bold text-slate-800 mt-0.5">2,725 kcal • 105g P</div>
          <div className="text-[11px] text-indigo-500 mt-1 font-mono">4 Days/Wk Training</div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 backdrop-blur-xl px-2 py-2 shadow-lg">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
