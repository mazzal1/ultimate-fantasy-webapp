import { createCloudFormationClient, describeStack } from '../utils/aws.js';
import { logger } from '../utils/logger.js';

export async function statusCommand(config) {
  const client = createCloudFormationClient(config.region);
  const stack = await describeStack(client, config.stackName);

  if (!stack) {
    logger.warn(`Stack ${config.stackName} was not found.`);
    return;
  }

  logger.success(`${stack.StackName}: ${stack.StackStatus}`);
  (stack.Outputs ?? []).forEach((output) => {
    logger.info(`${output.OutputKey}: ${output.OutputValue}`);
  });
}
