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

Set `DOCUMENTDB_URI` and Cognito values before invoking Lambda locally or deploying.
