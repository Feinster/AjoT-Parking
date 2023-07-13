import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loggedIn = false;
  private username!: string;
  private isAdmin: boolean = false;

  login(username: string, isAdmin: boolean): void {
    this.loggedIn = true;
    this.username = username;
    this.isAdmin = isAdmin;
  }

  logout(): void {
    this.loggedIn = false;
    this.username = null!;
    this.isAdmin = false;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  isUserAdmin(): boolean {
    return this.isAdmin;
  }

  getUsername(): string {
    return this.username;
  }
}
