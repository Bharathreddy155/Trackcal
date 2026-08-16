// src/components/Shared/Toast.jsx
import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useBulkTrack } from '../../context/BulkTrackContext';

export default function Toast() {
  const { toastMessage } = useBulkTrack();

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  const typeStyles = {
    success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200',
    warning: 'bg-amber-950/90 border-amber-500/50 text-amber-200',
    info: 'bg-slate-900/90 border-cyan-500/50 text-cyan-200',
  }[type] || 'bg-slate-900/90 border-slate-700 text-slate-200';

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
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
