import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          {/* Bold left side */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-display mb-4"
            >
              <span className="text-white">SPEND</span>{' '}
              <span className="text-gold">LESS.</span>
              <br />
              <span className="text-white">GET</span>{' '}
              <span className="text-gold">MORE.</span>
            </motion.h3>
            <div className="section-divider mb-4" />
            <p className="text-muted text-sm">
              Powered by <span className="text-gold font-semibold">0/1 Knapsack Algorithm</span> • Built with <span className="text-blue-400 font-semibold">Gemini AI</span>
            </p>
          </div>

          {/* Right side */}
          <div className="text-right">
            <p className="text-dim text-xs uppercase tracking-wider">
              Budget Dekh © {new Date().getFullYear()}
            </p>
            <p className="text-dim text-xs mt-1">
              Algorithmically optimal.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
