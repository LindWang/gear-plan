// Common UI feedback patterns and utilities
import { addToast, showConfirmDialog } from '@/shared/ui';
import type { Toast } from '@/shared/ui/toast/store.js';

/**
 * Standard error message formatter
 */
export function formatErrorMessage(error: unknown, fallback = 'Unknown error'): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return fallback;
}

/**
 * Common toast notification helpers
 */
export const toastHelpers = {
  /**
   * Show success toast for item operations
   */
  itemSuccess: (action: string, itemName: string) => {
    addToast({
      type: 'success',
      message: `"${itemName}" has been ${action} successfully!`
    });
  },

  /**
   * Show error toast for item operations
   */
  itemError: (action: string, error: unknown) => {
    addToast({
      type: 'error',
      message: `Failed to ${action} item: ${formatErrorMessage(error)}`
    });
  },

  /**
   * Show success toast for list operations
   */
  listSuccess: (action: string, listName?: string) => {
    const name = listName ? `"${listName}"` : 'gear list';
    addToast({
      type: 'success',
      message: `${name} has been ${action} successfully!`
    });
  },

  /**
   * Show error toast for list operations
   */
  listError: (action: string, error: unknown) => {
    addToast({
      type: 'error',
      message: `Failed to ${action} gear list: ${formatErrorMessage(error)}`
    });
  },

  /**
   * Show warning toast for validation issues
   */
  validationWarning: (message: string) => {
    addToast({
      type: 'warning',
      message
    });
  },

  /**
   * Generic success toast
   */
  success: (message: string) => {
    addToast({
      type: 'success',
      message
    });
  },

  /**
   * Generic error toast
   */
  error: (message: string) => {
    addToast({
      type: 'error',
      message
    });
  }
};

/**
 * Common confirmation dialog patterns
 */
export const confirmHelpers = {
  /**
   * Confirm item deletion
   */
  deleteItem: (itemName: string, onConfirm: () => Promise<void>) => {
    showConfirmDialog({
      title: 'Delete Gear Item',
      message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm
    });
  },

  /**
   * Confirm list deletion
   */
  deleteList: (listName: string, onConfirm: () => Promise<void>) => {
    showConfirmDialog({
      title: 'Delete Gear List',
      message: `Are you sure you want to delete "${listName}"? This action cannot be undone and will delete all gear items in this list.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm
    });
  },

  /**
   * Generic confirmation dialog
   */
  confirm: (
    title: string,
    message: string,
    onConfirm: () => Promise<void>,
    options?: {
      confirmText?: string;
      cancelText?: string;
      type?: 'danger' | 'warning' | 'info';
    }
  ) => {
    showConfirmDialog({
      title,
      message,
      confirmText: options?.confirmText || 'Confirm',
      cancelText: options?.cancelText || 'Cancel',
      type: options?.type || 'info',
      onConfirm
    });
  }
};

/**
 * Async operation wrapper with error handling and feedback
 */
export async function handleAsyncOperation<T>(
  operation: () => Promise<T>,
  options: {
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (result: T) => void;
    onError?: (error: unknown) => void;
  } = {}
): Promise<T | undefined> {
  try {
    const result = await operation();
    
    if (options.successMessage) {
      toastHelpers.success(options.successMessage);
    }
    
    options.onSuccess?.(result);
    return result;
  } catch (error) {
    console.error('Async operation failed:', error);
    
    if (options.errorMessage) {
      toastHelpers.error(options.errorMessage);
    } else {
      toastHelpers.error(formatErrorMessage(error));
    }
    
    options.onError?.(error);
    return undefined;
  }
}

/**
 * Form submission wrapper with loading state and feedback
 */
export function createFormHandler<T extends Record<string, any>>(
  onSubmit: (data: T) => Promise<void>,
  options: {
    successMessage?: string;
    errorPrefix?: string;
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
    isSubmittingStore?: { set: (v: boolean) => void; subscribe: (fn: (v: boolean) => void) => any; }
  } = {}
) {
  // Use a writable store for isSubmitting if provided, otherwise fallback to local variable
  let localIsSubmitting = false;
  const setSubmitting = (val: boolean) => {
    if (options.isSubmittingStore) {
      options.isSubmittingStore.set(val);
    } else {
      localIsSubmitting = val;
    }
  };
  const getSubmitting = () => {
    if (options.isSubmittingStore) {
      let value: boolean;
      options.isSubmittingStore.subscribe(v => value = v)();
      return value!;
    } else {
      return localIsSubmitting;
    }
  };

  const handleSubmit = async (data: T) => {
    if (getSubmitting()) return;
    setSubmitting(true);
    try {
      await onSubmit(data);
      if (options.successMessage) {
        toastHelpers.success(options.successMessage);
      }
      options.onSuccess?.();
    } catch (error) {
      console.error('Form submission failed:', error);
      const errorMessage = options.errorPrefix 
        ? `${options.errorPrefix}: ${formatErrorMessage(error)}`
        : formatErrorMessage(error);
      toastHelpers.error(errorMessage);
      options.onError?.(error);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    handleSubmit,
    get isSubmitting() { return getSubmitting(); }
  };
}