import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';

interface Preferences {
  gender: string;
  shopping: string;
  delivery: string;
  platform: string;
  notes: string;
  priceQuality: number;
  brands: string[];
  clothingSize: string;
  shoeSize: string;
}

interface StepPreferencesProps {
  preferences: Preferences;
  setPreferences: (prefs: Preferences) => void;
  categories: string[];
}

// Category-aware brand mapping
const brandsByCategory: Record<string, { id: string; label: string; icon: string }[]> = {
  clothing: [
    { id: 'nike', label: 'Nike', icon: '👟' },
    { id: 'adidas', label: 'Adidas', icon: '⚡' },
    { id: 'puma', label: 'Puma', icon: '🐆' },
    { id: 'hnm', label: 'H&M', icon: '👔' },
    { id: 'zara', label: 'Zara', icon: '👗' },
    { id: 'levis', label: "Levi's", icon: '👖' },
    { id: 'uspa', label: 'U.S. Polo', icon: '🏇' },
    { id: 'allen-solly', label: 'Allen Solly', icon: '👕' },
    { id: 'roadster', label: 'Roadster', icon: '🧥' },
    { id: 'bewakoof', label: 'Bewakoof', icon: '😎' },
    { id: 'max', label: 'Max Fashion', icon: '🛍️' },
    { id: 'campus', label: 'Campus', icon: '👟' },
    { id: 'sparx', label: 'Sparx', icon: '🥿' },
    { id: 'red-tape', label: 'Red Tape', icon: '🥾' },
  ],
  tech: [
    { id: 'samsung', label: 'Samsung', icon: '📱' },
    { id: 'apple', label: 'Apple', icon: '🍎' },
    { id: 'sony', label: 'Sony', icon: '🎧' },
    { id: 'boat', label: 'boAt', icon: '🔊' },
    { id: 'hp', label: 'HP', icon: '💻' },
    { id: 'dell', label: 'Dell', icon: '🖥️' },
    { id: 'lenovo', label: 'Lenovo', icon: '⌨️' },
    { id: 'logitech', label: 'Logitech', icon: '🖱️' },
    { id: 'realme', label: 'Realme', icon: '📲' },
    { id: 'mi', label: 'Xiaomi/Mi', icon: '🏷️' },
    { id: 'jbl', label: 'JBL', icon: '🎵' },
    { id: 'oneplus', label: 'OnePlus', icon: '📱' },
  ],
  gaming: [
    { id: 'sony', label: 'Sony/PS', icon: '🎮' },
    { id: 'logitech', label: 'Logitech', icon: '🖱️' },
    { id: 'razer', label: 'Razer', icon: '🐍' },
    { id: 'asus-rog', label: 'ASUS ROG', icon: '💻' },
    { id: 'boat', label: 'boAt', icon: '🔊' },
    { id: 'cosmicbyte', label: 'Cosmic Byte', icon: '🎧' },
    { id: 'redgear', label: 'Redgear', icon: '🕹️' },
    { id: 'ant-esports', label: 'Ant Esports', icon: '⚔️' },
  ],
  health: [
    { id: 'nike', label: 'Nike', icon: '👟' },
    { id: 'adidas', label: 'Adidas', icon: '⚡' },
    { id: 'puma', label: 'Puma', icon: '🐆' },
    { id: 'decathlon', label: 'Decathlon', icon: '🏋️' },
    { id: 'muscleblaze', label: 'MuscleBlaze', icon: '💪' },
    { id: 'boldfit', label: 'Boldfit', icon: '🏃' },
    { id: 'fire-boltt', label: 'Fire-Boltt', icon: '⌚' },
    { id: 'noise', label: 'Noise', icon: '⌚' },
  ],
  home: [
    { id: 'prestige', label: 'Prestige', icon: '🍳' },
    { id: 'philips', label: 'Philips', icon: '💡' },
    { id: 'ikea', label: 'IKEA', icon: '🪑' },
    { id: 'bajaj', label: 'Bajaj', icon: '🔌' },
    { id: 'pigeon', label: 'Pigeon', icon: '🫖' },
    { id: 'milton', label: 'Milton', icon: '🫙' },
    { id: 'borosil', label: 'Borosil', icon: '🥛' },
  ],
  college: [
    { id: 'classmate', label: 'Classmate', icon: '📓' },
    { id: 'apsara', label: 'Apsara', icon: '✏️' },
    { id: 'casio', label: 'Casio', icon: '🧮' },
    { id: 'wildcraft', label: 'Wildcraft', icon: '🎒' },
    { id: 'american-tourister', label: 'American Tourister', icon: '🧳' },
    { id: 'safari', label: 'Safari', icon: '🎒' },
  ],
  books: [
    { id: 'any', label: 'Any Publisher', icon: '🌐' },
  ],
  travel: [
    { id: 'wildcraft', label: 'Wildcraft', icon: '🎒' },
    { id: 'american-tourister', label: 'American Tourister', icon: '🧳' },
    { id: 'safari', label: 'Safari', icon: '🎒' },
    { id: 'skybags', label: 'Skybags', icon: '💼' },
    { id: 'noise', label: 'Noise', icon: '⌚' },
    { id: 'boat', label: 'boAt', icon: '🎧' },
  ],
  gifts: [
    { id: 'any', label: 'Any Brand', icon: '🌐' },
  ],
};

