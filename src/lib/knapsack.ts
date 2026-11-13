export type KnapsackItem = {
  name: string;
  best_price: number;
  priority: number;
  [key: string]: unknown;
};

export type KnapsackResult = {
  selected: KnapsackItem[];
  maxValue: number;
  remainingBudget: number;
};

/**
 * 0/1 Knapsack Algorithm
 * Uses dynamic programming to find the optimal combination
 * of items that maximizes total priority within budget.
 */
export function knapsack(items: KnapsackItem[], budget: number): KnapsackResult {
  const W = Math.round(budget);
  const n = items.length;
  
  // Handle edge cases
  if (n === 0 || W <= 0) {
    return { selected: [], maxValue: 0, remainingBudget: W };
  }

  // Create DP table
  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(W + 1).fill(0));

  // Fill DP table
  for (let i = 1; i <= n; i++) {
    const w = Math.round(items[i - 1].best_price);
    const v = items[i - 1].priority;
    for (let cap = 0; cap <= W; cap++) {
      dp[i][cap] = dp[i - 1][cap];
      if (w <= cap) {
        dp[i][cap] = Math.max(dp[i][cap], dp[i - 1][cap - w] + v);
      }
    }
  }

  // Backtrack to find selected items
  const selected: KnapsackItem[] = [];
  let cap = W;
  for (let i = n; i >= 1; i--) {
    if (dp[i][cap] !== dp[i - 1][cap]) {
      selected.push(items[i - 1]);
      cap -= Math.round(items[i - 1].best_price);
    }
  }

  return {
    selected,
    maxValue: dp[n][W],
    remainingBudget: cap,
  };
}
