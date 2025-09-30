// Reusable store patterns and utilities
import { writable, type Writable } from 'svelte/store';

// Generic async action wrapper
export interface AsyncActionOptions<T> {
  onStart?: () => void;
  onSuccess?: (result: T) => void;
  onError?: (error: string) => void;
  onFinally?: () => void;
}

/**
 * Creates a reusable async action wrapper with loading states and error handling
 */
export function createAsyncAction<T, Args extends any[]>(
  loadingStore: Writable<boolean>,
  errorStore: Writable<string>,
  action: (...args: Args) => Promise<T>
) {
  return async (options: AsyncActionOptions<T> = {}) => {
    return async (...args: Args): Promise<T> => {
      loadingStore.set(true);
      errorStore.set('');
      options.onStart?.();

      try {
        const result = await action(...args);
        options.onSuccess?.(result);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errorStore.set(errorMessage);
        options.onError?.(errorMessage);
        throw error;
      } finally {
        loadingStore.set(false);
        options.onFinally?.();
      }
    };
  };
}

/**
 * Creates loading and error stores with common utility functions
 */
export function createAsyncStore() {
  const isLoading = writable(false);
  const error = writable('');

  return {
    isLoading,
    error,
    clearError: () => error.set(''),
    setError: (message: string) => error.set(message),
    setLoading: (loading: boolean) => isLoading.set(loading)
  };
}

/**
 * Data transformation utilities for API responses
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export function createApiResponseHandler<T>() {
  return {
    success: (data: T): ApiResponse<T> => ({
      data,
      error: null,
      success: true
    }),
    
    error: (message: string): ApiResponse<T> => ({
      data: null,
      error: message,
      success: false
    }),
    
    fromTryCatch: async (operation: () => Promise<T>): Promise<ApiResponse<T>> => {
      try {
        const data = await operation();
        return { data, error: null, success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { data: null, error: message, success: false };
      }
    }
  };
}

/**
 * Optimistic update pattern for better UX
 */
export function createOptimisticUpdate<T>(
  store: Writable<T[]>,
  getId: (item: T) => string
) {
  return {
    add: async (item: T, apiCall: () => Promise<void>) => {
      store.update(items => [...items, item]);
      try {
        await apiCall();
      } catch (error) {
        store.update(items => items.filter(i => getId(i) !== getId(item)));
        throw error;
      }
    },
    
    update: async (id: string, updates: Partial<T>, apiCall: () => Promise<void>) => {
      let originalItem: T | undefined;
      store.update(items => {
        const index = items.findIndex(item => getId(item) === id);
        if (index >= 0) {
          originalItem = items[index];
          items[index] = { ...items[index], ...updates };
        }
        return items;
      });
      
      try {
        await apiCall();
      } catch (error) {
        if (originalItem) {
          store.update(items => {
            const index = items.findIndex(item => getId(item) === id);
            if (index >= 0) {
              items[index] = originalItem!;
            }
            return items;
          });
        }
        throw error;
      }
    },
    
    remove: async (id: string, apiCall: () => Promise<void>) => {
      let originalItems: T[];
      store.update(items => {
        originalItems = [...items];
        return items.filter(item => getId(item) !== id);
      });
      
      try {
        await apiCall();
      } catch (error) {
        store.set(originalItems!);
        throw error;
      }
    }
  };
}