import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
  cursos: any[] = [];
  private get headers() {
    return new HttpHeaders().set('Authorization', `Bearer ${typeof localStorage !== 'undefined' ? localStorage.getItem('token') : ''}`);
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.http.get<any[]>('/api/cursos', { headers: this.headers })
        .subscribe(data => this.cursos = data);
    }
  }
}
