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

## License

MIT
