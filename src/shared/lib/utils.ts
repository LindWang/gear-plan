import type { GearItem, CategoryStats, GearCategory } from '@/shared/types';

/**
 * Calculate the total weight of all gear items
 */
export function calculateTotalWeight(items: GearItem[]): number {
  return items.reduce((total, item) => total + (item.weight * item.quantity), 0);
}

/**
 * Calculate category statistics including total weight and percentage
 */
export function calculateCategoryStats(items: GearItem[]): CategoryStats[] {
  const totalWeight = calculateTotalWeight(items);
  
  // Group items by category with accumulated stats
  const categoryMap = new Map<GearCategory, CategoryStats>();
  
  items.forEach(item => {
    const itemWeight = item.weight * item.quantity;
    const existing = categoryMap.get(item.category);
    
    if (existing) {
      existing.totalWeight += itemWeight;
      existing.itemCount += 1;
    } else {
      categoryMap.set(item.category, {
        category: item.category,
        totalWeight: itemWeight,
        percentage: 0, // Will be calculated after grouping
        itemCount: 1
      });
    }
  });

  // Calculate percentages and return array
  return Array.from(categoryMap.values()).map(stat => ({
    ...stat,
    percentage: totalWeight > 0 ? (stat.totalWeight / totalWeight) * 100 : 0
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

/**
 * Calculate total weight with quantity consideration
 */
export function calculateWeightWithQuantity(items: GearItem[]): number {
  return items.reduce((total, item) => total + (item.weight * item.quantity), 0);
}

/**
 * Group items by category for analysis
 */
export function groupItemsByCategory(items: GearItem[]): Map<GearCategory, GearItem[]> {
  return items.reduce((groups, item) => {
    const existing = groups.get(item.category) || [];
    existing.push(item);
    groups.set(item.category, existing);
    return groups;
  }, new Map<GearCategory, GearItem[]>());
}