const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const shoeSizes = ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];

// Categories that need clothing sizes
const needsClothingSize = ['clothing', 'health'];
// Categories that need shoe sizes  
const needsShoeSize = ['clothing', 'health'];

// Category-aware platform mapping
const platformsByCategory: Record<string, { value: string; label: string }[]> = {
  clothing: [
    { value: 'amazon', label: 'Amazon' },
    { value: 'flipkart', label: 'Flipkart' },
    { value: 'myntra', label: 'Myntra' },
    { value: 'ajio', label: 'AJIO' },
    { value: 'meesho', label: 'Meesho' },
    { value: 'any', label: 'Any platform' },
  ],
  tech: [
    { value: 'amazon', label: 'Amazon' },
    { value: 'flipkart', label: 'Flipkart' },
    { value: 'croma', label: 'Croma' },
    { value: 'reliance-digital', label: 'Reliance Digital' },
    { value: 'any', label: 'Any platform' },
  ],
  gaming: [
    { value: 'amazon', label: 'Amazon' },
    { value: 'flipkart', label: 'Flipkart' },
    { value: 'croma', label: 'Croma' },
    { value: 'any', label: 'Any platform' },
  ],
  health: [
    { value: 'amazon', label: 'Amazon' },
    { value: 'flipkart', label: 'Flipkart' },
    { value: 'myntra', label: 'Myntra' },
    { value: 'decathlon', label: 'Decathlon' },
    { value: 'any', label: 'Any platform' },
  ],
  home: [
    { value: 'amazon', label: 'Amazon' },
    { value: 'flipkart', label: 'Flipkart' },
    { value: 'meesho', label: 'Meesho' },
    { value: 'any', label: 'Any platform' },
  ],
  college: [
    { value: 'amazon', label: 'Amazon' },
    { value: 'flipkart', label: 'Flipkart' },
    { value: 'any', label: 'Any platform' },
  ],
  books: [
    { value: 'amazon', label: 'Amazon' },
    { value: 'flipkart', label: 'Flipkart' },
    { value: 'any', label: 'Any platform' },
  ],
  travel: [
    { value: 'amazon', label: 'Amazon' },
    { value: 'flipkart', label: 'Flipkart' },
    { value: 'myntra', label: 'Myntra' },
    { value: 'any', label: 'Any platform' },
  ],
  gifts: [
    { value: 'amazon', label: 'Amazon' },
    { value: 'flipkart', label: 'Flipkart' },
    { value: 'meesho', label: 'Meesho' },
    { value: 'any', label: 'Any platform' },
  ],
};

const defaultPlatforms = [
  { value: 'amazon', label: 'Amazon' },
  { value: 'flipkart', label: 'Flipkart' },
  { value: 'meesho', label: 'Meesho' },
  { value: 'any', label: 'Any platform' },
];

