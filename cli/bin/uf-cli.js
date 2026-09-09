#!/usr/bin/env node
import { deployCommand } from '../src/commands/deploy.js';
import { teardownCommand } from '../src/commands/teardown.js';
import { migrateCommand } from '../src/commands/migrate.js';
import { seedCommand } from '../src/commands/seed.js';
import { statusCommand } from '../src/commands/status.js';
import { loadConfigFromArgv } from '../src/utils/config.js';
import { logger } from '../src/utils/logger.js';

const [, , command, ...rest] = process.argv;
const config = loadConfigFromArgv(rest);

const commands = {
  deploy: deployCommand,
  teardown: teardownCommand,
  migrate: migrateCommand,
  seed: seedCommand,
  status: statusCommand,
};

if (!command || !commands[command]) {
  logger.error('Usage: uf-cli <deploy|teardown|migrate|seed|status> [--stage <name>] [--region <aws-region>]');
  process.exit(1);
}

commands[command](config).catch((error) => {
  logger.error(error instanceof Error ? error.message : 'Unknown CLI error');
  process.exit(1);
});
