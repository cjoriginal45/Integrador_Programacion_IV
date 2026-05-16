import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  ui = inject(UiService);
  userName = 'Usuario Estudiante';

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        const data = JSON.parse(user);
        this.userName = `${data.nombre} ${data.apellido}`;
      }
    }
  }
}
