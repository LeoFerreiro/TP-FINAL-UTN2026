# Impulso

Trabajo integrador Full Stack: gestor de tareas con categorías, autenticación JWT y verificación por correo.

## Estructura

- `frontend/`: React + Vite, interfaz responsiva de 320 px a 2000 px.
- `backend/`: Node.js + Express + MongoDB, arquitectura en capas.

## Inicio rápido

```bash
npm run install:all
npm run dev:backend
npm run dev:frontend
```

Antes de iniciar, copiá los archivos `.env.example` como `.env` dentro de cada proyecto y completá sus valores.

## Funcionalidad

- Registro con contraseña segura y email de activación mediante Nodemailer.
- Login con JWT Bearer y expiración.
- CRUD completo de tareas.
- CRUD de categorías relacionadas mediante referencia Mongoose y `populate`.
- Filtros, búsqueda, tablero Kanban y vista de lista.
- Rutas protegidas y aislamiento de datos por usuario.

## Despliegue sugerido

- Frontend: Vercel o Netlify. Definir `VITE_API_URL`.
- Backend: Render o Railway. Configurar variables de entorno y MongoDB Atlas.
- En `FRONTEND_URL` indicar la URL pública del frontend para CORS y los enlaces de verificación.

Las URLs públicas y credenciales de evaluación deben agregarse aquí una vez realizados los despliegues.

El archivo `vercel.json` de la raíz configura Vercel para instalar y compilar exclusivamente `frontend/` dentro del monorepo y redirige las rutas de React Router a `index.html`.
