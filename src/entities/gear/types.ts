// Database types for Neon PostgreSQL integration
// Import shared types as single source of truth
import type { GearCategory, TripType } from '@/shared/lib/types.js';

export type PermissionLevel = 'view' | 'edit' | 'admin';

// Re-export shared types for convenience
export type { GearCategory, TripType, CategoryStats } from '@/shared/lib/types.js';

// Core database types (matching Neon schema)
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  name: string;
}

export interface GearList {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  trip_type: TripType;
  is_public: boolean;
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

export interface GearItem {
  id: string;
  list_id: string;  // Changed from gear_list_id to match database
  name: string;
  description: string | null;
  category: GearCategory;
  weight_grams: number;
  brand: string | null;
  model: string | null;
  price_cents: number | null;
  purchase_url: string | null;
  notes: string | null;
  is_packed: boolean;
  is_worn: boolean;
  quantity: number;
  created_at: string;
  updated_at: string;
}

// Insert types for creating new records
export interface UserInsert {
  id?: string;
  email: string;
}

export interface GearListInsert {
  id?: string;
  user_id: string;
  name: string;
  description?: string | null;
  trip_type?: TripType;
  is_public?: boolean;
  is_template?: boolean;
}

export interface GearItemInsert {
  id?: string;
  list_id: string;  // Changed from gear_list_id to match database
  name: string;
  description?: string | null;
  category: GearCategory;
  weight_grams?: number;
  brand?: string | null;
  model?: string | null;
  price_cents?: number | null;
  purchase_url?: string | null;
  notes?: string | null;
  is_packed?: boolean;
  is_worn?: boolean;
  quantity?: number;
}

// Update types for modifying existing records
export interface UserUpdate {
  email?: string;
  updated_at?: string;
}

export interface GearListUpdate {
  name?: string;
  description?: string | null;
  trip_type?: TripType;
  is_public?: boolean;
  is_template?: boolean;
  updated_at?: string;
}

export interface GearItemUpdate {
  name?: string;
  description?: string | null;
  category?: GearCategory;
  weight_grams?: number;
  brand?: string | null;
  model?: string | null;
  price_cents?: number | null;
  purchase_url?: string | null;
  notes?: string | null;
  is_packed?: boolean;
  is_worn?: boolean;
  quantity?: number;
  updated_at?: string;
}

// Extended types with relationships
export interface GearListWithItems extends GearList {
  gear_items: GearItem[];
  user?: User;
}

export interface GearListWithStats extends GearList {
  stats: {
    totalItems: number;
    totalWeight: number;
    baseWeight: number;
    packedItems: number;
  };
}

// Import constants from shared types
export { 
  GEAR_CATEGORIES, 
  CATEGORY_DESCRIPTIONS, 
  TRIP_TYPES, 
  TRIP_TYPE_DESCRIPTIONS 
} from '@/shared/lib/types.js';

// API response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Search and filter types
export interface GearItemFilters {
  category?: GearCategory;
  isPacked?: boolean;
  isWorn?: boolean;
  minWeight?: number;
  maxWeight?: number;
  search?: string;
}

export interface GearListFilters {
  tripType?: TripType;
  isPublic?: boolean;
  isTemplate?: boolean;
  search?: string;
  sharedWithMe?: boolean;
}

// Realtime subscription types
export interface RealtimeGearItem {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new?: GearItem;
  old?: GearItem;
}

export interface RealtimeGearList {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new?: GearList;
  old?: GearList;
}