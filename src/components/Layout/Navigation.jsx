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
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-950 p-5 shrink-0 fixed inset-y-0 left-0 z-30">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">BulkTrack</h1>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">70kg Goal</span>
          </div>
        </div>

        {/* Primary Links */}
        <nav className="flex-1 space-y-1.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Main Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mt-6 mb-2">Analytics & Extra</div>
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info card */}
        <div className="mt-auto p-4 rounded-xl bg-slate-900/80 border border-slate-800/80">
          <div className="text-xs text-slate-400 font-medium">Bulking Target</div>
          <div className="text-sm font-bold text-slate-200 mt-0.5">2,725 kcal • 105g P</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">4 Days/Wk Training</div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
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
