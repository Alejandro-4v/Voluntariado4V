import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { STUDENT_ROUTES } from './features/student/student.routes';

import { UserLayoutComponent } from './layout/user-layout/user-layout.component';


export const routes: Routes = [
  {
    path: 'management',
    
    loadChildren: () => import('./features/management/management.routes').then(m => m.MANAGEMENT_ROUTES)
  },
  {
    path: 'student',
    component: UserLayoutComponent,
    
    children: STUDENT_ROUTES
  },
  {
    path: 'auth',
    children: AUTH_ROUTES
  },
  { path: '', loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent) },
  { path: '**', loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
