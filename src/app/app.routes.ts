import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'estudiantes', 
    loadComponent: () => import('./pages/estudiantes/estudiantes.component').then(m => m.EstudiantesComponent) 
  },
  { 
    path: 'cursos', 
    loadComponent: () => import('./pages/cursos/cursos.component').then(m => m.CursosComponent) 
  },
  { 
    path: 'inscripciones', 
    loadComponent: () => import('./pages/inscripciones/inscripciones.component').then(m => m.InscripcionesComponent) 
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
