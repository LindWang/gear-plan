import { writable } from 'svelte/store';

export interface ConfirmDialog {
  id: string;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export const confirmDialogs = writable<ConfirmDialog[]>([]);

export function showConfirmDialog(dialog: Omit<ConfirmDialog, 'id'>) {
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  const newDialog: ConfirmDialog = {
    id,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'info',
    ...dialog
  };

  confirmDialogs.update(dialogs => [...dialogs, newDialog]);
  return id;
}

export function hideConfirmDialog(id: string) {
  confirmDialogs.update(dialogs => dialogs.filter(dialog => dialog.id !== id));
}