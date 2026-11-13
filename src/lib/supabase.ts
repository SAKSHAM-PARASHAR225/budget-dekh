import { createClient } from '@supabase/supabase-js';
import { knapsack, type KnapsackItem } from './knapsack';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ygrxratpcvmgqzyzyvtd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlncnhyYXRwY3ZtZ3F6eXp5dnRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTU5ODgsImV4cCI6MjA5MDI5MTk4OH0.Z1bXnDXygil299N2g-idY8r4trEdWM3Ltlb846HOI3s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Session = {
  id: string;
  user_id: string | null;
  created_at: string;
  budget: number;
  currency: string;
  preferences: Record<string, unknown> | null;
  categories: string[];
};

export type Item = {
  id: string;
  session_id: string;
  name: string;
  category: string | null;
  estimated_price: number | null;
  actual_price: number | null;
  priority: number;
  source_url: string | null;
  source_name: string | null;
  image_url: string | null;
  is_selected: boolean;
  created_at: string;
};

export type Result = {
  id: string;
  session_id: string;
  selected_items: PricedItem[];
  left_out_items: PricedItem[];
  total_cost: number;
  total_priority: number;
  money_saved: number;
  extra_needed: PricedItem[] | null;
  created_at: string;
};

export type PricedItem = {
  name: string;
  best_price: number;
  platform: string;
  url: string;
  priority: number;
  rating?: number;
  reviews?: number;
  brand?: string;
  image_url?: string;
  alternatives?: { platform: string; price: number; url: string; rating?: number; reviews?: number }[];
  extra?: number;
};

export type OptimizeRequest = {
  budget: number;
  items: { name: string; priority: number; maxPrice?: number }[];
  currency: string;
  preferences: Record<string, unknown>;
  brands?: string[];
};

export type OptimizeResponse = {
  selected: PricedItem[];
  leftOut: PricedItem[];
  totalCost: number;
  totalPriority: number;
  remainingBudget: number;
  moneySaved: number;
  pricedItems: PricedItem[];
};

type EstimatedProduct = PricedItem & {
  estimatedCost: number;
};

const PLATFORM_BY_CATEGORY: Record<string, string[]> = {
  clothing: ['Myntra', 'Amazon', 'Flipkart'],
  tech: ['Amazon', 'Flipkart', 'Croma'],
  books: ['Amazon', 'Flipkart'],
  food: ['Amazon Fresh', 'Blinkit', 'Zepto'],
  home: ['Amazon', 'Flipkart', 'IKEA'],
  gaming: ['Amazon', 'Flipkart', 'Croma'],
  health: ['Amazon', 'PharmEasy', 'Tata 1mg'],
  travel: ['Amazon', 'Decathlon', 'Flipkart'],
  gifts: ['Amazon', 'Archies', 'Flipkart'],
  default: ['Amazon', 'Flipkart', 'Meesho'],
};

