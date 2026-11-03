# BookMovies

A full-stack movie ticket booking starter built with React + Vite, Express.js, and MongoDB.

## Features
- Browse movie listings and showtimes
- Register / log in with JWT authentication
- Select seats and create bookings
- Prevent duplicate seat reservations for the same show
- View the signed-in user's bookings
- Responsive cinema-style UI

## Requirements
- Node.js 18+
- MongoDB local instance or MongoDB Atlas connection string

## Setup

### 1. Backend
```bash
cd server
cp .env.example .env
# Set MONGO_URI and JWT_SECRET in .env
npm install
npm run dev
```
The API runs at `http://localhost:5000`.

### 2. Frontend
In a second terminal:
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173`.

## Environment
`server/.env`
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bookmovies
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
```

## API
- `GET /api/health`
- `GET /api/movies`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (JWT)
- `GET /api/shows/:showId/seats`
- `POST /api/bookings` (JWT)
- `GET /api/bookings/my` (JWT)

Movies and shows are seeded automatically on the first backend start when the database is empty.

## Notes
This is a development-ready project scaffold, not a production payment system. Add payment-gateway integration, email verification, rate limiting, monitoring, and production secrets before public launch. Never commit `.env`.
