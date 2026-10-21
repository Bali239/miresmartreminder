import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  type = 'button',
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 select-none cursor-pointer focus-ring active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100';

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 rounded-full gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-full gap-2',
    lg: 'text-sm px-6 py-3 rounded-full gap-2',
  };

  const variants = {
    primary:
      'gradient-btn text-white',
    secondary:
      'bg-white/[0.07] border border-white/10 text-[#F1F0FA] hover:bg-white/[0.11] hover:border-purple-400/40',
    ghost:
      'bg-transparent text-white/60 hover:text-white hover:bg-white/[0.06]',
    outline:
      'bg-transparent border border-white/15 text-[#F1F0FA] hover:border-purple-400/50 hover:bg-purple-500/10',
    danger:
      'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:border-red-500/50',
    dangerGhost:
      'bg-transparent text-red-400 hover:bg-red-500/15',
    success:
      'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
};

export default Button;
