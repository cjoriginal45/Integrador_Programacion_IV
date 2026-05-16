import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent implements OnInit {
  estudiantes: any[] = [];
  searchTerm = '';
  showForm = false;
  editingId: number | null = null;
  
  model = {
    documento: '',
    apellido: '',
    nombres: '',
    email: ''
  };

  private get headers() {
    return new HttpHeaders().set('Authorization', `Bearer ${typeof localStorage !== 'undefined' ? localStorage.getItem('token') : ''}`);
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadEstudiantes();
  }

  loadEstudiantes() {
    if (typeof window === 'undefined') return;
    this.http.get<any[]>(`/api/estudiantes?q=${this.searchTerm}`, { headers: this.headers })
      .subscribe(data => this.estudiantes = data);
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.cancelEdit();
  }

  saveEstudiante() {
    if (this.editingId) {
      this.http.put(`/api/estudiantes/${this.editingId}`, this.model, { headers: this.headers })
        .subscribe(() => {
          this.loadEstudiantes();
          this.cancelEdit();
        });
    } else {
      this.http.post('/api/estudiantes', this.model, { headers: this.headers })
        .subscribe(() => {
          this.loadEstudiantes();
          this.cancelEdit();
        });
    }
  }

  editEstudiante(e: any) {
    this.editingId = e.id_estudiante;
    this.model = { ...e };
    this.showForm = true;
  }

  deleteEstudiante(id: number) {
    if (confirm('¿Está seguro de eliminar este estudiante?')) {
      this.http.delete(`/api/estudiantes/${id}`, { headers: this.headers })
        .subscribe(() => this.loadEstudiantes());
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.showForm = false;
    this.model = { documento: '', apellido: '', nombres: '', email: '' };
  }
}
