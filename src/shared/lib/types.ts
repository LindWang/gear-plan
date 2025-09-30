// Shared application types - single source of truth
export type GearCategory = 
  | 'Clothing & Protection'
  | 'Hydration & Essentials'
  | 'Shelter'
  | 'Sleep System'
  | 'Pack System';

export type TripType = 
  | 'day_hike'
  | 'overnight_backpacking'
  | 'multi_day_backpacking'
  | 'car_camping'
  | 'winter_camping';

// UI-focused types for widgets and components
export interface GearItem {
  id: string;
  name: string;
  description: string;
  category: GearCategory;
  weight: number; // weight in grams
  quantity: number;
  isPacked: boolean;
  isWorn: boolean;
  url: string;
  notes: string;
}

export interface CategoryStats {
  category: GearCategory;
  totalWeight: number;
  percentage: number;
  itemCount: number;
}

// Weight distribution for analytics
export interface WeightDistribution {
  ultraLight: { label: string; range: string; count: number };
  light: { label: string; range: string; count: number };
  medium: { label: string; range: string; count: number };
  heavy: { label: string; range: string; count: number };
}

// Constants
export const GEAR_CATEGORIES: GearCategory[] = [
  'Clothing & Protection',
  'Hydration & Essentials',
  'Shelter',
  'Sleep System',
  'Pack System'
];

export const CATEGORY_DESCRIPTIONS: Record<GearCategory, string> = {
  'Clothing & Protection': 'Base layers, rain gear, insulation, gloves, hats',
  'Hydration & Essentials': 'Water, filters, first aid, navigation, tools',
  'Shelter': 'Tent, tarp, footprint, stakes',
  'Sleep System': 'Sleeping bag, pad, pillow',
  'Pack System': 'Backpack, stuff sacks, compression sacks'
};

export const TRIP_TYPES: TripType[] = [
  'day_hike',
  'overnight_backpacking',
  'multi_day_backpacking',
  'car_camping',
  'winter_camping'
];

export const TRIP_TYPE_DESCRIPTIONS: Record<TripType, string> = {
  'day_hike': 'Single day hiking with no overnight gear',
  'overnight_backpacking': '1-2 night backpacking trips',
  'multi_day_backpacking': '3+ night backpacking expeditions',
  'car_camping': 'Car accessible camping with comfort items',
  'winter_camping': 'Cold weather and snow camping gear'
};