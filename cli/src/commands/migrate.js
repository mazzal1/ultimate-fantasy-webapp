import { logger } from '../utils/logger.js';

export async function migrateCommand(config) {
  logger.info(`Running placeholder migration flow for ${config.stage}.`);
  logger.success('RDS Postgres schema bootstrap now runs automatically at Lambda startup; no additional CLI migration step is required.');
}
