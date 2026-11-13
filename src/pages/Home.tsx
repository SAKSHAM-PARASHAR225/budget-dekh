import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';

const features = [
  {
    icon: '🔍',
    title: 'AI Price Search',
    desc: 'Gemini AI searches real-time prices across Amazon, Flipkart & Meesho',
  },
  {
    icon: '🧮',
    title: '0/1 Knapsack',
    desc: 'Mathematically optimal item selection that maximizes value within budget',
  },
  {
    icon: '💰',
    title: 'Smart Savings',
    desc: 'See exactly how much you save and what you need to add for left-out items',
  },
];

const containerVariants = {
  animate: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 min-h-screen flex flex-col"
    >
      {/* ===== HERO — Buttermax-style massive typography ===== */}
      <section className="relative flex-1 flex items-center justify-center px-6 pt-28 pb-20 min-h-[90vh] overflow-hidden">
        {/* Decorative grid dots */}
        <div className="deco-grid opacity-40" />
        
        {/* Decorative gold ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-gold/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-gold/5 pointer-events-none" />
        
        {/* Gold glow spot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gold/[0.04] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1 className="text-massive mb-6">
              <span className="text-white">THE</span>
              <br />
              <span className="gold-text">GOLD</span>
              <br />
              <span className="gold-text">STANDARD</span>
              <br />
              <span className="text-white">IN SMART</span>
              <br />
              <span className="text-white">BUDGETING</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-muted text-lg md:text-xl mb-4 max-w-lg mx-auto font-light"
          >
            Spend less. Get more. <span className="text-white font-medium">Algorithmically.</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-muted text-sm mb-10 max-w-md mx-auto"
          >
            AI-powered budget optimizer that searches real-time prices and uses the
            0/1 Knapsack algorithm to find the mathematically best combination.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link to="/optimize">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pill-btn-filled text-base px-10 py-4"
              >
                🚀 Start Optimizing
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== WHO WE ARE — Buttermax-style bold statement ===== */}
      <section className="relative px-6 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm text-gold uppercase tracking-widest font-bold mb-6">
              What We Do
            </p>
            <h2 className="text-display text-white max-w-4xl">
              BUDGET DEKH IS AN <span className="text-gold">AI-POWERED</span> BUDGET OPTIMIZER.{' '}
              WE FIND THE <span className="text-gold">MATHEMATICALLY BEST</span> COMBINATION OF ITEMS WITHIN YOUR BUDGET.
            </h2>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES — Bold cards ===== */}
      <section className="px-6 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-gold uppercase tracking-widest font-bold mb-12"
          >
            Features
          </motion.p>

          <motion.div
            variants={containerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <motion.div key={i} variants={cardVariants}>
                <GlassCard className="text-left h-full group">
                  <span className="text-4xl mb-6 block">{f.icon}</span>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors duration-300">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS — Bold steps ===== */}
      <section className="px-6 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-gold uppercase tracking-widest font-bold mb-6"
          >
            How It Works
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-heading text-white mb-16"
          >
            FOUR STEPS TO <span className="text-gold">OPTIMAL</span> SPENDING
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', text: 'Set your budget & preferences' },
              { step: '02', text: 'Add items you want to buy' },
              { step: '03', text: 'AI searches real prices' },
              { step: '04', text: 'Get optimal combination' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group"
              >
                <div className="text-5xl font-bold text-gold/20 group-hover:text-gold/50 transition-colors duration-300 mb-4">
                  {s.step}
                </div>
                <div className="section-divider mb-4 group-hover:w-20 transition-all duration-300" />
                <p className="text-muted text-sm group-hover:text-white transition-colors duration-300">
                  {s.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="px-6 py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-display mb-6"
          >
            <span className="text-white">READY TO</span>{' '}
            <span className="text-gold">OPTIMIZE?</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/optimize">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pill-btn text-base px-10 py-4"
              >
                Get Started →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
