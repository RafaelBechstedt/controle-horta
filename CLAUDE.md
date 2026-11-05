# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`controle-horta` ("garden control") is a full-stack app for tracking plants and their
fertilizations. It has two independent packages — `backend/` (Express + MySQL) and
`frontend/` (React + Vite) — orchestrated together by `docker-compose.yml`. Code identifiers
and API are in English; some comments and commit messages are in Portuguese.

## Running

The intended workflow is Docker Compose, which also provisions MySQL and seeds the schema.
First copy the env template (compose reads `MYSQL_*` from `.env` for both the DB container and
the backend's `DB_*` variables):

```bash
cp .env.example .env             # then edit the passwords
docker-compose up --build        # backend :3001, frontend :8080, mysql :3306
```

On first boot MySQL runs every `.sql` file in `backend/database/` (mounted to
`/docker-entrypoint-initdb.d`). Schema changes in `init.sql` only take effect on a fresh
volume — `docker-compose down -v` to re-seed.

Running packages directly (requires a reachable MySQL — see caveat below):

```bash
# backend
cd backend && npm install
npm run dev      # nodemon, auto-reload
npm start        # plain node

# frontend
cd frontend && npm install
npm run dev      # vite dev server
npm run build    # production build
npm run lint     # eslint (flat config in eslint.config.js)
```

No test runner is configured in either package (`backend` `npm test` is a stub that exits 1).

## Backend architecture

Express app (`backend/src/app.js`) mounts all routes under `/api`. The code follows a strict
four-layer pattern, one file per layer under `backend/src/`, and each layer only calls the one
below it:

```
route/  → controller/  → service/  → model/  → connection.js (mysql2 pool)
```

- **route** — declares endpoints, binds to controllers.
- **controller** — reads `req`, validates input, sets HTTP status, catches errors into JSON.
- **service** — business logic (currently pass-through to model).
- **model** — raw parameterized SQL via the shared `dbPool`.

When adding a feature (e.g. the `fertilizations` table already in the schema), add a function
at each layer and wire a route — mirror the naming convention `<action><Entity><Layer>`
(e.g. `addPlantController`, `addPlantService`, `addPlantModel`).

Current API (`/api`): `GET /` lists plants, `POST /` creates one (`name` + `planted_date`
required, `observations` optional).

## Database

`backend/database/init.sql` defines `garden_control` with two tables: `plants` and
`fertilizations` (FK `plant_id → plants.id ON DELETE CASCADE`). The fertilizations table has
no model/route layer yet.

## Configuration

- `connection.js` reads the DB config from `DB_HOST`/`DB_PORT`/`DB_USER`/`DB_PASSWORD`/`DB_NAME`.
  Compose injects these into the backend container (host `database`, derived from the `MYSQL_*`
  values in `.env`). To run the backend on the host instead, set those `DB_*` vars yourself and
  point `DB_HOST` at a reachable MySQL.
- The frontend container is served by `npm run start` → `vite --host 0.0.0.0 --port 8080`
  (matches the compose port mapping). `npm run dev` is plain Vite on its default port.
- `frontend/src/App.jsx` is still the default Vite starter template; the UI is unbuilt.
