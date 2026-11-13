import type { ReactNode } from 'react';

interface GlassBadgeProps {
  children: ReactNode;
  variant?: 'default' | 'gold' | 'green' | 'red' | 'blue' | 'purple';
  className?: string;
}

const badgeVariants = {
  default: 'bg-white/[0.06] text-white/80 border-white/[0.08]',
  gold: 'bg-gold/10 text-gold border-gold/20',
  green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export function GlassBadge({ children, variant = 'default', className = '' }: GlassBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-3 py-1
        text-xs font-bold uppercase tracking-wider rounded-full
        border
        ${badgeVariants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
