# Deployment

## Stages

- `dev`: fast iteration
- `delivery`: pre-production validation
- `prod`: live environment

## Parameter strategy

- `CognitoUserPoolId` and `CognitoUserPoolClientId` are explicit SAM parameters.
- `DocumentDbUri` is loaded from SSM Parameter Store.
- Frontend runtime values are provided through Vite environment variables.

## Using SAM directly

```bash
cd backend
sam build
sam deploy --config-env dev
sam deploy --config-env delivery
sam deploy --config-env prod
```

## Using the CLI

```bash
cd cli
node ./bin/uf-cli.js deploy --stage dev
node ./bin/uf-cli.js status --stage dev
```

## Teardown

```bash
cd cli
node ./bin/uf-cli.js teardown --stage dev
```
