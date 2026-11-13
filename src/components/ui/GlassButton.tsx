import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'danger' | 'success';
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const variants = {
  primary:
    'bg-gold text-black font-bold shadow-gold-glow hover:shadow-gold-glow-lg',
  ghost:
    'bg-transparent border-2 border-gold/40 text-gold hover:bg-gold hover:text-black',
  danger:
    'bg-transparent border-2 border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white',
  success:
    'bg-transparent border-2 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black',
};

const sizes = {
  sm: 'px-5 py-2 text-xs',
  md: 'px-7 py-3 text-sm',
  lg: 'px-9 py-4 text-base',
};

export function GlassButton({
  children,
  variant = 'primary',
  loading = false,
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: GlassButtonProps & { className?: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`
        font-bold cursor-pointer rounded-full uppercase tracking-wider
        transition-all duration-300
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={loading || props.disabled}
      {...(props as Record<string, unknown>)}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="spinner" />
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
