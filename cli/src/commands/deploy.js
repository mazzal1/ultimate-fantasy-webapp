import { execSync } from 'node:child_process';
import { logger } from '../utils/logger.js';

export async function deployCommand(config) {
  logger.info(`Deploying stage ${config.stage} in ${config.region}`);
  execSync(`sam deploy --config-env ${config.stage}`, { stdio: 'inherit' });
  logger.success(`Deployment command finished for ${config.stackName}`);
}
