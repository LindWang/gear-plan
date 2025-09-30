import { writable } from 'svelte/store';
import type { User } from '@/entities/user/types';

export const currentUser = writable<User | null>(null);
export const token = writable<string | null>(null);

export function setAuth(user: User, jwt: string) {
  currentUser.set(user);
  token.set(jwt);
  localStorage.setItem('token', jwt);
}

export function logout() {
  currentUser.set(null);
  token.set(null);
  localStorage.removeItem('token');
}

export function initAuth() {
  const jwt = localStorage.getItem('token');
  if (jwt) {
    token.set(jwt);
    // Optionally: fetch user info from backend
  }
}
