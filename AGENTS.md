# AI Agent Guide

## Repository structure

- `frontend/`: React + Vite + TypeScript UI.
- `backend/`: AWS SAM application with AppSync and DocumentDB.
- `cli/`: Node.js operational tooling.
- `docs/`: Long-form technical documentation.

## Coding expectations

- Prefer SOLID, DRY, flat code, early exits, and descriptive names.
- Keep functions small and side-effect boundaries explicit.
- Use TypeScript in the frontend and modern JavaScript in backend and CLI packages.
- Do not add secrets or credentials to source control.
- Favor incremental, surgical changes that keep the system coherent.

## Frontend conventions

- Use inline styles powered by `src/design-system/tokens.ts`.
- Prefer composition over inheritance.
- Keep hooks focused on one resource or concern.
- Route protection must flow through `AuthContext`.

## Backend conventions

- Resolvers should stay small and delegate validation to utilities.
- Parse user identity from AppSync context in middleware.
- Keep ownership checks explicit for character and campaign access.
- Use mongoose models for DocumentDB documents.

## CLI conventions

- Keep command handlers thin and push shared behavior into `src/utils/`.
- Print actionable operator feedback with consistent logging.

## Validation commands

```bash
cd frontend && npm test -- --run
cd frontend && npm run build
cd backend && npm test
```

## Environment setup

- Node.js 20+
- AWS SAM CLI for backend builds and deploys
- AWS credentials with access to CloudFormation, AppSync, Lambda, Cognito, and SSM

## Key design decisions

- Cognito handles auth; AppSync forwards identity to Lambda resolvers.
- Character creation is capped at 20 entries per user.
- Admin capabilities are gated by the Cognito `Admins` group.
- App styling uses tokens and native React style props instead of CSS frameworks.
