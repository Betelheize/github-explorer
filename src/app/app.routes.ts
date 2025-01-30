import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { DetailComponent } from './features/detail/detail.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'detail/:owner/:repo',
    component: DetailComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
