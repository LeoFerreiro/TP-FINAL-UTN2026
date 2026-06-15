# Impulso

Trabajo integrador final Full Stack: gestor de tareas con categorias, recurrencias, autenticacion JWT y verificacion por correo.

## Repositorio GitHub

Monorepo con frontend y backend:

- Repo completo: https://github.com/LeoFerreiro/TP-FINAL-UTN2026
- Backend: https://github.com/LeoFerreiro/TP-FINAL-UTN2026/tree/main/backend
- Frontend: https://github.com/LeoFerreiro/TP-FINAL-UTN2026/tree/main/frontend

## Despliegues publicos

- Frontend Web: https://tp-final-leonardo.vercel.app
- Backend API: https://tp-final-leonardo.vercel.app/api
- Health check API: https://tp-final-leonardo.vercel.app/api/health

## Credenciales de usuario de prueba

Las credenciales reales de prueba se entregan por privado junto con la entrega para no publicar contrasenas en GitHub.

- Estado: usuario de prueba verificado

## Estructura del proyecto

```text
TP_FINAL_UTN2026/
|- api/                 # Adaptador serverless de Vercel para Express
|- backend/             # Node.js + Express + MongoDB
`- frontend/            # React + Vite
```

## Estructura backend solicitada

```text
backend/src/
|- config/
|  `- db.js
|- models/
|- repositories/
|- services/
|- controllers/
|- routes/
|- middleware/
`- utils/
```

## Instalacion local

```bash
npm run install:all
npm run dev:backend
npm run dev:frontend
```

Antes de iniciar, copiar los archivos `.env.example` como `.env` dentro de `backend/` y `frontend/`, y completar sus valores.

## Scripts utiles

```bash
npm test
npm run build --prefix frontend
```

## Funcionalidad principal

- Registro con email de activacion mediante Nodemailer.
- Login con JWT Bearer y expiracion.
- Hash de contrasenas con bcrypt.
- CRUD completo de tareas.
- CRUD de categorias relacionadas con tareas mediante referencias Mongoose y `populate`.
- Tareas recurrentes por dias de la semana hasta una fecha limite.
- Limpieza de tareas completadas, incluyendo detencion de series recurrentes.
- Perfil con foto editable.
- Dashboard con progreso semanal calculado desde tareas reales.
- Rutas protegidas y aislamiento de datos por usuario.

## Documentacion adicional

- Backend y endpoints: [`backend/README.md`](backend/README.md)
- Frontend: [`frontend/README.md`](frontend/README.md)
