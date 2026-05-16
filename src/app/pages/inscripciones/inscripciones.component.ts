import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-inscripciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.css']
})
export class InscripcionesComponent implements OnInit {
  estudiantes: any[] = [];
  cursos: any[] = [];
  inscripciones: any[] = [];
  
  selectedEstudiante = '';
  selectedCurso = '';
  error = '';

  private get headers() {
    return new HttpHeaders().set('Authorization', `Bearer ${typeof localStorage !== 'undefined' ? localStorage.getItem('token') : ''}`);
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    if (typeof window === 'undefined') return;
    this.http.get<any[]>('/api/estudiantes', { headers: this.headers }).subscribe(data => this.estudiantes = data);
    this.http.get<any[]>('/api/cursos', { headers: this.headers }).subscribe(data => this.cursos = data);
    this.http.get<any[]>('/api/inscripciones', { headers: this.headers }).subscribe(data => this.inscripciones = data);
  }

  registrarInscripcion() {
    this.error = '';
    const body = { id_curso: this.selectedCurso, id_estudiante: this.selectedEstudiante };
    
    this.http.post('/api/inscripciones', body, { headers: this.headers }).subscribe({
      next: () => {
        this.loadData();
        this.selectedEstudiante = '';
        this.selectedCurso = '';
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al registrar inscripción';
      }
    });
  }
}
