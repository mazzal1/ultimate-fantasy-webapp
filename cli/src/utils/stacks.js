import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const cliUtilsDirectory = path.dirname(currentFilePath);
const repositoryRoot = path.resolve(cliUtilsDirectory, '../../..');
const stackTemplateDirectory = path.join(repositoryRoot, 'infrastructure', 'stacks');

function buildSsmPath(stage, suffix) {
  return `/ultimate-fantasy/${stage}/${suffix}`;
}

export function getStackPlan(config) {
  const { stage } = config;

  const baseParameters = [`Stage=${stage}`];

  return [
    {
      key: 'network',
      stackName: `${config.stackName}-network`,
      templatePath: path.join(stackTemplateDirectory, 'stack-network.yaml'),
      parameters: baseParameters,
    },
    {
      key: 'auth',
      stackName: `${config.stackName}-auth`,
      templatePath: path.join(stackTemplateDirectory, 'stack-auth.yaml'),
      parameters: baseParameters,
    },
    {
      key: 'data',
      stackName: `${config.stackName}-data`,
      templatePath: path.join(stackTemplateDirectory, 'stack-data.yaml'),
      parameters: [
        ...baseParameters,
        `NetworkPrivateSubnetIdsParameter=${buildSsmPath(stage, 'network/private-subnet-ids')}`,
        `NetworkDatabaseSecurityGroupIdParameter=${buildSsmPath(stage, 'network/database-security-group-id')}`,
      ],
    },
    {
      key: 'backend',
      stackName: `${config.stackName}-backend`,
      templatePath: path.join(repositoryRoot, 'backend', 'template.yaml'),
      parameters: [
        ...baseParameters,
        `CognitoUserPoolId=${buildSsmPath(stage, 'auth/user-pool-id')}`,
        `CognitoUserPoolClientId=${buildSsmPath(stage, 'auth/user-pool-client-id')}`,
        `LambdaSubnetIds=${buildSsmPath(stage, 'network/private-subnet-ids')}`,
        `LambdaSecurityGroupId=${buildSsmPath(stage, 'network/lambda-security-group-id')}`,
        `SharedLambdaExecutionRoleArn=${buildSsmPath(stage, 'network/shared-lambda-role-arn')}`,
        `PostgresUri=${buildSsmPath(stage, 'data/postgres-uri')}`,
      ],
    },
    {
      key: 'frontend',
      stackName: `${config.stackName}-frontend`,
      templatePath: path.join(stackTemplateDirectory, 'stack-frontend.yaml'),
      parameters: baseParameters,
    },
  ];
}
