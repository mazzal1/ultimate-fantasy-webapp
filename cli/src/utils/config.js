export function loadConfigFromArgv(argv = []) {
  const args = new Map();

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      continue;
    }

    args.set(token.slice(2), argv[index + 1]);
    index += 1;
  }

  const stage = args.get('stage') || process.env.UF_STAGE || 'dev';
  const region = args.get('region') || process.env.UF_REGION || process.env.AWS_REGION || 'us-east-1';
  const stackName = args.get('stack-name') || process.env.UF_STACK_NAME || `ultimate-fantasy-${stage}`;

  return { stage, region, stackName };
}
