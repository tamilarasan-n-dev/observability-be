# Observability Backend API

A minimal Express TypeScript backend for storing web page analytics events.

## Features

- **Observer API** - Store and query page visit analytics with IP tracking
- **JWT Authentication** - Secure endpoints with role-based access
- **MongoDB** - Persistent storage with pagination support
- **Zod Validation** - Request payload validation
- **Docker Ready** - Multi-stage Dockerfile for production

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 6767 | Server port |
| `HOST` | http://localhost | Host URL |
| `MONGODB_URI` | mongodb://localhost:27017/observability | MongoDB connection string |
| `JWT_SECRET` | - | Secret key for JWT signing |
| `NODE_ENV` | development | Environment (development/production) |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | ❌ | Health check |
| POST | `/api/observer` | ❌ | Create observer event (public) |
| POST | `/api/observer/list` | ✅ | List observers with filters |

### Create Observer (Public)

```bash
curl -X POST http://localhost:6767/api/observer \
  -H "Content-Type: application/json" \
  -d '{"pageRoute": "/home"}'
```

### List Observers (Authenticated)

```bash
curl -X POST http://localhost:6767/api/observer/list?page=1&limit=10 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"groupBy": "ip"}'
```

## Docker

```bash
# Build
docker build -t observability-be .

# Run
docker run -p 6767:6767 --env-file .env observability-be
```

## Project Structure

```
src/
├── api/observer/     # Observer CRUD resource
├── api/user/         # User model for auth
├── common/           # Middleware, utils, models
├── config/           # MongoDB connection
├── server.ts         # Express app setup
└── index.ts          # Entry point
```

## License

MIT
