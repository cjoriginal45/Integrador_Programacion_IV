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

  toggleForm() {
    this.showForm = !this.showForm;
  }

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

  editCurso(c: any) {
    // Cuando agreguemos el formulario, este método cargará el curso para editarlo.
    // Por ahora sólo abre el modo edición (aún sin form visible).
    alert('La edición se conectará cuando agreguemos el formulario.');
  }

  deleteCurso(id: number) {
    if (confirm('¿Está seguro de eliminar este curso?')) {
      this.http.delete(`/api/cursos/${id}`, { headers: this.headers })
        .subscribe(() => this.loadCursos());
    }
  }
}
