import React, { forwardRef } from 'react';

export const Input = forwardRef(
  ({ label, error, helperText, id, className = '', type = 'text', rightElement, leftElement, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (
      <div className="w-full space-y-2 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-widest text-white/40">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-4 flex items-center pointer-events-none text-white/30">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`w-full glass text-[#F1F0FA] placeholder:text-white/25 text-sm rounded-2xl px-4 py-3 transition-all duration-200 outline-none focus-ring
              ${leftElement ? 'pl-11' : ''}
              ${rightElement ? 'pr-12' : ''}
              ${error
                ? 'border-red-500/50 focus:border-red-400/70 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]'
                : 'border-white/[0.08] focus:border-purple-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] hover:border-white/[0.14]'
              }
              ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-4 flex items-center">{rightElement}</div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-white/35">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';
export default Input;
