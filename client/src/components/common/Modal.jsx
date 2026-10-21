import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div
        className={`relative w-full ${maxWidth} z-10 animate-fade-up max-h-[90vh] flex flex-col rounded-3xl overflow-hidden`}
        style={{
          background: 'rgba(17, 14, 46, 0.85)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(139, 92, 246, 0.1)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 sm:p-7 pb-0 shrink-0">
          <div>
            {title && (
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-white/40 mt-1">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/30 hover:text-white rounded-xl hover:bg-white/[0.07] transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Divider */}
        <div className="mx-6 sm:mx-7 my-4 h-px bg-white/[0.06]" />
        {/* Content */}
        <div className="px-6 sm:px-7 pb-6 sm:pb-7 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
