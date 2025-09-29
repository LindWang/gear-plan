import type { GearItem, CategoryStats, GearCategory } from './types.js';

/**
 * Calculate the total weight of all gear items
 */
export function calculateTotalWeight(items: GearItem[]): number {
  return items.reduce((total, item) => total + item.weight, 0);
}

/**
 * Calculate category statistics including total weight and percentage
 */
export function calculateCategoryStats(items: GearItem[]): CategoryStats[] {
  const totalWeight = calculateTotalWeight(items);
  
  // Group items by category
  const categoryGroups = items.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {} as Record<GearCategory, GearItem[]>);

  // Calculate stats for each category
  return Object.entries(categoryGroups).map(([category, categoryItems]) => ({
    category: category as GearCategory,
    totalWeight: categoryItems.reduce((sum, item) => sum + item.weight, 0),
    percentage: totalWeight > 0 ? (categoryItems.reduce((sum, item) => sum + item.weight, 0) / totalWeight) * 100 : 0,
    itemCount: categoryItems.length
  }));
}

/**
 * Format weight for display (grams with appropriate unit)
 */
export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${kg.toFixed(kg >= 10 ? 0 : 1)} kg`;
  }
  return `${grams} g`;
}

/**
 * Generate a unique ID for new gear items
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}