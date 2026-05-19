import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
  cursos: any[] = [];
  searchTerm = '';
  showForm = false;
  editingId: number | null = null;

  model = {
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    cantidad_horas: 0,
    inscriptos_max: 0,
    id_curso_estado: 1
  };

  private get headers() {
    return new HttpHeaders().set('Authorization', `Bearer ${typeof localStorage !== 'undefined' ? localStorage.getItem('token') : ''}`);
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCursos();
  }

  loadCursos() {
    if (typeof window === 'undefined') return;
    this.http.get<any[]>(`/api/cursos?nombre=${this.searchTerm}`, { headers: this.headers })
      .subscribe(data => this.cursos = data);
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.cancelEdit();
  }

  saveCurso() {
    if (this.editingId) {
      this.http.put(`/api/cursos/${this.editingId}`, this.model, { headers: this.headers })
        .subscribe(() => {
          this.loadCursos();
          this.cancelEdit();
        });
    } else {
      this.http.post('/api/cursos', this.model, { headers: this.headers })
        .subscribe(() => {
          this.loadCursos();
          this.cancelEdit();
        });
    }
  }

  editCurso(c: any) {
    this.editingId = c.id_curso;
    this.model = { ...c };
    this.showForm = true;
  }

  deleteCurso(id: number) {
    if (confirm('¿Está seguro de eliminar este curso?')) {
      this.http.delete(`/api/cursos/${id}`, { headers: this.headers })
        .subscribe(() => this.loadCursos());
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.showForm = false;
    this.model = {
      nombre: '',
      descripcion: '',
      fecha_inicio: '',
      cantidad_horas: 0,
      inscriptos_max: 0,
      id_curso_estado: 1
    };
  }
}
