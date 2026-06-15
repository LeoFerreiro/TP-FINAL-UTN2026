# Impulso API

API REST con Express y MongoDB para gestionar usuarios, categorias y tareas. Implementa arquitectura en capas:

```text
routes -> controllers -> services -> repositories
```

## Instalacion

```bash
npm install
copy .env.example .env
npm run dev
```

La API local queda disponible en `http://localhost:4000/api`.

## Variables de entorno

```env
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=8h
FRONTEND_URL=http://localhost:5173
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
EMAIL_MODE=json
```

`EMAIL_MODE=json` sirve para desarrollo local porque Nodemailer no envia correos reales y muestra el mensaje generado.

## Seguridad

- Passwords hasheadas con bcrypt.
- JWT Bearer con expiracion configurable.
- Token de verificacion por correo guardado como hash SHA-256.
- Validacion de inputs con `express-validator`.
- CORS configurado desde `FRONTEND_URL`.
- Middleware centralizado de errores.
- Middleware JWT para rutas privadas.

## URL publica

- API: https://tp-final-leonardo.vercel.app/api
- Health: https://tp-final-leonardo.vercel.app/api/health

## Endpoints

Las rutas protegidas requieren:

```http
Authorization: Bearer <token>
```

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Estado de la API |
| POST | `/api/auth/register` | No | Registra usuario y envia email de activacion |
| POST | `/api/auth/resend-verification` | No | Reenvia email de verificacion |
| POST | `/api/auth/verify-email` | No | Verifica token de activacion |
| POST | `/api/auth/login` | No | Devuelve JWT y usuario |
| GET | `/api/auth/me` | Si | Perfil autenticado |
| PATCH | `/api/auth/profile/avatar` | Si | Actualiza o elimina foto de perfil |
| GET | `/api/categories` | Si | Lista categorias del usuario |
| POST | `/api/categories` | Si | Crea categoria |
| PUT | `/api/categories/:id` | Si | Actualiza categoria |
| DELETE | `/api/categories/:id` | Si | Elimina categoria sin tareas |
| GET | `/api/tasks` | Si | Lista tareas con filtros opcionales |
| GET | `/api/tasks/:id` | Si | Detalle de tarea |
| POST | `/api/tasks` | Si | Crea tarea |
| PUT | `/api/tasks/:id` | Si | Actualiza tarea |
| DELETE | `/api/tasks/:id` | Si | Elimina tarea |
| POST | `/api/tasks/cleanup-completed` | Si | Limpia tareas completadas y detiene recurrencias asociadas |

## Filtros de tareas

`GET /api/tasks` acepta query params:

- `status`: `pending`, `in_progress`, `completed`
- `priority`: `low`, `medium`, `high`
- `category`: id MongoDB de categoria
- `search`: texto a buscar en titulo

## Payloads principales

### Registro

```json
{
  "name": "Usuario Prueba",
  "email": "usuario@correo.com",
  "password": "Password123"
}
```

### Login

```json
{
  "email": "usuario@correo.com",
  "password": "Password123"
}
```

### Categoria

```json
{
  "name": "Estudio",
  "color": "#1677ff"
}
```

### Tarea comun

```json
{
  "title": "Preparar presentacion final",
  "description": "Revisar objetivos y conclusiones",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-06-20",
  "category": "ID_MONGODB_DE_LA_CATEGORIA",
  "recurrence": {
    "enabled": false,
    "weekdays": []
  }
}
```

### Tarea recurrente

`weekdays` usa el mismo criterio de JavaScript: domingo `0`, lunes `1`, martes `2`, miercoles `3`, jueves `4`, viernes `5`, sabado `6`.

```json
{
  "title": "Entrenar",
  "description": "Rutina semanal",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2026-06-15",
  "category": "ID_MONGODB_DE_LA_CATEGORIA",
  "recurrence": {
    "enabled": true,
    "weekdays": [1, 3],
    "endDate": "2026-06-30"
  }
}
```

### Limpiar completadas

```json
{
  "ids": ["ID_TAREA_COMPLETADA"],
  "all": false
}
```

Para limpiar todas:

```json
{
  "ids": [],
  "all": true
}
```

## Pruebas

```bash
npm test
```
