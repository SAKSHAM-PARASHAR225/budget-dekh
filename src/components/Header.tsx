import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/optimize', label: 'Optimize' },
    { path: '/history', label: 'History' },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="text-gold text-2xl font-bold"
            >
              ✕
            </motion.div>
            <span className="text-lg font-bold tracking-tight text-white">
              Budget<span className="text-gold">Dekh</span>
            </span>
          </Link>

          {/* Center — Logo mark */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden lg:block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 rounded-full border-2 border-gold/30 flex items-center justify-center"
            >
              <div className="w-5 h-5 rounded-full border border-gold/60" />
            </motion.div>
          </div>

          {/* Nav — Pill buttons */}
          <nav className="hidden md:flex items-center gap-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wider
                  border transition-all duration-300
                  ${location.pathname === item.path
                    ? 'bg-gold text-black border-gold shadow-gold-glow'
                    : 'border-gold/40 text-gold hover:bg-gold hover:text-black hover:shadow-gold-glow'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
        <div className="flex items-center justify-around rounded-full bg-bg-card border border-white/10 px-2 py-2 shadow-card">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center gap-0.5 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider
                transition-all duration-300
                ${location.pathname === item.path
                  ? 'bg-gold text-black'
                  : 'text-muted'
                }
              `}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </motion.header>
  );
}
