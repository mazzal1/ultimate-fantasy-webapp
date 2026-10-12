# Deployment

## Stages

- `dev`: fast iteration
- `delivery`: pre-production validation
- `prod`: live environment

## Stack topology

Infrastructure is split into five CloudFormation/SAM stacks deployed in this order:

1. `stack-network`
2. `stack-auth`
3. `stack-data`
4. `stack-backend` (AppSync + Lambda resolvers, with GraphQL schema in [schema.graphql](../backend/schema.graphql))
5. `stack-frontend`

The CLI deploys them with names `<stack-prefix>-<stack-key>`, for example:

- `ultimate-fantasy-dev-network`
- `ultimate-fantasy-dev-auth`
- `ultimate-fantasy-dev-data`
- `ultimate-fantasy-dev-backend`
- `ultimate-fantasy-dev-frontend`

## SSM synchronization strategy

Every stack writes its shared outputs in SSM Parameter Store under:

- `/ultimate-fantasy/<stage>/network/*`
- `/ultimate-fantasy/<stage>/auth/*`
- `/ultimate-fantasy/<stage>/data/*`
- `/ultimate-fantasy/<stage>/frontend/*`

Consumer stacks read upstream values through CloudFormation parameters of type `AWS::SSM::Parameter::Value<...>`, which keeps stacks loosely coupled and environment-aware.

## Using SAM directly

```bash
sam deploy --template-file infrastructure/stacks/stack-network.yaml --stack-name ultimate-fantasy-dev-network --region eu-west-1 --resolve-s3 --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM --parameter-overrides Stage=dev
sam deploy --template-file infrastructure/stacks/stack-auth.yaml --stack-name ultimate-fantasy-dev-auth --region eu-west-1 --resolve-s3 --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM --parameter-overrides Stage=dev
sam deploy --template-file infrastructure/stacks/stack-data.yaml --stack-name ultimate-fantasy-dev-data --region eu-west-1 --resolve-s3 --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM --parameter-overrides Stage=dev NetworkPrivateSubnetIdsParameter=/ultimate-fantasy/dev/network/private-subnet-ids NetworkDatabaseSecurityGroupIdParameter=/ultimate-fantasy/dev/network/database-security-group-id NetworkLambdaSecurityGroupIdParameter=/ultimate-fantasy/dev/network/lambda-security-group-id
sam deploy --template-file backend/template.yaml --stack-name ultimate-fantasy-dev-backend --region eu-west-1 --resolve-s3 --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM --parameter-overrides Stage=dev CognitoUserPoolId=/ultimate-fantasy/dev/auth/user-pool-id CognitoUserPoolClientId=/ultimate-fantasy/dev/auth/user-pool-client-id LambdaSubnetIds=/ultimate-fantasy/dev/network/private-subnet-ids LambdaSecurityGroupId=/ultimate-fantasy/dev/network/lambda-security-group-id SharedLambdaExecutionRoleArn=/ultimate-fantasy/dev/network/shared-lambda-role-arn PostgresUri=/ultimate-fantasy/dev/data/postgres-uri
sam deploy --template-file infrastructure/stacks/stack-frontend.yaml --stack-name ultimate-fantasy-dev-frontend --region eu-west-1 --resolve-s3 --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM --parameter-overrides Stage=dev
```

## Using the CLI

```bash
cd cli
node ./bin/uf-cli.js deploy --stage dev
node ./bin/uf-cli.js status --stage dev
```

Use `--stack-name` to override the prefix (default: `ultimate-fantasy-<stage>`).

## Teardown

```bash
cd cli
node ./bin/uf-cli.js teardown --stage dev
```
