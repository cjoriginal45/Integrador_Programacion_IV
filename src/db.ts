import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'database.sqlite');

export let db: Database;

export async function initDb() {
  db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  try {
    // 1. Estados de Cursos
    await db.exec(`CREATE TABLE IF NOT EXISTS cursos_estados (
      id_curso_estado INTEGER PRIMARY KEY AUTOINCREMENT,
      descripcion TEXT NOT NULL,
      es_activo INTEGER DEFAULT 1
    )`);

    // 2. Estados de Inscripciones
    await db.exec(`CREATE TABLE IF NOT EXISTS inscripciones_estados (
      id_inscripcion_estado INTEGER PRIMARY KEY AUTOINCREMENT,
      descripcion TEXT NOT NULL,
      es_activo INTEGER DEFAULT 1
    )`);

    // 3. Usuarios (Admin)
    await db.exec(`CREATE TABLE IF NOT EXISTS usuarios (
      id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
      apellido TEXT NOT NULL,
      nombre TEXT NOT NULL,
      nombre_usuario TEXT UNIQUE NOT NULL,
      contrasenia TEXT NOT NULL,
      activo INTEGER DEFAULT 1
    )`);

    // 4. Estudiantes
    await db.exec(`CREATE TABLE IF NOT EXISTS estudiantes (
      id_estudiante INTEGER PRIMARY KEY AUTOINCREMENT,
      documento TEXT UNIQUE NOT NULL,
      apellido TEXT NOT NULL,
      nombres TEXT NOT NULL,
      email TEXT,
      fecha_nacimiento TEXT,
      activo INTEGER DEFAULT 1,
      id_usuario_modificacion INTEGER,
      fecha_hora_modificacion TEXT,
      FOREIGN KEY (id_usuario_modificacion) REFERENCES usuarios(id_usuario)
    )`);

    // 5. Cursos
    await db.exec(`CREATE TABLE IF NOT EXISTS cursos (
      id_curso INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      fecha_inicio TEXT,
      cantidad_horas INTEGER,
      inscriptos_max INTEGER,
      id_curso_estado INTEGER,
      id_usuario_modificacion INTEGER,
      fecha_hora_modificacion TEXT,
      FOREIGN KEY (id_curso_estado) REFERENCES cursos_estados(id_curso_estado),
      FOREIGN KEY (id_usuario_modificacion) REFERENCES usuarios(id_usuario)
    )`);

    // 6. Inscripciones
    await db.exec(`CREATE TABLE IF NOT EXISTS inscripciones (
      id_inscripcion INTEGER PRIMARY KEY AUTOINCREMENT,
      id_curso INTEGER NOT NULL,
      id_estudiante INTEGER NOT NULL,
      fecha_hora_inscripcion TEXT DEFAULT CURRENT_TIMESTAMP,
      id_inscripcion_estado INTEGER,
      id_usuario_modificacion INTEGER,
      fecha_hora_modificacion TEXT,
      FOREIGN KEY (id_curso) REFERENCES cursos(id_curso),
      FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante),
      FOREIGN KEY (id_inscripcion_estado) REFERENCES inscripciones_estados(id_inscripcion_estado),
      FOREIGN KEY (id_usuario_modificacion) REFERENCES usuarios(id_usuario),
      UNIQUE(id_curso, id_estudiante)
    )`);

    // Seed Initial Data
    const usersCount = await db.get("SELECT COUNT(*) as count FROM usuarios");
    if (usersCount.count === 0) {
      const pass = await bcrypt.hash('admin123', 10);
      await db.run("INSERT INTO usuarios (apellido, nombre, nombre_usuario, contrasenia) VALUES (?, ?, ?, ?)", ['Ribarola', 'Joaquin', 'admin', pass]);
      
      await db.exec("INSERT INTO cursos_estados (descripcion) VALUES ('Activo'), ('Finalizado'), ('Cancelado')");
      await db.exec("INSERT INTO inscripciones_estados (descripcion) VALUES ('Regular'), ('Baja'), ('Pendiente')");
      
      await db.exec("INSERT INTO estudiantes (documento, apellido, nombres, email, activo) VALUES ('45123456', 'García', 'Lucía', 'lucia.g@universidad.edu', 1)");
      await db.exec("INSERT INTO estudiantes (documento, apellido, nombres, email, activo) VALUES ('42987654', 'Fernández', 'Mateo', 'mateo.f@universidad.edu', 1)");
      
      await db.exec("INSERT INTO cursos (nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado) VALUES ('Algoritmos I', 'Introducción a la programación y lógica de algoritmos.', '2026-03-10', 60, 30, 1)");
      await db.exec("INSERT INTO cursos (nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado) VALUES ('Cálculo I', 'Análisis matemático funcional y diferencial.', '2026-03-15', 80, 40, 1)");

      console.log("Database initialized with admin user: admin / admin123 and samples.");
    }
  } catch(e) {
    console.error(e);
    throw e;
  }
}
