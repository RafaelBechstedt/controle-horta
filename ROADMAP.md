# Roadmap & proposed issues

This is my planned work for `controle-horta`, split into well-scoped tasks. Each item below maps
to a GitHub issue.

> Status legend: 🟢 ready to start · 🟡 blocked by a dependency · 🔵 nice-to-have / later

## What already exists (the foundation — don't re-do)

- Docker Compose stack: `backend` (Express), `frontend` (Vite/React), `database` (MySQL 8.4).
- **Prisma** ORM + versioned migrations (`backend/prisma/`). Schema is the source of truth.
- **Auth**: stateless JWT, `POST /api/v1/auth/register` + `/login`, bcrypt password hashing.
- **Multi-tenancy (Model A)**: one account per person; every plant query is scoped by `user_id`
  in the model layer.
- Zod validation, central error handler, `/health`, CORS restricted to the frontend origin.
- Layered backend: `route → controller → service → model → lib/prisma`.

See `README.md` for how to run and the API contract.

---

## Milestone 1 — Make the app usable end to end

### 1. Frontend: auth screens (register / login) 🟢 (#1)
**Context:** `frontend/src/App.jsx` is still the Vite starter template and calls no API.
**Scope:**
- Register and login forms calling `POST /api/v1/auth/register` and `/login`.
- Store the returned JWT (start with `localStorage`; note the XSS trade-off for a later issue).
- A simple auth context/guard: unauthenticated users see login; authenticated users see the app.
- Attach `Authorization: Bearer <token>` to API calls (shared fetch wrapper/client).
**Done when:** a new user can register, is logged in, and a reload keeps them logged in.
**Labels:** `frontend`, `auth`. **Est:** M.

### 2. Frontend: plants list + create form 🟡 (depends on #1) (#2)
**Scope:**
- List the user's plants (`GET /api/v1/plants`) and a form to create one (`POST`).
- Handle loading/empty/error states; show validation errors from the API (400 payloads).
**Done when:** a logged-in user creates a plant and sees it in the list, talking to the real API
through the browser (this also exercises CORS for real for the first time).
**Labels:** `frontend`. **Est:** M.

---

## Milestone 2 — Complete the backend domain

### 3. Plant CRUD: get-one / update / delete 🟢 (#3)
**Context:** only `GET /plants` (list) and `POST /plants` exist.
**Scope:**
- `GET /plants/:id`, `PUT /plants/:id`, `DELETE /plants/:id`.
- All scoped by `req.userId`; return **404** (not 403) when a plant belongs to another user, so
  existence isn't leaked. Keep the per-layer pattern (`route → controller → service → model`).
- Zod schemas for update.
**Done when:** a user can edit and delete only their own plants; cross-user access returns 404.
**Labels:** `backend`, `api`. **Est:** M.

### 4. Fertilizations CRUD (nested under a plant) 🟡 (depends on #3 patterns) (#4)
**Context:** the `fertilizations` table exists in `schema.prisma` but has no API.
**Scope:**
- `GET/POST /plants/:plantId/fertilizations`, plus update/delete.
- Verify the parent plant belongs to `req.userId` before any operation.
**Done when:** a user logs a fertilization against their plant and lists it; isolation holds.
**Labels:** `backend`, `api`. **Est:** M.

### 5. Watering log 🔵 (#5)
**Scope:** new Prisma model `Watering` (date + notes, FK to plant) + migration + CRUD, same
isolation rules as fertilizations.
**Labels:** `backend`, `enhancement`. **Est:** M.

### 6. Reminders for watering / fertilizing 🔵 (depends on #4, #5) (#6)
**Context:** a planned feature in the README.
**Scope:** background scheduler (e.g. node-cron, or BullMQ + Redis if it grows) that computes
due reminders per plant. The first version is **in-app only** — a list of due reminders shown in
the UI. Email/push delivery needs an external service, so it's out of scope for now and left for
later.
**Labels:** `backend`, `enhancement`, `needs-design`. **Est:** L.

---

## Milestone 3 — Production readiness

### 7. Automated tests + CI 🟢 (#7)
**Context:** `npm test` is a stub in both packages.
**Scope:**
- Backend: pick a runner (Vitest/Jest), test auth + plant isolation (the security-critical path)
  against a disposable MySQL (service container or Testcontainers).
- GitHub Actions workflow running lint + tests on PRs.
**Done when:** PRs run green checks; the tenant-isolation test fails if `user_id` scoping is removed.
**Labels:** `testing`, `ci`, `good first issue` (partial). **Est:** L.

### 8. Production Dockerfiles 🟢 (#8)
**Context:** current Dockerfiles are dev-oriented (nodemon, bind-mounts, `npm install`).
**Scope:**
- Backend: multi-stage build, `npm ci --omit=dev`, non-root user, `npm start` (runs
  `prisma migrate deploy`).
- Frontend: build static assets and serve via nginx (not the Vite dev server).
- A `docker-compose.prod.yml` or documented prod overrides.
**Labels:** `infra`, `docker`. **Est:** M.

### 9. Security hardening 🟢 (#9)
**Scope:** `helmet`, rate limiting on `/auth/*`, and decide token lifetime / refresh strategy.
Revisit where the JWT is stored on the frontend (httpOnly cookie vs localStorage).
**Labels:** `security`, `backend`. **Est:** M.

### 10. Structured logging 🔵 (#10)
**Scope:** replace `console.*` with a logger (e.g. `pino`) + request logging middleware, with
levels configurable by env.
**Labels:** `backend`, `observability`. **Est:** S.

---

## Suggested order

`#1 → #2` unlock a usable product. `#3 → #4` complete the domain. `#7` (tests) is worth doing
early and in parallel, since it locks in the tenant-isolation guarantee. `#8/#9` before any real
deployment.
