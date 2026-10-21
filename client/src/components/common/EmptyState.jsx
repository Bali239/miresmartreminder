import React from 'react';
import { CalendarX, Sparkles } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({ icon, title = 'Nothing here yet', description = 'Your schedule is clear. Add a reminder whenever you\'re ready.', actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-8 animate-fade-up">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: 'rgba(139, 92, 246, 0.12)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.12)',
        }}
      >
        <span className="text-purple-400 w-8 h-8 flex items-center justify-center">
          {icon || <CalendarX className="w-8 h-8" />}
        </span>
      </div>
      <h3 className="text-xl font-display font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/40 max-w-sm leading-relaxed mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" icon={<Sparkles className="w-4 h-4" />}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
