# Impulso API

API REST con Express y MongoDB para gestionar usuarios, categorías y tareas. Implementa arquitectura `routes -> controllers -> services -> repositories`.

## Instalación

```bash
npm install
copy .env.example .env
npm run dev
```

Se requiere MongoDB y configurar `MONGODB_URI`. Para desarrollo, `EMAIL_MODE=json` permite imprimir el email generado sin un servidor SMTP. En producción deben completarse las variables SMTP.

## Seguridad

- Contraseñas hasheadas con bcrypt (12 rondas).
- JWT Bearer con expiración configurable.
- Token de verificación aleatorio, almacenado como hash SHA-256 y válido por 24 horas.
- Validación con `express-validator`.
- CORS restringido al frontend configurado.
- Manejo centralizado de errores.

## Endpoints

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Estado de la API |
| POST | `/api/auth/register` | No | Registra usuario y envía email |
| POST | `/api/auth/verify-email` | No | Verifica token de activación |
| POST | `/api/auth/login` | No | Devuelve JWT y usuario |
| GET | `/api/auth/me` | Sí | Perfil autenticado |
| GET | `/api/tasks` | Sí | Lista y filtra tareas |
| GET | `/api/tasks/:id` | Sí | Detalle de tarea |
| POST | `/api/tasks` | Sí | Crea tarea |
| PUT | `/api/tasks/:id` | Sí | Actualiza tarea |
| DELETE | `/api/tasks/:id` | Sí | Elimina tarea |
| GET | `/api/categories` | Sí | Lista categorías |
| POST | `/api/categories` | Sí | Crea categoría |
| PUT | `/api/categories/:id` | Sí | Actualiza categoría |
| DELETE | `/api/categories/:id` | Sí | Elimina categoría sin tareas |

Las rutas protegidas requieren `Authorization: Bearer <token>`.

### Ejemplo de tarea

```json
{
  "title": "Preparar presentación final",
  "description": "Revisar objetivos y conclusiones",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-06-20",
  "category": "ID_MONGODB_DE_LA_CATEGORIA"
}
```

## Pruebas

```bash
npm test
```
