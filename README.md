# Sistema de Inscripción a Cursos - Trabajo Final Integrador

Este proyecto corresponde al **Trabajo Final Integrador** para la materia **Programación IV (1er Cuatrimestre 2026)** de la **Licenciatura en Sistemas** en la **Facultad de Ciencias de la Administración - UNER**.

El sistema consiste en una aplicación web responsiva diseñada para la intranet de la institución, permitiendo al personal afectado gestionar de manera eficiente el flujo de estudiantes, cursos e inscripciones.

---

## Requisitos Técnicos y Arquitectura

- **Frontend:** Desarrollado en Angular utilizando diseño responsivo adaptable a distintas resoluciones.
- **Backend:** API Rest desarrollada bajo buenas prácticas de diseño arquitectónico.
- **Base de Datos:** Modelo relacional basado en el diagrama oficial (Tablas: `usuarios`, `estudiantes`, `cursos`, `inscripciones`, `cursos_estados`, `inscripciones_estados`).
- **Seguridad:** Gestión de información sensible del servicio mediante variables de entorno.

---

# Instalación y Ejecución del Proyecto

## Información del Grupo

**Grupo:** `Prog4202601_J`

### Integrantes

- Ribarola, Joaquín
- Aguilar, Luciano
- Trapote, Diego
- Agüero, Facundo
- Toribio, Juan
- Sillen Ríos, Matías

---

## Usuarios del Sistema

Los usuarios del sistema corresponden a los integrantes del grupo.

- **Nombre de usuario:** nombre del integrante en minúsculas
- **Contraseña:** `admin123`

### Ejemplos

| Usuario   | Contraseña |
| --------- | ---------- |
| `joaquin` | `admin123` |
| `luciano` | `admin123` |
| `diego`   | `admin123` |
| `facundo` | `admin123` |
| `juan`    | `admin123` |
| `matias`  | `admin123` |

---

## 1️ - Instalar Node.js

Node.js es el entorno que permite ejecutar el servidor backend y las herramientas de Angular.

- Ir al sitio oficial de Node.js: https://nodejs.org
- Descargar e instalar la versión **LTS (Recommended)**.

### Tip para Windows

Durante la instalación, dejar las opciones por defecto.

Si el instalador pregunta si desea instalar **"Tools for Native Modules"** (herramientas adicionales como Python/C++), es recomendable aceptar, ya que la base de datos SQLite puede requerirlas para compilar internamente en algunos entornos.

### Verificar la instalación

Abrir una terminal (`CMD`, `PowerShell`, Terminal de VSCode, etc.) y ejecutar:

```bash
node -v
```

Esto debería mostrar la versión instalada de Node.js.

---

## 2️ - Descargar el Proyecto

Repositorio oficial:

```txt
https://github.com/cjoriginal45/Integrador_Programacion_IV
```

### Opción A — Clonar el repositorio

```bash
git clone https://github.com/cjoriginal45/Integrador_Programacion_IV.git
```

### Opción B — Descargar ZIP

- Descargar el proyecto como `.zip`
- Descomprimirlo en una carpeta de la computadora

---

## 3️ - Abrir el Proyecto en Visual Studio Code

Abrir la carpeta del proyecto en Visual Studio Code y utilizar una terminal **Bash** integrada, posicionada en la raíz del proyecto, para ejecutar los comandos indicados en esta guía.

La terminal puede abrirse desde:

```bash
Terminal > New Terminal
```

o utilizando el atajo:

```bash
Ctrl + Ñ
```

---

## 4️ - Instalar Yarn

Se utilizará **Yarn** para administrar dependencias y ejecutar los comandos del proyecto.

En la terminal, ejecutar el siguiente comando para habilitar Yarn de manera nativa en el sistema:

```bash
corepack enable
```

### Verificar la activación

Para comprobar que Yarn quedó correctamente habilitado, ejecutar:

```bash
yarn --version
```

> Si es la primera vez que se ejecuta el comando, la terminal puede solicitar confirmación para descargar la versión oficial de Yarn.  
> En ese caso, presionar `Y` o `Enter` para continuar.

---

## 5️ - Instalar Dependencias del Proyecto

Una vez dentro de la carpeta del proyecto, ejecutar:

```bash
yarn install
```

Esto descargará e instalará automáticamente todas las librerías necesarias definidas en el archivo `package.json`.

---

## 6️ - Ejecutar la Aplicación en Modo Desarrollo

Para iniciar simultáneamente:

- Backend → `http://localhost:3001`
- Frontend Angular → `http://localhost:3000`

Ejecutar:

```bash
yarn dev
```

Esperar unos segundos a que el proyecto compile correctamente.

En la terminal debería aparecer algo similar a:

```bash
Backend server running on http://localhost:3001
➜  Local: http://localhost:3000/
```

---

# ¡Listo!

Abrir el navegador e ingresar a:

```txt
http://localhost:3000
```

La aplicación debería estar funcionando correctamente.
