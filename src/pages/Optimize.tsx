import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import { StepBudget } from '../components/onboarding/StepBudget';
import { StepCategories } from '../components/onboarding/StepCategories';
import { StepPreferences } from '../components/onboarding/StepPreferences';
import { StepItems, type UserItem } from '../components/onboarding/StepItems';
import { LoadingOptimize } from '../components/LoadingOptimize';
import { SummaryStats } from '../components/results/SummaryStats';
import { BestPicks } from '../components/results/BestPicks';
import { LeftOut } from '../components/results/LeftOut';
import { PriceComparison } from '../components/results/PriceComparison';
import { GlassButton } from '../components/ui/GlassButton';
import { GlassCard } from '../components/ui/GlassCard';
import { callOptimize, supabase, type OptimizeResponse } from '../lib/supabase';

const TOTAL_STEPS = 4;

export function Optimize() {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(2000);
  const [currency, setCurrency] = useState('INR');
  const [categories, setCategories] = useState<string[]>([]);
  const [preferences, setPreferences] = useState({
    gender: 'unisex',
    shopping: 'balanced',
    delivery: 'standard',
    platform: 'any',
    notes: '',
    priceQuality: 5,
    brands: [] as string[],
    clothingSize: '',
    shoeSize: '',
  });
  const [items, setItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<OptimizeResponse | null>(null);
  const [error, setError] = useState('');

  const canProceed = () => {
    switch (step) {
      case 1: return budget >= 50;
      case 2: return categories.length > 0;
      case 3: return true;
      case 4: return items.length > 0;
      default: return false;
    }
  };

  const handleOptimize = async () => {
    if (items.length === 0) {
      setError('Add at least one item to optimize');
      return;
    }
    if (budget < 50) {
      setError('Minimum budget ₹50 required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await callOptimize({
        budget,
        items: items.map((i) => ({ name: i.name, priority: i.priority })),
        currency,
        preferences,
        brands: preferences.brands.length > 0 ? preferences.brands : undefined,
      });

      setResults(response);

      // Save session to Supabase if logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: session } = await supabase
          .from('knapsave_sessions')
          .insert({
            user_id: user.id,
            budget,
            currency,
            preferences,
            categories,
          })
          .select()
          .single();

        if (session) {
          await supabase.from('knapsave_results').insert({
            session_id: session.id,
            selected_items: response.selected,
            left_out_items: response.leftOut,
            total_cost: response.totalCost,
            total_priority: response.totalPriority,
            money_saved: response.moneySaved,
          });
        }
      }

      // Confetti!
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD600', '#FFE433', '#ffd166', '#3ecf8e'],
        });
      }, 500);
    } catch (e: unknown) {
      console.error(e);
      setError('Oops! Search service unavailable. Make sure the edge function is deployed and try again.');
    } finally {
      setLoading(false);
    }
  };

  const startOver = () => {
    setStep(1);
    setResults(null);
    setItems([]);
    setCategories([]);
    setError('');
  };

  // If we have results, show them
  if (results) {
    const allItemsAffordable =
      results.selected.length === results.pricedItems.length && results.leftOut.length === 0;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 min-h-screen px-6 pt-28 pb-32 max-w-5xl mx-auto"
      >
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading text-white">YOUR RESULTS</h1>
              <p className="text-sm text-dim uppercase tracking-wider mt-1">
                Optimized with 0/1 Knapsack Algorithm
              </p>
            </div>
            <GlassButton onClick={startOver} variant="ghost" size="sm">
              ← Start Over
            </GlassButton>
          </div>

          {/* All items fit message */}
          {allItemsAffordable && (
            <GlassCard glow hover={false} className="text-center">
              <span className="text-4xl block mb-2">🎉</span>
              <h3 className="text-xl font-bold text-emerald-400 mb-1">Great news!</h3>
              <p className="text-sm text-muted">You can afford everything on your list!</p>
            </GlassCard>
          )}

          {/* Summary */}
          <SummaryStats
            budget={budget}
            totalCost={results.totalCost}
            moneySaved={results.moneySaved}
            selectedCount={results.selected.length}
            totalCount={results.pricedItems.length}
            currency={currency}
          />

          {/* Best Picks */}
          <BestPicks items={results.selected} currency={currency} />

          {/* Left Out */}
          <LeftOut items={results.leftOut} currency={currency} />

          {/* Price Comparison */}
          <PriceComparison items={results.pricedItems} currency={currency} />

          {/* Algorithm info */}
          <GlassCard hover={false} className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <span>🧮</span> Algorithm Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-dim text-xs uppercase tracking-wider mb-1">Algorithm Used</p>
                <p className="text-white/80 font-semibold">0/1 Knapsack (DP)</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-dim text-xs uppercase tracking-wider mb-1">Total Priority</p>
                <p className="text-gold font-bold text-lg">{results.totalPriority}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-dim text-xs uppercase tracking-wider mb-1">Remaining Budget</p>
                <p className="text-emerald-400 font-bold text-lg">
                  {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'}
                  {results.remainingBudget.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <p className="text-xs text-dim leading-relaxed">
              The 0/1 Knapsack algorithm evaluates all possible combinations to find the selection
              that maximizes your total priority score while staying within budget. Each item is
              either fully included or excluded — ensuring the mathematically optimal solution.
            </p>
          </GlassCard>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 min-h-screen px-6 pt-28 pb-32 max-w-3xl mx-auto"
    >
      {/* Loading overlay */}
      <AnimatePresence>
        {loading && <LoadingOptimize />}
      </AnimatePresence>

      {/* Progress steps — Buttermax-style gold dots */}
      <div className="flex items-center justify-center gap-3 mb-12">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                ${i + 1 === step
                  ? 'bg-gold text-black shadow-gold-glow'
                  : i + 1 < step
                    ? 'bg-gold/20 text-gold border border-gold/30'
                    : 'bg-white/[0.04] text-dim border border-white/[0.08]'
                }`}
            >
              {i + 1 < step ? '✓' : i + 1}
            </div>
            {i < TOTAL_STEPS - 1 && (
              <div className={`w-10 h-[2px] rounded-full transition-all duration-300 ${i + 1 < step ? 'bg-gold/30' : 'bg-white/[0.06]'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <StepBudget
            key="step1"
            budget={budget}
            setBudget={setBudget}
            currency={currency}
            setCurrency={setCurrency}
          />
        )}
        {step === 2 && (
          <StepCategories key="step2" selected={categories} setSelected={setCategories} />
        )}
        {step === 3 && (
          <StepPreferences key="step3" preferences={preferences} setPreferences={setPreferences} categories={categories} />
        )}
        {step === 4 && (
          <StepItems key="step4" items={items} setItems={setItems} categories={categories} />
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between items-center mt-10 gap-4">
        {step > 1 ? (
          <GlassButton onClick={() => setStep(step - 1)} variant="ghost">
            ← Back
          </GlassButton>
        ) : (
          <div />
        )}

        {step < TOTAL_STEPS ? (
          <GlassButton onClick={() => setStep(step + 1)} disabled={!canProceed()}>
            Next →
          </GlassButton>
        ) : (
          <GlassButton onClick={handleOptimize} disabled={!canProceed()} loading={loading}>
            🔍 Find Best Deals
          </GlassButton>
        )}
      </div>

      {/* Mobile sticky button */}
      <div className="md:hidden fixed bottom-20 left-4 right-4 z-40">
        {step === TOTAL_STEPS && items.length > 0 && !loading && (
          <GlassButton onClick={handleOptimize} fullWidth loading={loading} size="lg">
            🔍 Find Best Deals
          </GlassButton>
        )}
      </div>
    </motion.div>
  );
}
