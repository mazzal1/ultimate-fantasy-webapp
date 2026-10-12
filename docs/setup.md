# Local Setup

## Requirements

- Node.js 20+
- npm
- AWS SAM CLI for backend packaging and deployment
- AWS credentials for cloud workflows

## Bootstrap

```bash
git clone <repo-url>
cd utlimate-fantasy-webapp
cp .env.example .env
cp backend/.env.example backend/.env
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Populate Vite env vars with your Cognito and AppSync settings.

## Backend

```bash
cd backend
npm install
npm test
sam validate
```

Set `POSTGRES_URI`, `POSTGRES_SSL`, and Cognito values before invoking Lambda locally or deploying.

## Infrastructure deployment

Deploy the split infrastructure stacks through the CLI:

```bash
cd cli
npm install
node ./bin/uf-cli.js deploy --stage dev
```

This provisions network, auth, data, backend, and frontend stacks and synchronizes cross-stack values with SSM Parameter Store under `/ultimate-fantasy/dev/...`.
