import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';

const quickBudgets = [500, 1000, 2000, 5000, 10000, 25000];

interface StepBudgetProps {
  budget: number;
  currency: string;
  setBudget: (budget: number) => void;
  setCurrency: (currency: string) => void;
}

export function StepBudget({ budget, setBudget, currency, setCurrency }: StepBudgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-heading text-white mb-2">WHAT'S YOUR BUDGET?</h2>
        <p className="text-muted text-sm">We'll find the best combination within your budget</p>
      </div>

      {/* Currency selector */}
      <div className="flex justify-center gap-2">
        {['INR', 'USD', 'EUR'].map((c) => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={`px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer border
              ${currency === c
                ? 'bg-gold/15 text-gold border-gold/30'
                : 'bg-white/[0.03] text-muted border-white/[0.08] hover:bg-white/[0.06]'
              }`}
          >
            {c === 'INR' ? '₹ INR' : c === 'USD' ? '$ USD' : '€ EUR'}
          </button>
        ))}
      </div>

      {/* Budget input */}
      <GlassCard className="text-center" hover={false}>
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-4xl font-bold text-gold">
            {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'}
          </span>
          <input
            type="number"
            value={budget || ''}
            onChange={(e) => setBudget(Number(e.target.value))}
            placeholder="0"
            className="text-5xl font-bold bg-transparent text-white text-center outline-none w-48 
              placeholder:text-dim [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* Budget meter */}
        <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden mb-2">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-gold to-red-500"
            animate={{ width: `${Math.min((budget / 50000) * 100, 100)}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
        <div className="flex justify-between text-xs text-dim">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </GlassCard>

      {/* Quick budget chips */}
      <div>
        <p className="text-sm text-dim text-center mb-3 uppercase tracking-wider">Quick select</p>
        <div className="flex flex-wrap justify-center gap-2">
          {quickBudgets.map((b) => (
            <motion.button
              key={b}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setBudget(b)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer border
                ${budget === b
                  ? 'bg-gold text-black shadow-gold-glow border-gold'
                  : 'bg-white/[0.03] text-muted border-white/[0.08] hover:bg-white/[0.06] hover:border-gold/20'
                }`}
            >
              {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'}
              {b.toLocaleString('en-IN')}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