export function StepPreferences({ preferences, setPreferences, categories }: StepPreferencesProps) {
  const update = (key: keyof Preferences, value: string | number | string[]) => {
    setPreferences({ ...preferences, [key]: value });
  };

  const toggleBrand = (brandId: string) => {
    const brands = preferences.brands || [];
    if (brandId === 'any') {
      update('brands', ['any']);
      return;
    }
    const filtered = brands.filter(b => b !== 'any');
    if (filtered.includes(brandId)) {
      update('brands', filtered.filter(b => b !== brandId));
    } else {
      update('brands', [...filtered, brandId]);
    }
  };

  // Build relevant brands from selected categories
  const relevantBrands = (() => {
    const seen = new Set<string>();
    const result: { id: string; label: string; icon: string }[] = [];
    
    for (const cat of categories) {
      const catBrands = brandsByCategory[cat] || [];
      for (const brand of catBrands) {
        if (!seen.has(brand.id)) {
          seen.add(brand.id);
          result.push(brand);
        }
      }
    }
    
    // Always add "Any Brand" at the end if not already there
    if (!seen.has('any')) {
      result.push({ id: 'any', label: 'Any Brand', icon: '🌐' });
    }
    
    return result;
  })();

  // Build relevant platforms from selected categories
  const relevantPlatforms = (() => {
    const seen = new Set<string>();
    const result: { value: string; label: string }[] = [];
    
    for (const cat of categories) {
      const catPlatforms = platformsByCategory[cat] || defaultPlatforms;
      for (const plat of catPlatforms) {
        if (!seen.has(plat.value)) {
          seen.add(plat.value);
          result.push(plat);
        }
      }
    }
    
    // Ensure "Any platform" is always at the end
    if (!seen.has('any')) {
      result.push({ value: 'any', label: 'Any platform' });
    } else {
      // Move "any" to end
      const anyIdx = result.findIndex(p => p.value === 'any');
      if (anyIdx >= 0 && anyIdx !== result.length - 1) {
        const [anyItem] = result.splice(anyIdx, 1);
        result.push(anyItem);
      }
    }
    
    return result.length > 0 ? result : defaultPlatforms;
  })();

  // Check if we need size inputs
  const showClothingSize = categories.some(c => needsClothingSize.includes(c));
  const showShoeSize = categories.some(c => needsShoeSize.includes(c));
  // Gender only relevant for clothing & gifts
  const showGender = categories.some(c => ['clothing', 'gifts'].includes(c));

  const OptionRow = ({
    label,
    icon,
    options,
    value,
    onChange,
  }: {
    label: string;
    icon: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="space-y-2">
      <p className="text-sm text-muted font-semibold">
        <span className="mr-2">{icon}</span>
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer border
              ${value === opt.value
                ? 'bg-gold/15 text-gold border-gold/30'
                : 'bg-white/[0.03] text-muted border-white/[0.08] hover:bg-white/[0.06]'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  const currentBrands = preferences.brands || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-heading text-white mb-2">YOUR PREFERENCES</h2>
        <p className="text-muted text-sm">Help us personalize your results</p>
      </div>

      <GlassCard className="space-y-6" hover={false}>
        {/* GENDER SELECTOR — only for clothing & gifts */}
        {showGender && (
          <div className="space-y-2">
            <p className="text-sm text-muted font-semibold">
              <span className="mr-2">👤</span>
              Shopping for
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'male', label: 'Male', emoji: '👨' },
                { value: 'female', label: 'Female', emoji: '👩' },
                { value: 'unisex', label: 'Both / Unisex', emoji: '🧑' },
              ].map((opt) => (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => update('gender', opt.value)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer border
                    ${
                      preferences.gender === opt.value
                        ? 'bg-gold/15 text-gold border-gold/40 shadow-[0_0_12px_rgba(255,214,0,0.15)]'
                        : 'bg-white/[0.03] text-muted border-white/[0.08] hover:bg-white/[0.06] hover:border-gold/20'
                    }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  {opt.label}
                  {preferences.gender === opt.value && (
                    <span className="ml-1 w-4 h-4 rounded-full bg-gold flex items-center justify-center text-black text-[9px] font-black">✓</span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <OptionRow
          label="Shopping priority"
          icon="🛒"
          options={[
            { value: 'cheapest', label: '💰 Cheapest price' },
            { value: 'quality', label: '⭐ Best quality' },
            { value: 'balanced', label: '⚖️ Balanced' },
          ]}
          value={preferences.shopping}
          onChange={(v) => update('shopping', v)}
        />

        <OptionRow
          label="Delivery speed"
          icon="🚚"
          options={[
            { value: 'fast', label: '⚡ Need it fast' },
            { value: 'standard', label: '📦 Standard is fine' },
          ]}
          value={preferences.delivery}
          onChange={(v) => update('delivery', v)}
        />

        <OptionRow
          label="Platform preference"
          icon="🏪"
          options={relevantPlatforms}
          value={preferences.platform}
          onChange={(v) => update('platform', v)}
        />

        {/* SIZE SELECTORS — Only show for clothing/footwear */}
        {showClothingSize && (
          <div className="space-y-2">
            <p className="text-sm text-muted font-semibold">
              <span className="mr-2">📏</span>
              Clothing Size
            </p>
            <div className="flex flex-wrap gap-2">
              {clothingSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => update('clothingSize', size)}
                  className={`w-14 h-10 rounded-full text-sm font-bold transition-all cursor-pointer border flex items-center justify-center
                    ${preferences.clothingSize === size
                      ? 'bg-gold/15 text-gold border-gold/30'
                      : 'bg-white/[0.03] text-muted border-white/[0.08] hover:bg-white/[0.06]'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {showShoeSize && (
          <div className="space-y-2">
            <p className="text-sm text-muted font-semibold">
              <span className="mr-2">👟</span>
              Shoe / Sneaker Size
            </p>
            <div className="flex flex-wrap gap-2">
              {shoeSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => update('shoeSize', size)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer border
                    ${preferences.shoeSize === size
                      ? 'bg-gold/15 text-gold border-gold/30'
                      : 'bg-white/[0.03] text-muted border-white/[0.08] hover:bg-white/[0.06]'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* BRAND SELECTOR — Category-aware */}
        <div className="space-y-3">
          <p className="text-sm text-muted font-semibold">
            <span className="mr-2">🏷️</span>
            Preferred Brands
          </p>
          <p className="text-xs text-dim">
            Showing brands relevant to your selected categories
          </p>
          <div className="flex flex-wrap gap-2">
            {relevantBrands.map((brand) => {
              const isSelected = currentBrands.includes(brand.id);
              return (
                <motion.button
                  key={brand.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleBrand(brand.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer border flex items-center gap-1.5
                    ${isSelected
                      ? 'bg-gold/15 text-gold border-gold/30'
                      : 'bg-white/[0.03] text-muted border-white/[0.08] hover:bg-white/[0.06]'
                    }`}
                >
                  <span>{brand.icon}</span>
                  {brand.label}
                  {isSelected && brand.id !== 'any' && <span className="text-xs ml-0.5">✕</span>}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Priority slider */}
        <div className="space-y-3">
          <p className="text-sm text-muted font-semibold">⚖️ Price vs Quality balance</p>
          <div className="relative">
            <input
              type="range"
              min={1}
              max={10}
              value={preferences.priceQuality}
              onChange={(e) => update('priceQuality', Number(e.target.value))}
              className="w-full h-2 bg-white/[0.06] rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold
                [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,214,0,0.5)] [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-xs text-dim mt-1">
              <span>💰 Price matters most</span>
              <span>⭐ Quality matters most</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <p className="text-sm text-muted font-semibold">📝 Special notes (optional)</p>
          <textarea
            value={preferences.notes}
            onChange={(e) => update('notes', e.target.value)}
            placeholder="e.g., I'm a college student, looking for budget options..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-bg-card border border-white/[0.08] text-white text-sm
              placeholder:text-dim outline-none resize-none
              focus:border-gold/50 focus:bg-bg-card-hover transition-all duration-300"
          />
        </div>
      </GlassCard>
    </motion.div>
  );
}
