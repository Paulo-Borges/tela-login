import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';

export const routes: Routes = [
    {
        path: '',
        component: Auth
    },
    {
        path: 'home',
        loadComponent() {
            return import ('./pages/home/home').then(m => m.Home)
        },
    }
];
