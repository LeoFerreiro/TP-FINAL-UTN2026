# Impulso Frontend

SPA responsiva construida con React 19 y Vite. Incluye registro, login, verificación de correo, tablero Kanban, vista de lista, filtros y CRUD de tareas y categorías.

## Instalación

```bash
npm install
copy .env.example .env
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`. Configurá `VITE_API_URL` con la URL pública o local del backend.

## Scripts

- `npm run dev`: servidor de desarrollo.
- `npm run build`: compilación de producción.
- `npm run preview`: vista previa del build.

## Responsive

El layout funciona entre 320 px y 2000 px. En móvil, el sidebar se transforma en un drawer, los formularios se apilan y el Kanban usa desplazamiento horizontal por columnas.

## Modo demo

Desde el login puede ingresarse a un modo demo local para revisar la interfaz sin una base de datos activa. El flujo normal usa completamente la API configurada.
