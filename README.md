# Jersey & Track Pant Size Manager

A simple full-stack app built with React + Vite, Express, Prisma, and PostgreSQL.

## Requirements
- Node.js 20+
- PostgreSQL database

## 1. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set `DATABASE_URL` to your PostgreSQL connection string.

Example:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/jersey_sizes?schema=public"
PORT=4000
CLIENT_ORIGIN="http://localhost:5173"
```

Install dependencies, create the database tables, and start the API:

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

The API runs at `http://localhost:4000`.

## 2. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the Vite URL shown in your terminal (normally `http://localhost:5173`).

## Pages
- `/` — submit jersey and track pant sizes
- `/entries` — view all saved entries

## Duplicate protection
The backend normalizes the printed name by trimming whitespace and converting it to lowercase, then stores it in a unique `nameKey` column. PostgreSQL enforces the unique constraint, so duplicate names are rejected even if two requests arrive at nearly the same time. The frontend's validation is only for convenience; the backend/database are authoritative.

## API
- `POST /api/entries` — create an entry
- `GET /api/entries` — list entries
- `GET /api/health` — health check
