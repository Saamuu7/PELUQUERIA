import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './login.html',
})
export class Login {
    password = '';
    error = '';
    isLoading = false;

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit() {
        this.isLoading = true;
        this.error = '';

        // Simulate network delay for "professional" feel
        setTimeout(() => {
            const success = this.authService.login(this.password);
            if (success) {
                this.router.navigate(['/admin']);
            } else {
                this.error = 'Contraseña incorrecta';
                this.isLoading = false;
                this.password = ''; // Optional: clear password for security/convenience
            }
        }, 500);
    }
}
