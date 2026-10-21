import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(
  ({ label, error, helperText, id, className = '', options = [], children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (
      <div className="w-full space-y-2 text-left">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-widest text-white/40">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full glass text-[#F1F0FA] text-sm rounded-2xl px-4 py-3 pr-10 appearance-none transition-all duration-200 outline-none cursor-pointer focus-ring
              ${error
                ? 'border-red-500/50'
                : 'border-white/[0.08] focus:border-purple-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] hover:border-white/[0.14]'
              }
              ${className}`}
            {...props}
          >
            {options.length > 0
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ background: '#1A1040', color: '#F1F0FA' }}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
            <ChevronDown className="w-4 h-4" />
          </div>
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
Select.displayName = 'Select';
export default Select;
