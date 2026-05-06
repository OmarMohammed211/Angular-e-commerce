export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
}

export interface AuthResponse {
  user: User;
  access_token: string;
  message?: string;
}
