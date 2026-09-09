import { execSync } from 'node:child_process';
import { logger } from '../utils/logger.js';

export async function teardownCommand(config) {
  logger.warn(`Tearing down stack ${config.stackName}`);
  execSync(`sam delete --stack-name ${config.stackName} --region ${config.region} --no-prompts`, { stdio: 'inherit' });
  logger.success(`Stack ${config.stackName} deleted.`);
}
