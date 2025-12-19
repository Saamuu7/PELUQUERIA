import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isLoggedInSubject = new BehaviorSubject<boolean>(false);
    isLoggedIn$ = this.isLoggedInSubject.asObservable();

    constructor(
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('auth_token');
            this.isLoggedInSubject.next(!!token);
        }
    }

    login(password: string): boolean {
        // Hardcoded simple password for demo purposes aka "profesional" feel without backend
        // In a real app this would call an API
        if (password === 'Eryck1234') {
            if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem('auth_token', 'demo-token-secure-hash');
            }
            this.isLoggedInSubject.next(true);
            return true;
        }
        return false;
    }

    logout() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('auth_token');
        }
        this.isLoggedInSubject.next(false);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return this.isLoggedInSubject.value;
    }
}
