import { motion } from 'framer-motion';
import type { ReactNode, HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}

export function GlassCard({ children, className = '', glow = false, hover = true, onClick, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={`
        relative rounded-2xl p-6
        bg-bg-card
        border border-white/[0.06]
        shadow-card
        ${glow ? 'border-gold/30 shadow-gold-glow' : ''}
        ${hover ? 'card-lift' : ''}
        ${className}
      `}
      onClick={onClick}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </motion.div>
  );
}
