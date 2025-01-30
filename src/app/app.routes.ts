import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'detail/:owner/:repo',
    loadComponent: () => import('./features/detail/detail.component').then(m => m.DetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
