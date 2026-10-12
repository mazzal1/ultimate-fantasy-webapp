import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

export function createCloudFormationClient(region) {
  return new CloudFormationClient({ region });
}

export function createSsmClient(region) {
  return new SSMClient({ region });
}

export async function describeStack(client, stackName) {
  try {
    const response = await client.send(new DescribeStacksCommand({ StackName: stackName }));
    return response.Stacks?.[0] ?? null;
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return null;
    }

    throw error;
  }
}

export async function getSecureParameter(client, name) {
  const response = await client.send(new GetParameterCommand({ Name: name, WithDecryption: true }));
  return response.Parameter?.Value ?? null;
}

export function getStackOutputValue(stack, outputKey) {
  if (!stack?.Outputs) {
    return null;
  }

  const matchingOutput = stack.Outputs.find((output) => output.OutputKey === outputKey);
  return matchingOutput?.OutputValue ?? null;
}
