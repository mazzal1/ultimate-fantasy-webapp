# Architecture

## Overview

Ultimate Fantasy TTRPG uses a React frontend, AppSync GraphQL API, Lambda resolvers, Cognito auth, and Amazon RDS for PostgreSQL persistence.
Infrastructure is split into dedicated CloudFormation stacks (`network`, `auth`, `data`, `backend`, `frontend`) coordinated through SSM Parameter Store.

```mermaid
flowchart LR
  User[Player or GM] --> Frontend[React + Vite Frontend]
  Frontend --> Cognito[Cognito User Pool]
  Frontend --> AppSync[AppSync GraphQL API]
  AppSync --> Lambda[Lambda Resolvers]
  Lambda --> RDS[(Amazon RDS for PostgreSQL)]
  CLI[UF CLI] --> NetworkStack[stack-network]
  CLI --> AuthStack[stack-auth]
  CLI --> DataStack[stack-data]
  CLI --> BackendStack[stack-backend]
  CLI --> FrontendStack[stack-frontend]
  NetworkStack --> SSM[SSM Parameter Store]
  AuthStack --> SSM
  DataStack --> SSM
  FrontendStack --> SSM
  BackendStack --> SSM
```

## Frontend responsibilities

- Authenticate users with Amplify + Cognito.
- Render protected pages for characters, campaigns, skills, and admin tools.
- Enforce the 20-character client-side cap.
- Present fantasy-themed components via shared design tokens.

## Backend responsibilities

- Authorize users from AppSync identity metadata.
- Enforce ownership and admin rules.
- Persist characters, campaigns, and skills in PostgreSQL tables on Amazon RDS.
- Expose focused GraphQL query and mutation handlers.
