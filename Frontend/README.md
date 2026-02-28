## disclaimer este readme fue elaborado con IA

# Laboratorio 4 - Frontend

Este frontend esta hecho con React con Vite y consume un backend en Express con MySQL.

## Que hace

- Mostrar canciones en tabla.
- Buscar canciones por nombre o artista.
- Paginacion.
- Agregar canciones nuevas (`nombre` y `artista`).

## Requisitos

- Node.js 18 o superior.
- MySQL corriendo localmente.

## Como levantar el proyecto (paso a paso)

1. Clonar o abrir este repo.
2. Levantar la base de datos en MySQL.
3. Levantar backend.
4. Levantar frontend.

## 1) Base de datos (MySQL)

Desde MySQL ejecuta el script:

`Backend/init.sql`

Eso crea:

- Base `lab_canciones`
- Tabla `songs`

## 2) Backend (Express)

Entrar a la carpeta backend:

```bash
cd Backend
```

Instalar dependencias:

```bash
npm install
```

Crear archivo `.env` en `Backend` con algo como esto:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=lab_canciones
DB_USER=root
DB_PASSWORD=tu_password
CORS_ORIGIN=http://localhost:5173
```

Levantar backend:

```bash
npm start
```

Por defecto corre en:

`http://localhost:3000`

## 3) Frontend (React + Vite)

Abrir otra terminal y entrar a frontend:

```bash
cd Frontend
```

Instalar dependencias:

```bash
npm install
```

Crear archivo `.env` en `Frontend`:

```env
VITE_API_URL=http://localhost:3000
```

Levantar frontend:

```bash
npm run dev
```

Abrir en navegador:

`http://localhost:5173`

## Endpoints que consume el frontend

- `GET /songs?page=1&limit=5&search=texto`
- `POST /songs`

Body para crear:

```json
{
  "nombre": "Bohemian Rhapsody",
  "artista": "Queen"
}
```

## Problemas comunes

- `Port 3000 is already in use`:
  - Cerrar proceso del puerto o correr backend en otro puerto.
- `Unknown database 'lab_canciones'`:
  - Falta ejecutar `Backend/init.sql`.
- El frontend no carga datos:
  - Revisar que `VITE_API_URL` apunte al puerto correcto del backend.
