import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { GlassBadge } from '../ui/GlassBadge';
import type { PricedItem } from '../../lib/supabase';
import { formatINR } from '../../lib/supabase';

interface LeftOutProps {
  items: PricedItem[];
  currency: string;
}

export function LeftOut({ items, currency }: LeftOutProps) {
  const fmt = (n: number) => {
    if (currency === 'INR') return formatINR(n);
    return `${currency === 'USD' ? '$' : '€'}${n.toLocaleString()}`;
  };

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2 uppercase tracking-wider">
        <span>❌</span> Left Out
        <GlassBadge variant="red">{items.length} items</GlassBadge>
      </h3>

      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="!p-4 border-red-500/10 hover:border-red-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl shrink-0">
                  📦
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white/80 truncate">{item.name}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-dim">{item.platform} • {fmt(item.best_price)}</span>
                    {item.rating && item.rating > 0 && (
                      <span className="text-xs text-gold/70">★ {item.rating.toFixed(1)}</span>
                    )}
                    {item.brand && <span className="text-xs text-dim">• {item.brand}</span>}
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gold/50 hover:text-gold transition-colors">🔍 Search →</a>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {item.extra !== undefined && item.extra > 0 ? (
                    <GlassBadge variant="gold">
                      + {fmt(item.extra)} more needed
                    </GlassBadge>
                  ) : (
                    <GlassBadge variant="red">Over budget</GlassBadge>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
