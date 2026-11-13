import { motion } from 'framer-motion';

const categories = [
  { id: 'college', emoji: '🎓', name: 'College & Stationery' },
  { id: 'tech', emoji: '💻', name: 'Tech & Gadgets' },
  { id: 'clothing', emoji: '👕', name: 'Clothing & Fashion' },
  { id: 'home', emoji: '🏠', name: 'Home & Essentials' },
  { id: 'books', emoji: '📚', name: 'Books & Study' },
  { id: 'gaming', emoji: '🎮', name: 'Gaming & Entertainment' },
  { id: 'health', emoji: '💊', name: 'Health & Fitness' },
  { id: 'travel', emoji: '✈️', name: 'Travel & Accessories' },
  { id: 'gifts', emoji: '🎁', name: 'Gifts & Misc' },
];

interface StepCategoriesProps {
  selected: string[];
  setSelected: (categories: string[]) => void;
}

const containerVariants = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
};

export function StepCategories({ selected, setSelected }: StepCategoriesProps) {
  const toggle = (id: string) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((c) => c !== id)
        : [...selected, id]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-heading text-white mb-2">WHAT ARE YOU SHOPPING FOR?</h2>
        <p className="text-muted text-sm">Select one or more categories</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {categories.map((cat) => {
          const isSelected = selected.includes(cat.id);
          return (
            <motion.button
              key={cat.id}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggle(cat.id)}
              className={`
                relative flex flex-col items-center gap-2 p-5 rounded-2xl
                border transition-all duration-300 cursor-pointer
                ${isSelected
                  ? 'bg-gold/10 border-gold/40 shadow-gold-glow'
                  : 'bg-bg-card border-white/[0.06] hover:bg-bg-card-hover hover:border-gold/20'
                }
              `}
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className={`text-xs font-semibold text-center leading-tight uppercase tracking-wider ${isSelected ? 'text-gold' : 'text-muted'}`}>
                {cat.name}
              </span>
              {isSelected && (
                <motion.div
                  layoutId="cat-check"
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gold flex items-center justify-center"
                >
                  <span className="text-[10px] text-black font-bold">✓</span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {selected.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-muted"
        >
          {selected.length} {selected.length === 1 ? 'category' : 'categories'} selected
        </motion.p>
      )}
    </motion.div>
  );
}
