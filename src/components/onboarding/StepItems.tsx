import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { GlassInput } from '../ui/GlassInput';

export type UserItem = {
  id: string;
  name: string;
  priority: number;
  maxPrice?: number;
};

const suggestions: Record<string, string[]> = {
  college: ['Notebooks', 'Pens', 'Backpack', 'Calculator', 'Sticky Notes', 'Highlighters', 'Geometry Box'],
  tech: ['Earbuds', 'Phone Case', 'USB Cable', 'Mouse', 'Keyboard', 'Webcam', 'USB Hub'],
  clothing: ['T-Shirt', 'Jeans', 'Sneakers', 'Sunglasses', 'Watch', 'Socks', 'Belt'],
  food: ['Rice', 'Cooking Oil', 'Instant Noodles', 'Tea', 'Protein Bar', 'Dry Fruits', 'Oats'],
  home: ['Pillow', 'Bedsheet', 'Water Bottle', 'Towel', 'Mug', 'Lamp', 'Organizer'],
  books: ['Novel', 'NCERT Books', 'Reference Book', 'Diary', 'Planner', 'Self-Help Book'],
  gaming: ['Controller', 'Gaming Mouse', 'Headset', 'Mouse Pad', 'Game DVD', 'Cooling Pad'],
  health: ['Protein Powder', 'Resistance Band', 'Yoga Mat', 'Skipping Rope', 'Vitamins'],
  travel: ['Luggage Tag', 'Neck Pillow', 'Travel Adapter', 'Toiletry Bag', 'Eye Mask'],
  gifts: ['Gift Card', 'Chocolates', 'Photo Frame', 'Scented Candle', 'Soft Toy'],
};

interface StepItemsProps {
  items: UserItem[];
  setItems: (items: UserItem[]) => void;
  categories: string[];
}

export function StepItems({ items, setItems, categories }: StepItemsProps) {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState(5);
  const [mode, setMode] = useState<'suggest' | 'custom'>('suggest');

  const addItem = (itemName: string, p = 5) => {
    if (!itemName.trim()) return;
    if (items.find((i) => i.name.toLowerCase() === itemName.toLowerCase())) return;
    setItems([
      ...items,
      { id: crypto.randomUUID(), name: itemName.trim(), priority: p },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const relevantSuggestions = categories.flatMap((c) => suggestions[c] || []);
  const addedNames = new Set(items.map((i) => i.name.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-heading text-white mb-2">ADD YOUR ITEMS</h2>
        <p className="text-muted text-sm">Select from suggestions or add your own</p>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setMode('suggest')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer border
            ${mode === 'suggest' ? 'bg-gold/15 text-gold border-gold/30' : 'bg-white/[0.03] text-muted border-white/[0.08]'}`}
        >
          ✨ AI Suggestions
        </button>
        <button
          onClick={() => setMode('custom')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer border
            ${mode === 'custom' ? 'bg-gold/15 text-gold border-gold/30' : 'bg-white/[0.03] text-muted border-white/[0.08]'}`}
        >
          ✏️ Custom Add
        </button>
      </div>

      {/* Suggestions mode */}
      {mode === 'suggest' && (
        <div className="flex flex-wrap gap-2 justify-center">
          {relevantSuggestions.map((s) => {
            const added = addedNames.has(s.toLowerCase());
            return (
              <motion.button
                key={s}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (added ? removeItem(items.find(i => i.name.toLowerCase() === s.toLowerCase())!.id) : addItem(s))}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer border
                  ${added
                    ? 'bg-gold/15 text-gold border-gold/40'
                    : 'bg-white/[0.03] text-muted border-white/[0.08] hover:bg-white/[0.06] hover:border-gold/20'
                  }`}
              >
                {added ? '✓' : '+'} {s}
              </motion.button>
            );
          })}
          {relevantSuggestions.length === 0 && (
            <p className="text-dim text-sm">Select categories first to see suggestions</p>
          )}
        </div>
      )}

      {/* Custom add mode */}
      {mode === 'custom' && (
        <GlassCard hover={false} className="space-y-4">
          <GlassInput
            label="Item name"
            placeholder="e.g., Wireless Earbuds"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addItem(name, priority);
                setName('');
              }
            }}
          />
          <div className="space-y-1">
            <label className="text-sm text-muted font-semibold uppercase tracking-wider pl-1">
              Priority: {priority}/10
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="w-full h-2 bg-white/[0.06] rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold
                [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,214,0,0.5)] [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
          <GlassButton
            onClick={() => {
              addItem(name, priority);
              setName('');
            }}
            disabled={!name.trim()}
            fullWidth
          >
            + Add Item
          </GlassButton>
        </GlassCard>
      )}

      {/* Items list */}
      {items.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted font-semibold uppercase tracking-wider">
            Your items ({items.length})
          </p>
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-card border border-white/[0.06]"
              >
                <span className="flex-1 text-sm text-white/80 font-medium">{item.name}</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${i < item.priority ? 'bg-gold' : 'bg-white/[0.08]'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-dim hover:text-red-400 transition-colors text-lg cursor-pointer"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
