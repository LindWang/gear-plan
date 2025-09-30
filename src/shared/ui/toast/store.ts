import { writable } from 'svelte/store';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export const toasts = writable<Toast[]>([]);

export function addToast(toast: Omit<Toast, 'id'>) {
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  const newToast: Toast = {
    id,
    duration: 4000,
    ...toast
  };

  toasts.update(currentToasts => [...currentToasts, newToast]);

  // Auto remove after duration
  if (newToast.duration && newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }

  return id;
}

export function removeToast(id: string) {
  toasts.update(currentToasts => currentToasts.filter(toast => toast.id !== id));
}

export function clearToasts() {
  toasts.set([]);
}