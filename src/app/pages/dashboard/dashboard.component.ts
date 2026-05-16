import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = { estudiantes: 0, cursos: 0, inscripciones: 0 };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    let token = null;
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem('token');
    }
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    if (typeof window === 'undefined') return;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any>('/api/stats', { headers }).subscribe({
      next: (data) => this.stats = data,
      error: () => this.router.navigate(['/login'])
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
