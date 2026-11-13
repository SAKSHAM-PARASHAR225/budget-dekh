import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  error?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, icon, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm text-muted font-semibold uppercase tracking-wider pl-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-bg-card
              border border-white/[0.08]
              text-white placeholder:text-dim
              outline-none
              transition-all duration-300
              focus:border-gold/50 focus:bg-bg-card-hover
              focus:shadow-[0_0_20px_rgba(255,214,0,0.1)]
              ${icon ? 'pl-12' : ''}
              ${error ? 'border-red-500/50' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-400 pl-1">{error}</p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
