# IA NestJS API

NestJS v11 starter app with TypeORM and PostgreSQL.

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment variables

```bash
cp .env.example .env
```

Edit `.env` with your local configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
PORT=3000

# JWT (change in production)
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION=3600

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_TTL=60000
RATE_LIMIT_MAX=10
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

### 4. Run migrations

```bash
npm run migration:run
```

### 5. Start development server

```bash
npm run start:dev
```

Server available at `http://localhost:3000`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Development server with watch |
| `npm run build` | Compile to dist/ |
| `npm run start:prod` | Production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm run test` | Unit tests |
| `npm run test:e2e` | E2E tests |
| `npm run test:cov` | Coverage report |

## Database Migrations

```bash
npm run migration:generate ./src/migrations/Name  # Generate from entities
npm run migration:run                              # Run pending
npm run migration:revert                           # Revert last
npm run migration:create ./src/migrations/Name     # Create empty
```

## Security Features

- **Helmet**: HTTP security headers
- **CORS**: Configurable allowed origins
- **Rate Limiting**: Global throttling (10 requests/minute by default)
- **JWT Authentication**: Bearer token validation
- **Input Validation**: Whitelist and forbidNonWhitelisted

## Authentication

### Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com", "password": "password123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```

### Access Protected Route

```bash
curl -X GET http://localhost:3000/protected \
  -H "Authorization: Bearer <your-jwt-token>"
```

## License

MIT
