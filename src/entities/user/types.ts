// src/entities/user/types.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthError {
  error: string;
}
