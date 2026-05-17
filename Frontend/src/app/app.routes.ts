import { LayoutWrapper } from './core/layout-wrapper/layout-wrapper';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./security/security-module').then(m => m.SecurityModule)
    },
    {
        path: '',
        component: LayoutWrapper,
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./home/home-module').then((m) => m.HomeModule)
            },
            {
                path: 'home',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
        ]
    }
];
