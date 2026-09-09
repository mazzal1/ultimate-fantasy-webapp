import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

export function createCloudFormationClient(region) {
  return new CloudFormationClient({ region });
}

export function createSsmClient(region) {
  return new SSMClient({ region });
}

export async function describeStack(client, stackName) {
  const response = await client.send(new DescribeStacksCommand({ StackName: stackName }));
  return response.Stacks?.[0] ?? null;
}

export async function getSecureParameter(client, name) {
  const response = await client.send(new GetParameterCommand({ Name: name, WithDecryption: true }));
  return response.Parameter?.Value ?? null;
}
