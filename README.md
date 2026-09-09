# Ultimate Fantasy TTRPG

Ultimate Fantasy TTRPG is a full-stack monorepo for managing fantasy tabletop RPG characters, campaigns, and skill trees.

## Monorepo layout

- `frontend/` React + Vite + TypeScript client with Amplify auth and AppSync GraphQL access.
- `backend/` AWS SAM serverless backend with AppSync, Lambda resolvers, Cognito auth, and DocumentDB models.
- `cli/` Node.js deployment and operations CLI.
- `docs/` Architecture, setup, deployment, API, design system, and database docs.
- `.github/` CI automation and agent instructions.

## Core features

- Cognito-backed authentication with admin group support.
- Character management with stat tracking and a 20 character per-user cap.
- Campaign management for game masters and players.
- Admin-managed skill catalog with prerequisite metadata.
- Fantasy design system implemented with inline token-based styling.
- GDPR consent banner stored in browser local storage.

## Quick start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm test
sam build
```

### CLI

```bash
cd cli
npm install
node ./bin/uf-cli.js status --stage dev
```

## Environment variables

Copy `.env.example` at the repo root and `backend/.env.example` for local development. Never commit secrets. Store deployment secrets in AWS Systems Manager Parameter Store.

## Testing and build

```bash
cd frontend && npm test -- --run
cd frontend && npm run build
cd backend && npm test
```

## Deployment

Use the CLI or SAM directly.

```bash
cd cli
node ./bin/uf-cli.js deploy --stage dev
```

Detailed deployment steps live in `docs/deployment.md`.

## Design principles

- SOLID, DRY, descriptive naming, early exits.
- Small focused Lambda resolvers and React components.
- Environment-driven configuration with no hard-coded secrets.
- Tests maintained alongside implementation.

## License

Licensed under PolyForm Noncommercial 1.0.0. See `LICENSE`.
