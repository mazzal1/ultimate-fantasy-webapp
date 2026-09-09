# Claude Code Instructions

## Working style

- Prefer TDD or test-aligned implementation.
- Make small, easy-to-review changes.
- Use pure helpers and small functions where practical.
- Avoid hidden side effects and deeply nested control flow.
- Use early returns for validation and authorization branches.

## Repository map

- `frontend/`: Vite + React + TypeScript app.
- `backend/`: AWS SAM Lambda resolvers, middleware, models, tests.
- `cli/`: Deployment tooling.
- `docs/`: Technical references.

## Quality bar

- Keep code readable and explicit.
- Share logic through utilities rather than duplication.
- Keep components and resolvers focused on one responsibility.
- Never commit secrets; use environment variables and SSM.

## Commands

```bash
cd frontend && npm test -- --run
cd frontend && npm run build
cd backend && npm test
```

## Architecture reminders

- Cognito group membership determines admin access.
- AppSync invokes Lambda resolvers with identity metadata.
- DocumentDB persistence is modeled through mongoose schemas.
- The frontend uses token-driven inline styles, not CSS frameworks.
