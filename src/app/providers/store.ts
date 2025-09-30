import { writable, derived, get } from 'svelte/store';
import { NeonGearListService } from '@/entities/gear-list/api.js';
import { GearItemService } from '@/entities/gear/api.js';
import { createAsyncStore, createApiResponseHandler } from '@/shared/lib/store-patterns.js';
import { calculateTotalWeight, calculateCategoryStats } from '@/shared/lib/utils.js';
import { 
  transformDatabaseArrayToUI, 
  transformUIToInsert, 
  transformUIToUpdate 
} from '@/shared/lib/transformers.js';
import type { 
  GearList, 
  DatabaseGearItem, 
  User,
  GearListInsert,
  GearItemInsert,
  GearItem,
  GearCategory
} from '@/shared/types';

// Create service instances
const gearListService = new NeonGearListService();
const gearItemService = new GearItemService();

// Simple user store - using hardcoded user for now since auth was causing timeouts
export const user = writable<User | null>({
  id: 'f830cb37-887d-40ab-a822-15a88c7ec92e',
  email: 'zetapow@gmail.com',
  name: 'Test User',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});

// Create async stores with utilities
const authStore = createAsyncStore();
const dataStore = createAsyncStore();

// Debug: log every change to isLoading

// Re-export stores for compatibility
export const isLoading = dataStore.isLoading;
export const isAuthenticating = authStore.isLoading;
export const authError = authStore.error;
export const dataError = dataStore.error;

// Data stores
export const userGearLists = writable<GearList[]>([]);
export const currentGearList = writable<GearList | null>(null);
export const currentGearItems = writable<GearItem[]>([]);

// Derived stores
export const isAuthenticated = derived(user, ($user) => $user !== null);

