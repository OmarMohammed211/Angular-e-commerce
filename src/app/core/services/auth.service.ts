import { Injectable, signal, inject, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User, AuthResponse } from '../models/user.model';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  private apiUrl = `${environment.apiUrl}/auth`;

  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);

  // Exposed Signals
  user = this._user.asReadonly();
  isAuthenticated = computed(() => !!this._user());
  isAdmin = computed(() => this._user()?.role === 'admin');

  constructor() {
    this.loadSession();
  }

  private loadSession() {
    if (!this.isBrowser) return;

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this._token.set(token);
      const normalizedUser = this.normalizeUser(JSON.parse(user));
      this._user.set(normalizedUser);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
    }
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, { email, password })
      .pipe(
        tap((res: AuthResponse) => this.setSession(res))
      );
  }

  register(name: string, email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, { name, email, password })
      .pipe(
        tap((res: AuthResponse) => this.setSession(res))
      );
  }

  private setSession(res: AuthResponse) {
    this._token.set(res.access_token);

    const user = this.normalizeUser(res.user);
    this._user.set(user);
    
    if (this.isBrowser) {
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  logout() {
    this._token.set(null);
    this._user.set(null);
    
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.router.navigate(['/auth/login']);
  }

  getToken() {
    return this._token();
  }

  private normalizeUser(user: User & { _id?: string }): User {
    return {
      id: user.id || user._id || '',
      name: user.name,
      email: user.email,
      role: user.role || 'user'
    };
  }
}
