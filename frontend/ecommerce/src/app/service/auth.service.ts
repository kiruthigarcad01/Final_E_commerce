import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private role: string | null = null;

  constructor() {}

  loginAs(role: 'admin' | 'customer'): void {
    this.role = role;
  }

  getRole(): string | null {
    return this.role;
  }

  logout(): void {
    this.role = null;
  }
}
