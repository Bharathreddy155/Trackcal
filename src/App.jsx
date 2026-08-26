// src/App.jsx
import React, { useState } from 'react';
import { BulkTrackProvider } from './context/BulkTrackContext';
import Navigation from './components/Layout/Navigation';
import Header from './components/Layout/Header';
import Toast from './components/Shared/Toast';

import DashboardPage from './pages/DashboardPage';
import MealsPage from './pages/MealsPage';
import SupplementsPage from './pages/SupplementsPage';
import WorkoutPage from './pages/WorkoutPage';
import ProgressPage from './pages/ProgressPage';
import WeeklySummaryPage from './pages/WeeklySummaryPage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      
      {/* Toast Notification Container */}
      <Toast />

      {/* Navigation (Sidebar Desktop + Bottom Mobile) */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        
        {/* Top Header */}
        <Header />

        {/* Page Content View */}
        <main className="flex-1 px-4 py-6 md:px-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'meals' && <MealsPage />}
          {activeTab === 'supplements' && <SupplementsPage />}
          {activeTab === 'workout' && <WorkoutPage />}
          {activeTab === 'progress' && <ProgressPage />}
          {activeTab === 'summary' && <WeeklySummaryPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <BulkTrackProvider>
      <AppContent />
    </BulkTrackProvider>
  );
}
