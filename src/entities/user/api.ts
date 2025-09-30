// src/entities/user/api.ts
import type { User, AuthResponse, AuthError } from './types';

export async function login(email: string, password: string): Promise<AuthResponse | AuthError> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return await res.json();
}

export async function signup(email: string, password: string): Promise<{ success?: boolean; error?: string }> {
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return await res.json();
}