/** Direct search URLs for each platform — users land on the actual store */
const PLATFORM_SEARCH_URLS: Record<string, (query: string) => string> = {
  Amazon:        (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`,
  Flipkart:      (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`,
  Myntra:        (q) => `https://www.myntra.com/${encodeURIComponent(q.toLowerCase().replace(/\s+/g, '-'))}`,
  Meesho:        (q) => `https://www.meesho.com/search?q=${encodeURIComponent(q)}`,
  Croma:         (q) => `https://www.croma.com/searchB?q=${encodeURIComponent(q)}`,
  IKEA:          (q) => `https://www.ikea.com/in/en/search/?q=${encodeURIComponent(q)}`,
  'Amazon Fresh':(q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}&i=nowstore`,
  Blinkit:       (q) => `https://blinkit.com/s/?q=${encodeURIComponent(q)}`,
  Zepto:         (q) => `https://www.zeptonow.com/search?query=${encodeURIComponent(q)}`,
  PharmEasy:     (q) => `https://pharmeasy.in/search/all?name=${encodeURIComponent(q)}`,
  'Tata 1mg':    (q) => `https://www.1mg.com/search/all?name=${encodeURIComponent(q)}`,
  Decathlon:     (q) => `https://www.decathlon.in/search?query=${encodeURIComponent(q)}`,
  Archies:       (q) => `https://www.archiesonline.com/catalogsearch/result/?q=${encodeURIComponent(q)}`,
};

function platformUrl(platform: string, query: string): string {
  const builder = PLATFORM_SEARCH_URLS[platform];
  return builder ? builder(query) : `https://www.google.com/search?q=${encodeURIComponent(`buy ${query} on ${platform}`)}`;
}

const CATEGORY_KEYWORDS: Array<{ category: keyof typeof PLATFORM_BY_CATEGORY; words: string[] }> = [
  { category: 'clothing', words: ['shirt', 't-shirt', 'tshirt', 'jeans', 'sneaker', 'shoe', 'socks', 'belt', 'watch', 'sunglass', 'jacket', 'hoodie', 'dress'] },
  { category: 'tech', words: ['phone', 'earbud', 'headphone', 'speaker', 'mouse', 'keyboard', 'monitor', 'laptop', 'charger', 'cable', 'webcam', 'usb'] },
  { category: 'books', words: ['book', 'novel', 'diary', 'planner', 'notebook', 'ncert', 'reference'] },
  { category: 'food', words: ['rice', 'oil', 'noodle', 'tea', 'coffee', 'snack', 'bar', 'oats', 'protein'] },
  { category: 'home', words: ['pillow', 'bedsheet', 'bottle', 'towel', 'mug', 'lamp', 'organizer', 'kitchen'] },
  { category: 'gaming', words: ['controller', 'headset', 'mouse pad', 'game', 'gaming', 'console'] },
  { category: 'health', words: ['protein', 'band', 'yoga', 'rope', 'vitamin', 'fitness'] },
  { category: 'travel', words: ['luggage', 'neck pillow', 'adapter', 'toiletry', 'eye mask', 'travel'] },
  { category: 'gifts', words: ['gift', 'chocolate', 'frame', 'candle', 'toy'] },
];

function getCategory(name: string): keyof typeof PLATFORM_BY_CATEGORY {
  const lower = name.toLowerCase();
  const match = CATEGORY_KEYWORDS.find(({ words }) => words.some((word) => lower.includes(word)));
  return match?.category ?? 'default';
}

function estimatePrice(name: string, priority: number): number {
  const category = getCategory(name);
  const lower = name.toLowerCase();

  const ranges: Record<keyof typeof PLATFORM_BY_CATEGORY, [number, number]> = {
    clothing: [350, 1800],
    tech: [600, 7000],
    books: [120, 1200],
    food: [80, 900],
    home: [180, 2500],
    gaming: [1000, 8000],
    health: [200, 3500],
    travel: [250, 4500],
    gifts: [150, 2500],
    default: [250, 2200],
  };

  let [min, max] = ranges[category];
  if (lower.includes('premium') || lower.includes('pro')) {
    min *= 1.25;
    max *= 1.4;
  }

  const spread = max - min;
  const nameScore = [...lower].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const seed = (nameScore % 1000) / 1000;
  const priorityBias = 1 - Math.min(Math.max(priority, 1), 10) / 14;
  const estimated = min + spread * (0.25 + seed * 0.5 + priorityBias * 0.15);

  return Math.max(50, Math.round(estimated));
}

function buildAlternatives(name: string, bestPrice: number, category: keyof typeof PLATFORM_BY_CATEGORY): PricedItem['alternatives'] {
  const platforms = PLATFORM_BY_CATEGORY[category] ?? PLATFORM_BY_CATEGORY.default;
  return platforms.slice(1).map((platform, index) => {
    const multiplier = index === 0 ? 1.18 : 1.32;
    const price = Math.max(50, Math.round(bestPrice * multiplier));
    return {
      platform,
      price,
      url: platformUrl(platform, name),
      rating: Math.max(3.2, Math.min(4.8, 3.5 + index * 0.4)),
      reviews: 500 + index * 1200,
    };
  });
}

function buildEstimatedProduct(item: OptimizeRequest['items'][number]): EstimatedProduct {
  const category = getCategory(item.name);
  const bestPrice = estimatePrice(item.name, item.priority);
  const platforms = PLATFORM_BY_CATEGORY[category] ?? PLATFORM_BY_CATEGORY.default;
  const primaryPlatform = platforms[0] ?? 'Amazon';

  return {
    name: item.name,
    best_price: bestPrice,
    platform: primaryPlatform,
    url: platformUrl(primaryPlatform, item.name),
    priority: item.priority,
    rating: Math.max(3.4, Math.min(4.8, 3.7 + item.priority * 0.08)),
    reviews: 1000 + item.priority * 350,
    brand: primaryPlatform,
    alternatives: buildAlternatives(item.name, bestPrice, category),
    estimatedCost: bestPrice,
  };
}

function optimizeLocally(data: OptimizeRequest): OptimizeResponse {
  const pricedItems = data.items.map(buildEstimatedProduct);
  const knapsackItems: KnapsackItem[] = pricedItems.map((item) => ({
    name: item.name,
    best_price: item.best_price,
    priority: item.priority,
  }));

  const { selected } = knapsack(knapsackItems, data.budget);
  const selectedNames = new Set(selected.map((item) => item.name));

  const selectedItems = pricedItems.filter((item) => selectedNames.has(item.name));
  const leftOutItems = pricedItems.filter((item) => !selectedNames.has(item.name)).map((item) => ({
    ...item,
    extra: Math.max(0, item.best_price - data.budget),
  }));

  const totalCost = selectedItems.reduce((sum, item) => sum + item.best_price, 0);
  const totalPriority = selectedItems.reduce((sum, item) => sum + item.priority, 0);

  return {
    selected: selectedItems,
    leftOut: leftOutItems,
    totalCost,
    totalPriority,
    remainingBudget: Math.max(0, data.budget - totalCost),
    moneySaved: Math.max(0, data.budget - totalCost),
    pricedItems,
  };
}

export async function callOptimize(data: OptimizeRequest): Promise<OptimizeResponse> {
  try {
    const { data: result, error } = await supabase.functions.invoke('knapsave-optimize', {
      body: data,
    });

    if (error) throw error;
    if (!result || !Array.isArray((result as OptimizeResponse).selected)) {
      throw new Error('Invalid optimize response');
    }

    return result as OptimizeResponse;
  } catch (error) {
    console.warn('Falling back to local optimizer:', error);
    return optimizeLocally(data);
  }
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
