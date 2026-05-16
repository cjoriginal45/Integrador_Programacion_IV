import { fileURLToPath } from 'node:url';
import path, { dirname, resolve, join } from 'node:path';

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db, initDb } from './db';

const app = express();
const PORT = process.env['NODE_ENV'] === 'production' ? 3000 : 3001;
const SECRET_KEY = 'uner_secret_key_2026';

app.use(cors());
app.use(express.json());

initDb().catch(console.error);

// Middleware de Autenticación
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Sin autorización' });
    return;
  }
  
  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ message: 'Token inválido' });
      return;
    }
    req.user = decoded;
    next();
  });
};

// --- API ROUTES ---

// 1. Auth
app.post('/api/login', async (req: any, res: any) => {
  const { username, password } = req.body;
  try {
    const user = await db.get("SELECT * FROM usuarios WHERE nombre_usuario = ? AND activo = 1", [username]) as any;
    if (!user) {
      res.status(400).json({ message: 'Usuario no encontrado' });
      return;
    }
    const valid = await bcrypt.compare(password, user.contrasenia);
    if (!valid) {
      res.status(400).json({ message: 'Contraseña incorrecta' });
      return;
    }
    
    const token = jwt.sign({ id: user.id_usuario, username: user.nombre_usuario }, SECRET_KEY, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id_usuario, nombre: user.nombre, apellido: user.apellido } });
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. Estudiantes CRUD
app.get('/api/estudiantes', authenticate, async (req: any, res: any) => {
  const { q, page = 1 } = req.query;
  const limit = 10;
  const offset = (Number(page) - 1) * limit;
  let sql = "SELECT * FROM estudiantes WHERE activo = 1";
  let params: any[] = [];
  
  if (q) {
    sql += " AND (apellido LIKE ? OR nombres LIKE ? OR documento LIKE ?)";
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  
  sql += ` LIMIT ${limit} OFFSET ${offset}`;
  
  try {
    const rows = await db.all(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post('/api/estudiantes', authenticate, async (req: any, res: any) => {
  const { documento, apellido, nombres, email, fecha_nacimiento } = req.body;
  const userId = req.user.id;
  const now = new Date().toISOString();
  
  try {
    const info = await db.run(`INSERT INTO estudiantes (documento, apellido, nombres, email, fecha_nacimiento, id_usuario_modificacion, fecha_hora_modificacion) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`, [documento, apellido, nombres, email, fecha_nacimiento, userId, now]);
    res.status(201).json({ id: info.lastID });
  } catch(err) {
    res.status(400).json(err);
  }
});

app.put('/api/estudiantes/:id', authenticate, async (req: any, res: any) => {
  const { documento, apellido, nombres, email, fecha_nacimiento } = req.body;
  const userId = req.user.id;
  const now = new Date().toISOString();
  
  try {
    await db.run(`UPDATE estudiantes SET documento=?, apellido=?, nombres=?, email=?, fecha_nacimiento=?, id_usuario_modificacion=?, fecha_hora_modificacion=? 
          WHERE id_estudiante=?`, [documento, apellido, nombres, email, fecha_nacimiento, userId, now, req.params.id]);
    res.json({ message: 'Actualizado' });
  } catch(err) {
    res.status(400).json(err);
  }
});

app.delete('/api/estudiantes/:id', authenticate, async (req: any, res: any) => {
  const userId = req.user.id;
  const now = new Date().toISOString();
  // Soft Delete
  try {
    await db.run("UPDATE estudiantes SET activo = 0, id_usuario_modificacion = ?, fecha_hora_modificacion = ? WHERE id_estudiante = ?", [userId, now, req.params.id]);
    res.json({ message: 'Eliminado (Soft Delete)' });
  } catch(err) {
    res.status(400).json(err);
  }
});

// 3. Cursos CRUD
app.get('/api/cursos', authenticate, async (req: any, res: any) => {
  try {
    const rows = await db.all("SELECT * FROM cursos WHERE id_curso_estado != 3");
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. Inscripciones CRUD
app.get('/api/inscripciones', authenticate, async (req: any, res: any) => {
  const sql = `
    SELECT i.*, e.apellido, e.nombres, c.nombre as curso_nombre 
    FROM inscripciones i
    JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
    JOIN cursos c ON i.id_curso = c.id_curso
    WHERE i.id_inscripcion_estado != 2
  `;
  try {
    const rows = await db.all(sql);
    res.json(rows);
  } catch(err) {
    res.status(500).json(err);
  }
});

app.post('/api/inscripciones', authenticate, async (req: any, res: any) => {
  const { id_curso, id_estudiante } = req.body;
  const userId = req.user.id;
  
  try {
    const row = await db.get("SELECT inscriptos_max, (SELECT COUNT(*) FROM inscripciones WHERE id_curso = ?) as actuales FROM cursos WHERE id_curso = ?", [id_curso, id_curso]) as any;
    if (row.actuales >= row.inscriptos_max) {
      res.status(400).json({ message: 'Cupos agotados' });
      return;
    }
    
    const info = await db.run("INSERT INTO inscripciones (id_curso, id_estudiante, id_inscripcion_estado, id_usuario_modificacion) VALUES (?, ?, 1, ?)", [id_curso, id_estudiante, userId]);
    res.status(201).json({ id: info.lastID });
  } catch (err) {
    res.status(400).json({ message: 'Inscripción duplicada o error' });
  }
});

// 5. Dashboard Stats
app.get('/api/stats', authenticate, async (req: any, res: any) => {
  try {
    const estudiantesRow = await db.get("SELECT COUNT(*) as count FROM estudiantes WHERE activo = 1") as any;
    const cursosRow = await db.get("SELECT COUNT(*) as count FROM cursos WHERE id_curso_estado = 1") as any;
    const inscripcionesRow = await db.get("SELECT COUNT(*) as count FROM inscripciones WHERE id_inscripcion_estado = 1") as any;
    
    res.json({
      estudiantes: estudiantesRow.count,
      cursos: cursosRow.count,
      inscripciones: inscripcionesRow.count,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// The Angular SPA build creates a bundle that we serve here in production
if (process.env['NODE_ENV'] === "production") {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(__dirname, 'app/browser');
  app.use(express.static(browserDistFolder));
  app.get('*', (req: any, res: any) => {
    res.sendFile(join(browserDistFolder, 'index.html'));
  });
}

if (process.env['RUNNING_SERVER'] === 'true') {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

export default app;

