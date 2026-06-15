# Impulso Frontend

SPA responsiva construida con React y Vite. Integra completamente la API Express desplegada en Vercel.

## Instalacion

```bash
npm install
copy .env.example .env
npm run dev
```

La aplicacion local queda disponible en `http://localhost:5173`.

## Variables de entorno

```env
VITE_API_URL=http://localhost:4000/api
```

En produccion, como frontend y backend estan en el mismo dominio de Vercel, puede usarse `/api`.

## URL publica

- Web: https://tp-final-leonardo.vercel.app

## Pantallas

- Registro.
- Login.
- Verificacion de correo.
- Resumen con progreso semanal real.
- Tablero Kanban.
- Vista de lista.
- Calendario.
- Perfil con foto editable.
- Modal de tareas.
- Modal de categorias.

## Funcionalidad

- Registro/login integrado con JWT.
- CRUD de tareas.
- CRUD de categorias.
- Tareas recurrentes por dias de la semana.
- Limpieza de tareas completadas.
- Notificaciones desplegables.
- Busqueda y filtros.
- Modo demo local.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Responsive

La interfaz esta preparada para funcionar desde 320 px hasta 2000 px. En mobile:

- El sidebar pasa a drawer.
- Formularios y tarjetas se apilan.
- El Kanban usa scroll horizontal por columnas.
- Calendario y filtros se adaptan al ancho disponible.
