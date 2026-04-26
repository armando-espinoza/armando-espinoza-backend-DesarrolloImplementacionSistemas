## Proyecto Sanji (Backend)

Backend API en Node.js + Express + Sequelize (Postgres).

### Requisitos
- Node.js
- Postgres

### Configuración

- **Variables de entorno**: copia `backend/.env.ejemplo` a `backend/.env` y llena valores reales.

### Ejecutar

```bash
cd backend
npm install
npm start
```

Servidor:
- `http://localhost:1919`

### Seguridad (API Key)
Todas las rutas bajo `/API/*` requieren API key.

Envíala como:
- Query param: `?key=TU_API_KEY`
- Header: `x-api-key: TU_API_KEY`

### Documentación para frontend
Ver `API_FRONTEND.md`.

### Nota importante sobre la base de datos
- Por defecto **NO** se reinicia la base al reiniciar el servidor.
- Si pones `DB_FORCE_SYNC=true`, Sequelize arrancará con `force: true` y **recreará las tablas (borra datos)**.

