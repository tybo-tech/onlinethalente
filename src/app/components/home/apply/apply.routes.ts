import { Routes } from '@angular/router';

export const APPLY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./apply.component').then(m => m.ApplyComponent)
  }
];
