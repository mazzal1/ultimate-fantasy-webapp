import { existsSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const cliUtilsDirectory = path.dirname(currentFilePath);
const repositoryRoot = path.resolve(cliUtilsDirectory, '../../..');
const frontendDirectory = path.join(repositoryRoot, 'frontend');
const frontendDistDirectory = path.join(frontendDirectory, 'dist');

function runCommand(command, args, options = {}) {
  const commandArguments = command === 'aws' ? ['--no-cli-pager', ...args] : args;
  const result = spawnSync(command, commandArguments, {
    stdio: 'inherit',
    ...options,
    env: {
      ...process.env,
      ...(command === 'aws' ? { AWS_PAGER: '' } : {}),
      ...options.env,
    },
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status ?? 'unknown'}`);
  }
}

export function buildFrontend(environmentVariables = {}) {
  runCommand('npm', ['run', 'build'], {
    cwd: frontendDirectory,
    env: {
      ...process.env,
      ...environmentVariables,
    },
  });

  if (!existsSync(frontendDistDirectory)) {
    throw new Error(`Frontend build did not produce dist directory at ${frontendDistDirectory}`);
  }
}

export function syncFrontendDistToS3(bucketName) {
  if (!bucketName) {
    throw new Error('Cannot sync frontend dist files because S3 bucket name is missing.');
  }

  runCommand('aws', [
    's3',
    'sync',
    frontendDistDirectory,
    `s3://${bucketName}`,
    '--delete',
    '--exclude',
    '.DS_Store',
    '--exclude',
    '*/.DS_Store',
  ]);
}

export function invalidateCloudFrontCache(distributionId) {
  if (!distributionId) {
    throw new Error('Cannot invalidate CloudFront cache because distribution ID is missing.');
  }

  runCommand('aws', [
    'cloudfront',
    'create-invalidation',
    '--distribution-id',
    distributionId,
    '--paths',
    '/*',
  ]);
}
