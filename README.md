# Controle Horta 🌱

A personal web app to keep track of the plants in my home vegetable garden and of when and how each one was fertilized.

I started this project because I wanted a simple way to remember what I planted, when I planted it and what fertilizer I used on each plant. It is built for my own use, and it is still in an early stage.

## Features

**Available now**
- User accounts with sign up / login (JWT authentication)
- Register and list plants through the API — each user only sees their own data
- Database schema for users, plants and fertilizations, managed with migrations

**Planned** (see [`ROADMAP.md`](ROADMAP.md) and the [open issues](../../issues))
- Frontend screens to sign in and to list, add, edit and remove plants
- Edit and delete plants in the API
- Register and list fertilizations for each plant
- Watering log
- Reminders for watering and fertilizing
- Automated tests and CI

## Tech stack

| Layer    | Technology                                  |
|----------|---------------------------------------------|
| Frontend | React 18, Vite                              |
| Backend  | Node.js 20, Express, Prisma (ORM)           |
| Database | MySQL 8.4                                    |
| Auth     | JWT, bcrypt, Zod validation                 |
| Tooling  | Docker, Docker Compose, Nodemon             |

## Architecture

The app is **multi-tenant with one account per person**: every plant belongs to a user
(`user_id`), and the data layer scopes every query by the logged-in user, so accounts never see
each other's data. Authentication is stateless (JWT bearer tokens).

The backend is organized in layers, each only calling the one below it:

```
route → controller → service → model → Prisma Client
```

## Project structure

```
controle-horta/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Source of truth for the DB schema
│   │   └── migrations/        # Versioned migrations
│   └── src/
│       ├── app.js             # Express server
│       ├── route/             # Routes (auth is public, plants require a token)
│       ├── controller/        # Request handling + Zod validation
│       ├── service/           # Business rules
│       ├── model/             # Database access (Prisma, scoped by user)
│       ├── middleware/        # auth, error handler, async wrapper
│       └── lib/               # Prisma client, JWT, errors
├── frontend/                  # React app (Vite)
├── docker-compose.yml
├── ROADMAP.md                 # Backlog / proposed issues
└── .env.example               # Example environment variables
```

## How to run

**Requirements:** Docker and Docker Compose.

1. Clone the repository:
   ```bash
   git clone https://github.com/RafaelBechstedt/controle-horta.git
   cd controle-horta
   ```
2. Create your `.env` from the example and set real passwords **and a `JWT_SECRET`**:
   ```bash
   cp .env.example .env
   # generate a secret, e.g.: openssl rand -hex 32
   ```
3. Start everything:
   ```bash
   docker compose up --build
   ```
4. Open:
   - Frontend: http://localhost:8080
   - API: http://localhost:3001/api/v1

On start the backend applies the database migrations automatically (`prisma migrate deploy`).
To reset the database, run `docker compose down -v`. See [`CLAUDE.md`](CLAUDE.md) for how to
create new migrations.

## API

Base URL: `/api/v1`. Authenticated routes expect an `Authorization: Bearer <token>` header; get a
token from register or login.

| Method | Route             | Auth | Description                          |
|--------|-------------------|------|--------------------------------------|
| POST   | `/auth/register`  | no   | Create an account, returns a token   |
| POST   | `/auth/login`     | no   | Log in, returns a token              |
| GET    | `/plants`         | yes  | List the logged-in user's plants     |
| POST   | `/plants`         | yes  | Register a new plant                 |
| GET    | `/health`         | no   | Liveness check                       |

Register / login body:

```json
{ "email": "me@example.com", "password": "at-least-8-chars" }
```

Response: `{ "token": "<jwt>", "user": { "id": 1, "email": "me@example.com" } }`

Create a plant (`POST /plants`):

```json
{
  "name": "Tomate cereja",
  "planted_date": "2026-11-01",
  "observations": "Planted in the large pot"
}
```

`name` and `planted_date` are required. `observations` is optional.

## License

This project is licensed under the [MIT License](LICENSE).
