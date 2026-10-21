import React from 'react';

export const Badge = ({ children, variant = 'purple', size = 'sm', className = '' }) => {
  const variants = {
    purple: 'bg-purple-500/15 border border-purple-400/30 text-purple-300',
    indigo: 'bg-indigo-500/15 border border-indigo-400/30 text-indigo-300',
    amber: 'bg-amber-500/15 border border-amber-400/30 text-amber-300',
    overdue: 'bg-red-500/15 border border-red-400/30 text-red-300',
    completed: 'bg-emerald-500/15 border border-emerald-400/25 text-emerald-400',
    neutral: 'bg-white/[0.06] border border-white/10 text-white/50',
    primary: 'bg-gradient-to-r from-purple-600/80 to-indigo-600/80 border-0 text-white',
    pink: 'bg-pink-500/15 border border-pink-400/30 text-pink-300',
  };

  const sizes = {
    xs: 'text-[11px] px-2 py-0.5 rounded-full',
    sm: 'text-xs px-2.5 py-1 rounded-full',
    md: 'text-sm px-3 py-1.5 rounded-full',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold transition-all ${variants[variant] || variants.purple} ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
