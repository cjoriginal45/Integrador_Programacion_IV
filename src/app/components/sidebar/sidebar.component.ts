import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  ui = inject(UiService);

  menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/estudiantes', label: 'Estudiantes' },
    { path: '/cursos', label: 'Cursos' },
    { path: '/inscripciones', label: 'Inscripciones' },
  ];

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}
