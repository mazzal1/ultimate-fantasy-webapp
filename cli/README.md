# Ultimate Fantasy CLI

## Commands

- `uf-cli deploy --stage dev`
- `uf-cli teardown --stage dev`
- `uf-cli migrate --stage dev`
- `uf-cli seed --stage dev`
- `uf-cli status --stage dev`

## Environment variables

- `UF_STAGE`
- `UF_REGION`
- `UF_STACK_NAME` (stack name prefix; default `ultimate-fantasy-<stage>`)
- `AWS_REGION`

When no region is provided explicitly, the CLI defaults to `eu-west-1`.

## Stack orchestration

The deploy/status/teardown commands orchestrate:

1. `<prefix>-network`
2. `<prefix>-auth`
3. `<prefix>-data`
4. `<prefix>-backend`
5. `<prefix>-frontend`

Cross-stack values are synchronized through SSM Parameter Store paths scoped by stage (`/ultimate-fantasy/<stage>/...`).

If a stack is detected in `ROLLBACK_COMPLETE` during deploy, the CLI deletes that stack and retries deployment automatically.

The CLI shells out to AWS SAM for deploy and teardown, and uses the AWS SDK for status and parameter helpers.

After the frontend stack is deployed, the CLI builds `../frontend/` with Cognito and AppSync values resolved from the deployed `auth` and `backend` stack outputs, syncs `../frontend/dist/` to the provisioned S3 bucket using `aws s3 sync --delete` (excluding `.DS_Store` files), and requests a CloudFront invalidation for `/*`.
