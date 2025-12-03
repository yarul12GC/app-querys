import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/layouts/principal/principal'),
        children: [
            {
                path: 'Home',
                loadComponent: () => import('./components/pages/home/home')
            }, {
                path: 'QueryUsers',
                loadComponent: () => import('./components/pages/query-users/query-users')
            },
            {
                path: 'QueryEschema',
                loadComponent: () => import('./components/pages/query-eschema/query-eschema')
            },
            {
                path: 'QueryTables',
                loadComponent: () => import('./components/pages/query-tables/query-tables')
            },
            {
                path: '',
                redirectTo: 'Home',
                pathMatch: 'full'
            }
        ]
    }
];
