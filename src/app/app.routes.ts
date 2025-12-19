import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: Home },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    },
    {
        path: 'reservar',
        loadComponent: () => import('./pages/booking/booking').then(m => m.Booking)
    },
    {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin').then(m => m.Admin),
        canActivate: [AuthGuard]
    },
    { path: '**', redirectTo: '' }
];
