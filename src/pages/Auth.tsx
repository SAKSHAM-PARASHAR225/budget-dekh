import { motion } from 'framer-motion';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { GlassInput } from '../components/ui/GlassInput';
import { useNavigate } from 'react-router-dom';

export function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        navigate('/optimize');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/optimize');
      }
    } catch (e: unknown) {
      setError((e as Error).message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + import.meta.env.BASE_URL + 'optimize' },
    });
  };

  const handleGuest = () => {
    navigate('/optimize');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20"
    >
      <GlassCard className="w-full max-w-md" hover={false}>
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="text-gold text-3xl font-bold mb-3 inline-block"
          >
            ✕
          </motion.div>
          <h1 className="text-heading text-white mb-1">
            {mode === 'login' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
          </h1>
          <p className="text-sm text-muted">
            {mode === 'login' ? 'Sign in to save your sessions' : 'Join KnapSave to save your optimizations'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <GlassInput
            label="Email"
            type="email"
            icon="📧"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <GlassInput
            label="Password"
            type="password"
            icon="🔒"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
          />

          <GlassButton onClick={handleAuth} loading={loading} fullWidth>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </GlassButton>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-bg-card px-3 text-xs text-dim uppercase tracking-wider">or</span>
            </div>
          </div>

          <GlassButton onClick={handleGoogle} variant="ghost" fullWidth>
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </span>
          </GlassButton>

          <GlassButton onClick={handleGuest} variant="ghost" fullWidth>
            👤 Continue as Guest
          </GlassButton>
        </div>

        <p className="text-center text-xs text-dim mt-6">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => setMode('signup')} className="text-gold hover:underline cursor-pointer font-semibold">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-gold hover:underline cursor-pointer font-semibold">
                Sign in
              </button>
            </>
          )}
        </p>
      </GlassCard>
    </motion.div>
  );
}
