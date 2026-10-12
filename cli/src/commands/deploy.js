import { logger } from '../utils/logger.js';
import { createCloudFormationClient, describeStack, getStackOutputValue } from '../utils/aws.js';
import { buildFrontend, invalidateCloudFrontCache, syncFrontendDistToS3 } from '../utils/frontend.js';
import { deleteStack, deployStack } from '../utils/sam.js';
import { getStackPlan } from '../utils/stacks.js';

export async function deployCommand(config) {
  logger.info(`Deploying stage ${config.stage} in ${config.region} with split infrastructure stacks`);
  const cloudFormationClient = createCloudFormationClient(config.region);
  const deployedStacksByKey = new Map();

  for (const stack of getStackPlan(config)) {
    const existingStack = await describeStack(cloudFormationClient, stack.stackName);
    if (existingStack?.StackStatus === 'ROLLBACK_COMPLETE') {
      logger.warn(
        `${stack.stackName} is in ROLLBACK_COMPLETE. Deleting stack before redeploying.`,
      );
      deleteStack({
        stackName: stack.stackName,
        region: config.region,
      });
      logger.success(`${stack.stackName} deleted.`);
    }

    logger.info(`Deploying ${stack.key} stack (${stack.stackName})`);
    deployStack({
      templatePath: stack.templatePath,
      stackName: stack.stackName,
      region: config.region,
      parameters: stack.parameters,
    });

    const deployedStack = await describeStack(cloudFormationClient, stack.stackName);
    deployedStacksByKey.set(stack.key, deployedStack);

    if (stack.key === 'frontend') {
      const frontendBucketName = getStackOutputValue(deployedStack, 'FrontendBucketName');
      const cloudFrontDistributionId = getStackOutputValue(deployedStack, 'CloudFrontDistributionId');
      const authStack = deployedStacksByKey.get('auth');
      const backendStack = deployedStacksByKey.get('backend');
      const userPoolId = getStackOutputValue(authStack, 'UserPoolId');
      const userPoolClientId = getStackOutputValue(authStack, 'UserPoolClientId');
      const graphqlEndpoint = getStackOutputValue(backendStack, 'GraphQlApiUrl');

      if (!frontendBucketName) {
        throw new Error(
          `Could not determine FrontendBucketName output from stack ${stack.stackName} after deployment.`,
        );
      }

      if (!cloudFrontDistributionId) {
        throw new Error(
          `Could not determine CloudFrontDistributionId output from stack ${stack.stackName} after deployment.`,
        );
      }

      if (!userPoolId || !userPoolClientId || !graphqlEndpoint) {
        throw new Error(
          'Could not determine frontend runtime configuration from deployed auth/backend stack outputs.',
        );
      }

      logger.info('Building frontend application');
      buildFrontend({
        VITE_AWS_REGION: config.region,
        VITE_COGNITO_USER_POOL_ID: userPoolId,
        VITE_COGNITO_USER_POOL_CLIENT_ID: userPoolClientId,
        VITE_APPSYNC_GRAPHQL_ENDPOINT: graphqlEndpoint,
        VITE_APPSYNC_AUTH_TYPE: 'AMAZON_COGNITO_USER_POOLS',
      });

      logger.info(`Syncing frontend dist files to s3://${frontendBucketName}`);
      syncFrontendDistToS3(frontendBucketName);
      logger.success('Frontend dist files uploaded');

      logger.info(`Invalidating CloudFront cache for distribution ${cloudFrontDistributionId}`);
      invalidateCloudFrontCache(cloudFrontDistributionId);
      logger.success('CloudFront cache invalidation requested');
    }

    logger.success(`${stack.key} stack deployed`);
  }

  logger.success(`Deployment command finished for ${config.stackName}`);
}
