import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';

export const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'home',
                title: 'Home',
                loadComponent: async () => (await import('./home/home.page')).HomePage,
            },
            {
                path: 'signature',
                title: '',
                loadComponent: async () =>
                    (await import('./signature/signature.page')).SignaturePage,
            },
            {
                path: '',
                redirectTo: '/tabs/home',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
    },
];
