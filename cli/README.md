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
- `UF_STACK_NAME`
- `AWS_REGION`

When no region is provided explicitly, the CLI defaults to `eu-west-1`.

The CLI shells out to AWS SAM for deploy and teardown, and uses the AWS SDK for status and parameter helpers.
