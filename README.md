# Controle Horta 🌱

A personal web app to keep track of the plants in my home vegetable garden and of when and how each one was fertilized.

I started this project because I wanted a simple way to remember what I planted, when I planted it and what fertilizer I used on each plant. It is built for my own use, and it is still in an early stage.

## Features

**Available now**
- Register a plant (name, planting date and notes) through the API
- List all registered plants through the API
- Database tables for plants and fertilizations

**Planned** (see the [open issues](../../issues) for details)
- Frontend screens to list, add, edit and remove plants
- Edit and delete plants in the API
- Register and list fertilizations for each plant
- Watering log
- Input validation, error handling and automated tests
- Reminders for watering and fertilizing

## Tech stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, Vite                    |
| Backend  | Node.js 20, Express               |
| Database | MySQL (via `mysql2`)              |
| Tooling  | Docker, Docker Compose, Nodemon   |

## Project structure

```
controle-horta/
├── backend/
│   ├── database/init.sql     # Creates the tables on first start
│   └── src/
│       ├── app.js            # Express server
│       ├── route/            # Routes
│       ├── controller/       # Request handling and validation
│       ├── service/          # Business rules
│       └── model/            # Database access
├── frontend/                 # React app (Vite)
├── docker-compose.yml
└── .env.example              # Example environment variables
```

## How to run

**Requirements:** Docker and Docker Compose.

1. Clone the repository:
   ```bash
   git clone https://github.com/RafaelBechstedt/controle-horta.git
   cd controle-horta
   ```
2. Create your `.env` file from the example and change the passwords:
   ```bash
   cp .env.example .env
   ```
3. Start everything:
   ```bash
   docker compose up --build
   ```
4. Open:
   - Frontend: http://localhost:8080
   - API: http://localhost:3001/api

The database tables are created automatically the first time the database container starts. To reset the database, run `docker compose down -v`.

## API

| Method | Route  | Description                 |
|--------|--------|-----------------------------|
| GET    | `/api` | List all plants             |
| POST   | `/api` | Register a new plant        |

Example request body for `POST /api`:

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
