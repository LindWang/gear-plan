export type GearCategory = 
  | 'Clothing & Protection'
  | 'Hydration & Essentials'
  | 'Shelter'
  | 'Sleep System'
  | 'Pack System';

export interface GearItem {
  id: string;
  name: string;
  category: GearCategory;
  weight: number; // weight in grams
}

export interface CategoryStats {
  category: GearCategory;
  totalWeight: number;
  percentage: number;
  itemCount: number;
}

export const GEAR_CATEGORIES: GearCategory[] = [
  'Clothing & Protection',
  'Hydration & Essentials',
  'Shelter',
  'Sleep System',
  'Pack System'
];

// Category descriptions for better UX
export const CATEGORY_DESCRIPTIONS: Record<GearCategory, string> = {
  'Clothing & Protection': 'Base layers, rain gear, insulation, gloves, hats',
  'Hydration & Essentials': 'Water, filters, first aid, navigation, tools',
  'Shelter': 'Tent, tarp, footprint, stakes',
  'Sleep System': 'Sleeping bag, pad, pillow',
  'Pack System': 'Backpack, stuff sacks, compression sacks'
};