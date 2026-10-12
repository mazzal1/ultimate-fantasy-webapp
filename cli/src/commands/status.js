import { createCloudFormationClient, describeStack } from '../utils/aws.js';
import { logger } from '../utils/logger.js';
import { getStackPlan } from '../utils/stacks.js';

export async function statusCommand(config) {
  const client = createCloudFormationClient(config.region);

  for (const stackPlan of getStackPlan(config)) {
    const stack = await describeStack(client, stackPlan.stackName);

    if (!stack) {
      logger.warn(`Stack ${stackPlan.stackName} was not found.`);
      continue;
    }

    logger.success(`${stack.StackName}: ${stack.StackStatus}`);
    (stack.Outputs ?? []).forEach((output) => {
      logger.info(`${output.OutputKey}: ${output.OutputValue}`);
    });
  }
}
