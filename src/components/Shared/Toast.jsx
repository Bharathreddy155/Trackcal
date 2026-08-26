// src/components/Shared/Toast.jsx
import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useBulkTrack } from '../../context/BulkTrackContext';

export default function Toast() {
  const { toastMessage } = useBulkTrack();

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  const typeStyles = {
    success: 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-200',
    warning: 'bg-amber-50 dark:bg-amber-950/90 border-amber-300 dark:border-amber-500/50 text-amber-800 dark:text-amber-200',
    info: 'bg-indigo-50 dark:bg-slate-900/95 border-indigo-300 dark:border-indigo-500/50 text-indigo-800 dark:text-indigo-200',
  }[type] || 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200';

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />
  }[type] || <Info className="w-5 h-5 text-slate-400 shrink-0" />;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full px-4 animate-fade-in pointer-events-none">
      <div className={`flex items-center gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md ${typeStyles}`}>
        {icons}
        <span className="text-sm font-medium leading-snug flex-1">{message}</span>
      </div>
    </div>
  );
}
