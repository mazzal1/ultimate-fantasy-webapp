import { logger } from '../utils/logger.js';
import { deleteStack } from '../utils/sam.js';
import { getStackPlan } from '../utils/stacks.js';

export async function teardownCommand(config) {
  logger.warn(`Tearing down stack group ${config.stackName}`);

  const stackPlan = getStackPlan(config).reverse();
  for (const stack of stackPlan) {
    logger.warn(`Deleting ${stack.key} stack (${stack.stackName})`);
    deleteStack({
      stackName: stack.stackName,
      region: config.region,
    });
    logger.success(`${stack.key} stack deleted.`);
  }
}