export const currentGearListWithItems = derived(
  [currentGearList, currentGearItems],
  ([$currentGearList, $currentGearItems]) => {
    if (!$currentGearList) return null;
    return {
      ...$currentGearList,
      gear_items: $currentGearItems.map(item => ({
        id: item.id,
        gear_list_id: $currentGearList.id,
        name: item.name,
        description: item.description,
        category: item.category,
        weight_grams: item.weight,
        quantity: item.quantity,
        is_packed: item.isPacked,
        is_worn: item.isWorn,
        url: item.url,
        notes: item.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
    };
  }
);

// Additional derived stores for component compatibility
export const gearItems = currentGearItems; // Alias for compatibility
export const totalWeight = derived(currentGearItems, ($items) => {
  return calculateTotalWeight($items);
});

export const categoryStats = derived(currentGearItems, ($items) => {
  return calculateCategoryStats($items);
});

// Simple gear store for compatibility
export const gearStore = {
  addItem: (item: Omit<GearItem, 'id'>) => {
    const currentList = get(currentGearList);
    if (currentList) {
      return addGearItem(currentList.id, item);
    }
    throw new Error('No current gear list selected');
  },
  updateItem: updateGearItem,
  deleteItem: deleteGearItem,
  removeItem: deleteGearItem // Alias for compatibility
};

// Initialize the store

// Track if gear lists are being loaded to prevent multiple calls
let isLoadingGearLists = false;
let hasLoadedGearLists = false;

// Gear list management
async function loadUserGearLists() {
  // Prevent multiple simultaneous calls or repeated loads
  if (isLoadingGearLists || hasLoadedGearLists) return;
  isLoadingGearLists = true;
  isLoading.set(true);
  try {
    // Use the user from the store instead of authentication
    const currentUser = get(user);
    if (!currentUser) return;
    const response = await gearListService.getUserLists(currentUser.id);
    if (response.success && response.data) {
      userGearLists.set(response.data);
      hasLoadedGearLists = true;
    } else {
      userGearLists.set([]); // Always set to empty array on error
      dataError.set(response.error || 'Failed to load gear lists');
    }
  } catch (error) {
    userGearLists.set([]); // Always set to empty array on error
    dataError.set(error instanceof Error ? error.message : 'Unknown error');
  } finally {
    isLoadingGearLists = false;
    isLoading.set(false);
  }
}

// Create a new gear list
async function createGearList(name: string, description?: string, tripType: 'day_hike' | 'overnight_backpacking' | 'multi_day_backpacking' | 'car_camping' | 'winter_camping' = 'day_hike') {
  isLoading.set(true);
  try {
    const currentUser = get(user);
    if (!currentUser) {
      dataError.set('No authenticated user found');
      return { data: null, error: 'No authenticated user found', success: false };
    }
    const listData: GearListInsert = {
      user_id: currentUser.id,
      name,
      description: description || null
    };
    const response = await gearListService.createList(listData);
    if (response.success && response.data) {
      await loadUserGearLists();
      return response;
    } else {
      dataError.set(response.error || 'Failed to create gear list');
      return response;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    dataError.set(errorMessage);
    return { data: null, error: errorMessage, success: false };
  } finally {
    isLoading.set(false);
  }
}

// Load a specific gear list
async function loadGearList(listId: string) {
  isLoading.set(true);
  try {
    const response = await gearListService.getListById(listId);
    if (response.success && response.data) {
      currentGearList.set(response.data);
      await loadGearItems(listId);
    } else {
      dataError.set(response.error || 'Failed to load gear list');
    }
  } catch (error) {
    console.error('Error loading gear list:', error);
    dataError.set(error instanceof Error ? error.message : 'Unknown error');
  } finally {
    isLoading.set(false);
  }
}

// Update a gear list
async function updateGearList(listId: string, updates: Partial<GearList>) {
  isLoading.set(true);
  try {
    const response = await gearListService.updateList(listId, updates);
    if (response.success && response.data) {
      currentGearList.set(response.data);
      await loadUserGearLists(); // Refresh the lists
    } else {
      dataError.set(response.error || 'Failed to update gear list');
    }
  } catch (error) {
    console.error('Error updating gear list:', error);
    dataError.set(error instanceof Error ? error.message : 'Unknown error');
  } finally {
    isLoading.set(false);
  }
}

// Delete a gear list
async function deleteGearList(listId: string) {
  isLoading.set(true);
  try {
    const response = await gearListService.deleteList(listId);
    if (response.success) {
      await loadUserGearLists(); // Refresh the lists
      currentGearList.set(null);
      currentGearItems.set([]);
    } else {
      dataError.set(response.error || 'Failed to delete gear list');
    }
  } catch (error) {
    console.error('Error deleting gear list:', error);
    dataError.set(error instanceof Error ? error.message : 'Unknown error');
  } finally {
    isLoading.set(false);
  }
}

// Gear item management
async function loadGearItems(listId: string) {
  try {
    console.log('Loading gear items for list:', listId);
    const response = await gearItemService.getItemsByListId(listId);
    if (response.success && response.data) {
      // Use transformer utility for conversion
      const uiItems = transformDatabaseArrayToUI(response.data);
      currentGearItems.set(uiItems);
      console.log('✅ Loaded', uiItems.length, 'gear items from database');
    } else {
      console.error('Failed to load gear items:', response.error);
      dataStore.setError(response.error || 'Failed to load gear items');
    }
  } catch (error) {
    console.error('Error loading gear items:', error);
    dataStore.setError(error instanceof Error ? error.message : 'Unknown error');
  }
}

// Add a gear item
async function addGearItem(listId: string, item: Omit<GearItem, 'id'>) {
  isLoading.set(true);
  try {
    console.log('Adding gear item to database:', item, 'for list:', listId);
    
    // Use transformer utility for conversion
    const itemData = transformUIToInsert(item, listId);

    const response = await gearItemService.createItem(itemData);
    if (response.success) {
      console.log('✅ Gear item created successfully in database');
      await loadGearItems(listId); // Refresh items from database
    } else {
      console.error('Failed to add gear item:', response.error);
      dataStore.setError(response.error || 'Failed to add gear item');
    }
  } catch (error) {
    console.error('Error adding gear item:', error);
    dataStore.setError(error instanceof Error ? error.message : 'Unknown error');
  } finally {
    isLoading.set(false);
  }
}

// Update a gear item
async function updateGearItem(itemId: string, updates: Partial<GearItem>) {
  isLoading.set(true);
  try {
    console.log('Updating gear item in database:', itemId, 'with:', updates);
    
    // Use transformer utility for conversion
    const dbUpdates = transformUIToUpdate(updates);

    const response = await gearItemService.updateItem(itemId, dbUpdates);
    if (response.success) {
      console.log('✅ Gear item updated successfully in database');
      const currentList = get(currentGearList);
      if (currentList) {
        await loadGearItems(currentList.id); // Refresh items from database
      }
    } else {
      console.error('Failed to update gear item:', response.error);
      dataStore.setError(response.error || 'Failed to update gear item');
    }
  } catch (error) {
    console.error('Error updating gear item:', error);
    dataStore.setError(error instanceof Error ? error.message : 'Unknown error');
  } finally {
    isLoading.set(false);
  }
}

// Delete a gear item
async function deleteGearItem(itemId: string) {
  isLoading.set(true);
  try {
    console.log('Deleting gear item from database:', itemId);
    
    const response = await gearItemService.deleteItem(itemId);
    if (response.success) {
      console.log('✅ Gear item deleted successfully from database');
      const currentList = get(currentGearList);
      if (currentList) {
        await loadGearItems(currentList.id); // Refresh items from database
      }
    } else {
      console.error('Failed to delete gear item:', response.error);
      dataError.set(response.error || 'Failed to delete gear item');
    }
  } catch (error) {
    console.error('Error deleting gear item:', error);
    dataError.set(error instanceof Error ? error.message : 'Unknown error');
  } finally {
    isLoading.set(false);
  }
}

// Utility functions
function clearErrors() {
  authStore.clearError();
  dataStore.clearError();
}

// Export all functions and stores
export {
  // Core functions
  loadUserGearLists,
  createGearList,
  loadGearList,
  updateGearList,
  deleteGearList,
  loadGearItems,
  addGearItem,
  updateGearItem,
  deleteGearItem,
  clearErrors
};