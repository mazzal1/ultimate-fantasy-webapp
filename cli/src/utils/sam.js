import { spawnSync } from 'node:child_process';

function runSamCommand(args) {
  const result = spawnSync('sam', args, { stdio: 'inherit' });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`sam ${args[0]} failed with exit code ${result.status ?? 'unknown'}`);
  }
}

export function deployStack({ templatePath, stackName, region, parameters }) {
  const args = [
    'deploy',
    '--template-file',
    templatePath,
    '--stack-name',
    stackName,
    '--region',
    region,
    '--resolve-s3',
    '--capabilities',
    'CAPABILITY_IAM',
    'CAPABILITY_NAMED_IAM',
    '--no-confirm-changeset',
    '--no-fail-on-empty-changeset',
  ];

  if (parameters.length > 0) {
    args.push('--parameter-overrides', ...parameters);
  }

  runSamCommand(args);
}

export function deleteStack({ stackName, region }) {
  runSamCommand([
    'delete',
    '--stack-name',
    stackName,
    '--region',
    region,
    '--no-prompts',
  ]);
}
