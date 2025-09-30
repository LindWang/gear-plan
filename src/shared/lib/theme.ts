import { writable } from 'svelte/store';

// Theme store: 'light' or 'dark'
export const theme = writable('light');

// Toggle theme and update <html> data-theme attribute
export function toggleTheme() {
  theme.update(current => {
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    return next;
  });
}

// Initialize theme from localStorage or system preference
export function initTheme() {
  let saved = localStorage.getItem('theme');
  if (!saved) {
    saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  theme.set(saved);
  document.documentElement.setAttribute('data-theme', saved);
}
