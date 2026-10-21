import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          const configs = {
            success: {
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
              bar: 'bg-emerald-400',
              style: { background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)' },
            },
            error: {
              icon: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />,
              bar: 'bg-red-400',
              style: { background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)' },
            },
            warning: {
              icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
              bar: 'bg-amber-400',
              style: { background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)' },
            },
            info: {
              icon: <Info className="w-4 h-4 text-purple-400 shrink-0" />,
              bar: 'bg-purple-400',
              style: { background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.25)' },
            },
          };
          const cfg = configs[toast.type] || configs.success;

          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl backdrop-blur-xl animate-fade-up overflow-hidden relative"
              style={{ ...cfg.style, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)' }}
              role="alert"
            >
              {/* Glow bar on left */}
              <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${cfg.bar} rounded-r-full`} />
              <div className="mt-0.5 ml-1">{cfg.icon}</div>
              <p className="flex-1 text-sm font-medium text-white/90 leading-snug">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-white/30 hover:text-white/60 transition-colors p-1 rounded-lg"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
