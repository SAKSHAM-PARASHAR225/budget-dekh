import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { GlassCard } from './ui/GlassCard';

const steps = [
  { icon: '🔍', text: 'Searching real products & prices...', delay: 0 },
  { icon: '⭐', text: 'Checking ratings & reviews...', delay: 1500 },
  { icon: '🏷️', text: 'Comparing brands & alternatives...', delay: 3000 },
  { icon: '🧮', text: 'Running Knapsack algorithm...', delay: 5000 },
  { icon: '📊', text: 'Ranking by value (price × quality)...', delay: 7000 },
];

const tips = [
  "💡 Did you know? The Knapsack algorithm finds the mathematically optimal combination — not just the cheapest items.",
  "💡 0/1 Knapsack means each item is either fully included or excluded — no fractions!",
  "💡 This algorithm is used in resource allocation, finance, and cryptography.",
  "💡 The time complexity is O(n × W), where n is items and W is budget.",
  "💡 Budget Dekh searches real-time prices to ensure you get the best deals.",
];

export function LoadingOptimize() {
  const [activeStep, setActiveStep] = useState(0);
  const [tip] = useState(() => tips[Math.floor(Math.random() * tips.length)]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervals: ReturnType<typeof setTimeout>[] = [];
    steps.forEach((step, i) => {
      intervals.push(
        setTimeout(() => setActiveStep(i), step.delay)
      );
    });

    const progInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) return 95;
        return p + Math.random() * 8;
      });
    }, 500);

    return () => {
      intervals.forEach(clearTimeout);
      clearInterval(progInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 backdrop-blur-xl"
    >
      {/* Decorative rings */}
      <div className="deco-ring deco-ring-3" />

      <GlassCard className="w-full max-w-lg mx-4" hover={false}>
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-5xl mb-4 inline-block"
          >
            ⚡
          </motion.div>
          <h2 className="text-heading text-white mb-1">FINDING YOUR BEST DEALS</h2>
          <p className="text-sm text-muted">AI is searching for the latest prices...</p>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          <AnimatePresence>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: i <= activeStep ? 1 : 0.3,
                  x: 0,
                }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <span className="text-lg w-8">{step.icon}</span>
                <span className={`flex-1 text-sm font-medium ${i <= activeStep ? 'text-white' : 'text-dim'}`}>
                  {step.text}
                </span>
                <span className="text-sm">
                  {i < activeStep ? (
                    <span className="text-emerald-400 font-semibold">✓ Done</span>
                  ) : i === activeStep ? (
                    <motion.span
                      animate={{ opacity: [1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="text-gold font-semibold"
                    >
                      ⟳ Running
                    </motion.span>
                  ) : (
                    <span className="text-dim">⏳ Waiting</span>
                  )}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden mb-6">
          <motion.div
            className="h-full progress-bar rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Tip */}
        <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <p className="text-xs text-muted leading-relaxed">{tip}</p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
