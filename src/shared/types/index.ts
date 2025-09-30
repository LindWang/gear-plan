// Centralized type exports - single import location for all application types
// This barrel export simplifies imports and reduces coupling

// Re-export all shared UI types
export type {
  GearCategory,
  TripType,
  GearItem,
  CategoryStats,
  WeightDistribution
} from '@/shared/lib/types.js';

// Re-export all database/API types
export type {
  GearItem as DatabaseGearItem,
  GearItemInsert,
  GearItemUpdate,
  GearList,
  GearListInsert,
  User,
  ApiResponse,
  PaginatedResponse,
  GearItemFilters,
  GearListFilters,
  RealtimeGearItem,
  RealtimeGearList
} from '@/entities/gear/types.js';

// Re-export constants for convenience
export {
  GEAR_CATEGORIES,
  CATEGORY_DESCRIPTIONS,
  TRIP_TYPES,
  TRIP_TYPE_DESCRIPTIONS
} from '@/shared/lib/types.js';

// Re-export validation types if they exist
export type { ValidationResult, GearItemInput } from '@/shared/lib/validation.js';

// Common type utilities
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type WithoutId<T> = Omit<T, 'id'>;
export type WithTimestamps<T> = T & {
  created_at: string;
  updated_at: string;
};