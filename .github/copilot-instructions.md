# GitHub Copilot Instructions

## Project overview

Ultimate Fantasy TTRPG is a monorepo with:

- `frontend/`: React + Vite + TypeScript
- `backend/`: AWS SAM + AppSync + Lambda + DocumentDB
- `cli/`: Node.js deployment tooling
- `docs/`: architecture and operational documentation

## Implementation guidelines

- Use descriptive names, small functions, early exits, and flat control flow.
- Keep frontend styling inline and driven by the design tokens.
- Enforce the 20 character per-user limit in frontend logic.
- Treat Cognito `Admins` group membership as the source of admin authorization.
- Never commit secrets; document config in `.env.example` files instead.
- Prefer adding or updating tests with the implementation.

## Validation

Run the smallest relevant checks first:

```bash
cd frontend && npm test -- --run
cd frontend && npm run build
cd backend && npm test
```
