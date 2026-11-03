# BookMovies

A full-stack movie ticket booking app built with React + Vite, Express.js, and MongoDB.

## Get the source

Download [BookMovies-fullstack.zip](./BookMovies-fullstack.zip) and extract it. The archive contains the React client, Express API, MongoDB models and seed data, environment example, and demo recording script.

## Stack and features

- React 18, Vite, responsive cinema-style UI
- Express REST API and Mongoose models
- MongoDB persistence for movies, users, shows, and bookings
- JWT authentication with bcrypt password hashing
- Movie search, showtimes, seat selection, booking history

## Run locally with MongoDB Atlas

1. Create a free MongoDB Atlas cluster and a database user.
2. In Atlas Network Access, allow the IP address of the machine running the API (for local testing, add your current IP).
3. Copy the Atlas connection string and replace the username, password, and database name placeholders.
4. Extract the ZIP, then open a terminal in `bookmovies/server`.
5. Copy `.env.example` to `.env` and set:

```env
PORT=5000
MONGO_URI=mongodb+srv://<db-user>:<db-password>@<cluster-host>/bookmovies?retryWrites=true&w=majority
JWT_SECRET=<long-random-secret>
CLIENT_ORIGIN=http://localhost:5173
```

6. Install and start the API: `npm install`, then `npm run dev`.
7. In a second terminal, open `bookmovies/client`, set `VITE_API_URL=http://localhost:5000/api` in a client `.env` file, run `npm install`, then `npm run dev`.
8. Visit http://localhost:5173.

Never commit either `.env` file or share your Atlas URI/JWT secret. Set secrets as environment variables in your hosting provider when deploying.

## API

- `GET /api/health`
- `GET /api/movies`
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/auth/me` (JWT)
- `GET /api/shows/:showId/seats`
- `POST /api/bookings` (JWT)
- `GET /api/bookings/my` (JWT)

## Demo

A step-by-step recording script is in `docs/DEMO_SCRIPT.md` inside the ZIP. A hosted demo video and live deployment are not yet available.

## Production notes

This is a functional starter, not a payment-processing production service. Before accepting real bookings, use a transaction or atomic conditional update to prevent concurrent double-booking, add rate limiting and validation, configure HTTPS and secure token storage, and integrate a payment provider if required.
