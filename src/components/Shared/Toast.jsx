// src/components/Shared/Toast.jsx
import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useBulkTrack } from '../../context/BulkTrackContext';

export default function Toast() {
  const { toastMessage } = useBulkTrack();

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  const typeStyles = {
    success: 'bg-emerald-50 border-emerald-300 text-emerald-800',
    warning: 'bg-amber-50 border-amber-300 text-amber-800',
    info: 'bg-indigo-50 border-indigo-300 text-indigo-800',
  }[type] || 'bg-white border-slate-200 text-slate-700';

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />
  }[type] || <Info className="w-5 h-5 text-slate-400 shrink-0" />;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full px-4 animate-fade-in pointer-events-none">
      <div className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg ${typeStyles}`}>
        {icons}
        <span className="text-sm font-medium leading-snug flex-1">{message}</span>
      </div>
    </div>
  );
}
