// src/components/Shared/Modal.jsx
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer = null,
  maxWidth = 'max-w-lg'
}) {
  const contentRef = useRef(null);

  // Reset scroll to top (0) whenever the modal opens or when title changes
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [isOpen, title]);

  // Handle escape key without locking background scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);

      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      });

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pointer-events-auto">
      {/* Backdrop (semi-transparent with click-to-close and background visibility) */}
      <div 
        className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-[2px] transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative w-full ${maxWidth} max-h-[92vh] sm:max-h-[88vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prominent Fixed Header with Guaranteed Visible Close Button */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/95 z-10">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate mr-2">
            {title}
          </h3>
          
          {/* Prominent, touch-friendly close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer shrink-0 border border-slate-200/80 dark:border-slate-700/80 shadow-xs"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content Area */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 text-slate-700 dark:text-slate-200 space-y-4 sm:space-y-5"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {children}
        </div>

        {/* Fixed Footer (if provided) */}
        {footer && (
          <div className="shrink-0 px-4 py-3 sm:px-6 sm:py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/95 z-10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
