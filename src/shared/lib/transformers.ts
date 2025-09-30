// Data transformation utilities between UI and database formats
import type { GearItem, DatabaseGearItem, GearItemInsert, GearItemUpdate } from '@/shared/types';

/**
 * Transform database gear item to UI format
 */
export function transformDatabaseToUI(dbItem: DatabaseGearItem): GearItem {
  return {
    id: dbItem.id,
    name: dbItem.name,
    description: dbItem.description || '',
    category: dbItem.category,
    weight: dbItem.weight_grams || 0,
    quantity: dbItem.quantity || 1,
    isPacked: dbItem.is_packed || false,
    isWorn: dbItem.is_worn || false,
    url: dbItem.purchase_url || '',
    notes: dbItem.notes || ''
  };
}

/**
 * Transform UI gear item to database insert format
 */
export function transformUIToInsert(
  uiItem: Omit<GearItem, 'id'>, 
  listId: string
): GearItemInsert {
  return {
    list_id: listId,
    name: uiItem.name,
    description: uiItem.description || null,
    category: uiItem.category,
    weight_grams: uiItem.weight || 0,
    quantity: uiItem.quantity || 1,
    is_packed: uiItem.isPacked || false,
    is_worn: uiItem.isWorn || false,
    purchase_url: uiItem.url || null,
    notes: uiItem.notes || null
  };
}

/**
 * Transform UI gear item updates to database update format
 */
export function transformUIToUpdate(uiUpdates: Partial<GearItem>): GearItemUpdate {
  const dbUpdates: GearItemUpdate = {};
  
  if (uiUpdates.name !== undefined) dbUpdates.name = uiUpdates.name;
  if (uiUpdates.description !== undefined) dbUpdates.description = uiUpdates.description;
  if (uiUpdates.category !== undefined) dbUpdates.category = uiUpdates.category;
  if (uiUpdates.weight !== undefined) dbUpdates.weight_grams = uiUpdates.weight;
  if (uiUpdates.quantity !== undefined) dbUpdates.quantity = uiUpdates.quantity;
  if (uiUpdates.isPacked !== undefined) dbUpdates.is_packed = uiUpdates.isPacked;
  if (uiUpdates.isWorn !== undefined) dbUpdates.is_worn = uiUpdates.isWorn;
  if (uiUpdates.url !== undefined) dbUpdates.purchase_url = uiUpdates.url;
  if (uiUpdates.notes !== undefined) dbUpdates.notes = uiUpdates.notes;
  
  return dbUpdates;
}

/**
 * Batch transform multiple database items to UI format
 */
export function transformDatabaseArrayToUI(dbItems: DatabaseGearItem[]): GearItem[] {
  return dbItems.map(transformDatabaseToUI);
}

/**
 * Transform UI weight distribution data
 */
export interface WeightRange {
  label: string;
  range: string;
  count: number;
  min: number;
  max: number;
}

export function createWeightDistribution(items: GearItem[]) {
  const ranges: Record<string, WeightRange> = {
    ultraLight: { label: 'Ultra Light', range: '0-100g', count: 0, min: 0, max: 100 },
    light: { label: 'Light', range: '101-500g', count: 0, min: 101, max: 500 },
    medium: { label: 'Medium', range: '501-1000g', count: 0, min: 501, max: 1000 },
    heavy: { label: 'Heavy', range: '1000g+', count: 0, min: 1001, max: Infinity }
  };

  items.forEach(item => {
    const weight = item.weight;
    if (weight <= 100) ranges.ultraLight.count++;
    else if (weight <= 500) ranges.light.count++;
    else if (weight <= 1000) ranges.medium.count++;
    else ranges.heavy.count++;
  });

  return ranges;
}