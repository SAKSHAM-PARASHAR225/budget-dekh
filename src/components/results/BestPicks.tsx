import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { GlassBadge } from '../ui/GlassBadge';
import type { PricedItem } from '../../lib/supabase';
import { formatINR } from '../../lib/supabase';

interface BestPicksProps {
  items: PricedItem[];
  currency: string;
}

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  return (
    <span className="inline-flex items-center gap-0.5 text-gold text-xs">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? 'opacity-100' : i === full && hasHalf ? 'opacity-60' : 'opacity-20'}>★</span>
      ))}
      <span className="text-white/60 font-semibold ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}

export function BestPicks({ items, currency }: BestPicksProps) {
  const fmt = (n: number) => {
    if (currency === 'INR') return formatINR(n);
    return `${currency === 'USD' ? '$' : '€'}${n.toLocaleString()}`;
  };

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2 uppercase tracking-wider">
        <span>✅</span> Best Picks
        <GlassBadge variant="green">{items.length} items</GlassBadge>
      </h3>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {items.map((item, i) => (
          <motion.div key={i} variants={cardVariants}>
            <GlassCard className="!p-4 border-emerald-500/10 hover:border-emerald-500/30 h-full">
              {/* Product image */}
              <div className="w-full h-32 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-3 flex items-center justify-center text-4xl overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  '📦'
                )}
              </div>

              {/* Brand badge */}
              {item.brand && (
                <div className="mb-2">
                  <GlassBadge variant="gold">{item.brand}</GlassBadge>
                </div>
              )}

              {/* Name */}
              <h4 className="text-sm font-bold text-white mb-2 line-clamp-2">{item.name}</h4>

              {/* Rating & Reviews */}
              {item.rating && item.rating > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={item.rating} />
                  {item.reviews && item.reviews > 0 && (
                    <span className="text-xs text-dim">({item.reviews.toLocaleString('en-IN')} reviews)</span>
                  )}
                </div>
              )}

              {/* Price + Platform */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-emerald-400">{fmt(item.best_price)}</span>
                <GlassBadge variant="blue">{item.platform}</GlassBadge>
              </div>

              {/* Priority */}
              <div className="flex items-center gap-1 mb-3">
                <span className="text-xs text-dim mr-1 uppercase tracking-wider">Priority:</span>
                {Array.from({ length: 10 }).map((_, j) => (
                  <span
                    key={j}
                    className={`w-2 h-2 rounded-full ${j < item.priority ? 'bg-gold' : 'bg-white/[0.06]'}`}
                  />
                ))}
              </div>

              {/* Alternatives */}
              {item.alternatives && item.alternatives.length > 0 && (
                <div className="pt-3 border-t border-white/[0.06]">
                  <p className="text-xs text-dim mb-1.5 uppercase tracking-wider">Also available on:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.alternatives.map((alt, k) => (
                      <a
                        key={k}
                        href={alt.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-muted hover:text-gold hover:border-gold/20 transition-all"
                      >
                        {alt.platform} {fmt(alt.price)}
                        {alt.rating ? ` ★${alt.rating.toFixed(1)}` : ''}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct link to platform search page */}
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-center text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full transition-all duration-300 bg-gold/10 text-gold border border-gold/20 hover:bg-gold hover:text-black shadow-lg shadow-gold/5"
                >
                  🛒 View on {item.platform} →
                </a>
              ) : (
                <div className="mt-3 py-2.5 text-center text-[10px] text-dim uppercase tracking-tighter border border-dashed border-white/10 rounded-full">
                  Link unavailable
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
