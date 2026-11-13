import { GlassCard } from '../ui/GlassCard';
import type { PricedItem } from '../../lib/supabase';
import { formatINR } from '../../lib/supabase';

interface PriceComparisonProps {
  items: PricedItem[];
  currency: string;
}

export function PriceComparison({ items, currency }: PriceComparisonProps) {
  const fmt = (n: number) => {
    if (currency === 'INR') return formatINR(n);
    return `${currency === 'USD' ? '$' : '€'}${n.toLocaleString()}`;
  };

  const itemsWithAlts = items.filter((i) => i.alternatives && i.alternatives.length > 0);
  if (itemsWithAlts.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2 uppercase tracking-wider">
        <span>📊</span> Price & Rating Comparison
      </h3>

      <GlassCard hover={false} className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-3 px-3 text-dim font-bold uppercase tracking-wider text-xs">Product</th>
              <th className="text-center py-3 px-3 text-dim font-bold uppercase tracking-wider text-xs">Best Price</th>
              <th className="text-center py-3 px-3 text-dim font-bold uppercase tracking-wider text-xs">Rating</th>
              <th className="text-center py-3 px-3 text-dim font-bold uppercase tracking-wider text-xs">Alternatives</th>
              <th className="text-center py-3 px-3 text-dim font-bold uppercase tracking-wider text-xs">Savings</th>
            </tr>
          </thead>
          <tbody>
            {itemsWithAlts.map((item, i) => {
              const maxAltPrice = Math.max(...(item.alternatives?.map((a) => a.price) || [0]));
              const savings = maxAltPrice - item.best_price;
              return (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3">
                    <p className="text-white/80 font-semibold">{item.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-dim">{item.platform}</span>
                      {item.brand && <span className="text-xs text-gold/60">• {item.brand}</span>}
                    </div>
                  </td>
                  <td className="text-center py-3 px-3">
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline">
                        {fmt(item.best_price)}
                      </a>
                    ) : (
                      <span className="text-emerald-400 font-bold">{fmt(item.best_price)}</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-3">
                    {item.rating ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-gold text-sm font-bold">★ {item.rating.toFixed(1)}</span>
                        {item.reviews && <span className="text-[10px] text-dim">({item.reviews.toLocaleString('en-IN')})</span>}
                      </div>
                    ) : (
                      <span className="text-xs text-dim">—</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-3">
                    <div className="flex flex-col gap-1">
                      {item.alternatives?.map((alt, j) => (
                        <a
                          key={j}
                          href={alt.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted hover:text-gold transition-colors"
                        >
                          {alt.platform}: {fmt(alt.price)}
                          {alt.rating ? ` ★${alt.rating.toFixed(1)}` : ''}
                        </a>
                      ))}
                    </div>
                  </td>
                  <td className="text-center py-3 px-3">
                    {savings > 0 ? (
                      <span className="text-xs font-bold text-emerald-400">
                        Save {fmt(savings)}
                      </span>
                    ) : (
                      <span className="text-xs text-dim">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
