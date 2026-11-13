import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { formatINR } from '../../lib/supabase';

interface SummaryStatsProps {
  budget: number;
  totalCost: number;
  moneySaved: number;
  selectedCount: number;
  totalCount: number;
  currency: string;
}

export function SummaryStats({ budget, totalCost, moneySaved, selectedCount, totalCount, currency }: SummaryStatsProps) {
  const utilization = Math.round((totalCost / budget) * 100);
  const isOverBudget = totalCost > budget;
  const fmt = (n: number) => {
    if (currency === 'INR') return formatINR(n);
    return `${currency === 'USD' ? '$' : '€'}${n.toLocaleString()}`;
  };

  return (
    <GlassCard className="!p-5" glow hover={false}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatBox label="Budget" value={fmt(budget)} color="text-white" />
        <StatBox label="Spent" value={fmt(totalCost)} color={isOverBudget ? 'text-red-400' : 'text-blue-400'} />
        <div className="text-center">
          <p className="text-xs text-dim uppercase tracking-wider mb-1">Saved</p>
          <p className="text-lg font-bold text-emerald-400">
            <CountUp end={Math.max(0, moneySaved)} currency={currency} />
          </p>
        </div>
        <StatBox label="Items" value={`${selectedCount}/${totalCount}`} color="text-gold" />
      </div>

      {/* Utilization bar */}
      <div className="space-y-1">
        <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 to-gold'}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(utilization, 100)}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-xs font-semibold ${isOverBudget ? 'text-red-400' : 'text-dim'}`}>
            {isOverBudget ? '⚠️ Over budget' : ''}
          </span>
          <p className="text-xs text-dim text-right">{Math.min(utilization, 100)}% budget utilized</p>
        </div>
      </div>
    </GlassCard>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-dim uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}

function CountUp({ end, currency }: { end: number; currency: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [end]);

  const prefix = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€';
  return <>{prefix}{count.toLocaleString('en-IN')}</>;
}
