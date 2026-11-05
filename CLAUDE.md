# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`controle-horta` ("garden control") is a full-stack app for tracking plants and their
fertilizations. It has two independent packages — `backend/` (Express + Prisma + MySQL) and
`frontend/` (React + Vite) — orchestrated together by `docker-compose.yml`. Code identifiers
and API are in English; some comments and commit messages are in Portuguese.

It is multi-tenant via **Model A** (shared schema, one account per person): every user owns
their own rows, enforced by a `user_id` foreign key on `plants`. Auth is stateless JWT.

## Running

The intended workflow is Docker Compose. First copy the env template (compose reads `MYSQL_*`
from `.env` to provision the DB and to assemble the backend's `DATABASE_URL`):

```bash
cp .env.example .env             # then set real passwords + a JWT_SECRET
docker-compose up --build        # backend :3001, frontend :8080, mysql :3306
```

On start the backend runs `prisma migrate deploy` (via its `dev`/`start` npm scripts) to bring
the DB schema up to date before serving. The schema is owned by Prisma — there is no `init.sql`.

### Migrations (Prisma)

`backend/prisma/schema.prisma` is the source of truth. To change the schema, edit it and create
a migration. `prisma migrate dev` needs to create a MySQL *shadow database*, which `garden_user`
cannot — so run it with the root connection string:

```bash
set -a; . ./.env; set +a
docker compose run --rm --entrypoint sh \
  -e DATABASE_URL="mysql://root:${MYSQL_ROOT_PASSWORD}@database:3306/${MYSQL_DATABASE}" \
  backend -c "npx prisma migrate dev --name <change_name>"
```

Normal startup applies migrations with `prisma migrate deploy` (as `garden_user`, no shadow DB).

```bash
# frontend
cd frontend && npm install
npm run dev      # vite dev server
npm run build    # production build
npm run lint     # eslint (flat config in eslint.config.js)
```

No test runner is configured in either package (`backend` `npm test` is a stub that exits 1).

## Backend architecture

Express app (`backend/src/app.js`) mounts routes under `/api/v1`. The code follows a strict
layered pattern, one file per layer under `backend/src/`, and each layer only calls the one
below it:

```
route/  → controller/  → service/  → model/  → lib/prisma.js (Prisma Client)
```

- **route** — declares endpoints, binds to controllers. `plantRoute` is guarded by the
  `authenticate` middleware; `authRoute` (register/login) is public.
- **controller** — validates input with a **Zod** schema (`.parse()` throws on bad input),
  reads `req.userId`, sets HTTP status. Wrapped in `asyncHandler` so rejections reach the
  error middleware.
- **service** — business logic; throws `AppError(status, message)` for expected failures
  (e.g. 401 bad credentials, 409 duplicate email).
- **model** — Prisma queries. **Every plant query is scoped by `userId`** — this is where
  tenant isolation is enforced; never query plants without it.

Cross-cutting pieces live in `src/middleware/` (`auth`, `error`, `asyncHandler`) and `src/lib/`
(`prisma`, `token`, `errors`). The central `errorHandler` (`middleware/error.js`) maps
`AppError`, `ZodError`, and Prisma `P2002` to clean JSON; everything else becomes a 500.

When adding a feature, add a function per layer and wire a route — mirror the naming convention
`<action><Entity><Layer>` (e.g. `addPlantController`, `addPlantService`, `addPlantModel`).

### API (`/api/v1`)

| Method | Route             | Auth | Description |
|--------|-------------------|------|-------------|
| POST   | `/auth/register`  | no   | Create account, returns `{ token, user }` |
| POST   | `/auth/login`     | no   | Returns `{ token, user }` |
| GET    | `/plants`         | yes  | List the caller's plants |
| POST   | `/plants`         | yes  | Create a plant (`name` + `planted_date` required) |
| GET    | `/health`         | no   | Liveness check |

Authenticated requests send `Authorization: Bearer <jwt>`. The token's `sub` is the user id;
`authenticate` verifies it and sets `req.userId`.

## Data model (Prisma / MySQL)

`User (1) ──< Plant (1) ──< Fertilization`. `plants.user_id → users.id` and
`fertilizations.plant_id → plants.id`, both `ON DELETE CASCADE`. Passwords are stored as bcrypt
hashes in `users.password_hash`. `fertilizations` exists in the schema but has no route/service
layer yet.

## Configuration

- The backend requires `DATABASE_URL` and `JWT_SECRET` (it fails fast at startup if either is
  missing). Compose assembles `DATABASE_URL` from the `MYSQL_*` values in `.env`, so you only
  set the pieces (`MYSQL_USER`/`MYSQL_PASSWORD`/`MYSQL_DATABASE`) plus `JWT_SECRET`.
- CORS is restricted to `CORS_ORIGIN` (defaults to `http://localhost:8080`, the frontend). The
  server always echoes that single origin, so any other origin is rejected by the browser.
- MySQL is pinned to `mysql:8.4`. It applies `MYSQL_*` (password, user, db) only on first volume
  init — after changing credentials in `.env`, run `docker-compose down -v`.
- The frontend container is served by `npm run start` → `vite --host 0.0.0.0 --port 8080`
  (matches the compose port mapping). `npm run dev` is plain Vite on its default port.
- `frontend/src/App.jsx` is still the default Vite starter template; the UI is unbuilt and does
  not yet call the API.
