import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase, formatINR, type Session, type Result } from '../lib/supabase';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { GlassBadge } from '../components/ui/GlassBadge';
import { SummaryStats } from '../components/results/SummaryStats';
import { BestPicks } from '../components/results/BestPicks';
import { LeftOut } from '../components/results/LeftOut';
import { useNavigate } from 'react-router-dom';

type SessionWithResult = Session & { result?: Result };

export function History() {
  const [sessions, setSessions] = useState<SessionWithResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SessionWithResult | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    const { data: sessionsData } = await supabase
      .from('knapsave_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (sessionsData) {
      // Fetch results for each session
      const sessionsWithResults = await Promise.all(
        sessionsData.map(async (session) => {
          const { data: result } = await supabase
            .from('knapsave_results')
            .select('*')
            .eq('session_id', session.id)
            .single();
          return { ...session, result: result || undefined };
        })
      );
      setSessions(sessionsWithResults);
    }
    setLoading(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Selected session detail
  if (selected && selected.result) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 min-h-screen px-6 pt-28 pb-32 max-w-5xl mx-auto"
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading text-white">SESSION DETAILS</h1>
              <p className="text-sm text-dim uppercase tracking-wider mt-1">{formatDate(selected.created_at)}</p>
            </div>
            <div className="flex gap-2">
              <GlassButton onClick={() => setSelected(null)} variant="ghost" size="sm">
                ← Back
              </GlassButton>
              <GlassButton onClick={() => navigate('/optimize')} size="sm">
                🔄 Re-optimize
              </GlassButton>
            </div>
          </div>

          <SummaryStats
            budget={selected.budget}
            totalCost={selected.result.total_cost}
            moneySaved={selected.result.money_saved}
            selectedCount={selected.result.selected_items?.length || 0}
            totalCount={(selected.result.selected_items?.length || 0) + (selected.result.left_out_items?.length || 0)}
            currency={selected.currency}
          />

          <BestPicks items={selected.result.selected_items || []} currency={selected.currency} />
          <LeftOut items={selected.result.left_out_items || []} currency={selected.currency} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 min-h-screen px-6 pt-28 pb-32 max-w-4xl mx-auto"
    >
      <div className="mb-10">
        <p className="text-sm text-gold uppercase tracking-widest font-bold mb-3">Past Sessions</p>
        <h1 className="text-heading text-white">HISTORY</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="spinner w-8 h-8 border-2 border-gold/30 border-t-gold" />
        </div>
      ) : sessions.length === 0 ? (
        <GlassCard className="text-center" hover={false}>
          <span className="text-4xl block mb-3">📭</span>
          <h3 className="text-lg font-bold mb-1 text-white">No sessions yet</h3>
          <p className="text-sm text-muted mb-6">Start your first optimization!</p>
          <GlassButton onClick={() => navigate('/optimize')}>
            🚀 Start Optimizing
          </GlassButton>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {sessions.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard
                className="cursor-pointer"
                onClick={() => setSelected(session)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-xl shrink-0">
                    💰
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-white">
                        Budget: {formatINR(session.budget)}
                      </p>
                      {session.result && (
                        <GlassBadge variant="green">
                          Saved {formatINR(session.result.money_saved)}
                        </GlassBadge>
                      )}
                    </div>
                    <p className="text-xs text-dim">
                      {formatDate(session.created_at)} •{' '}
                      {session.categories?.join(', ') || 'No categories'} •{' '}
                      {session.result
                        ? `${session.result.selected_items?.length || 0} items selected`
                        : 'No results'}
                    </p>
                  </div>
                  <span className="text-gold/30 text-xl">→</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
